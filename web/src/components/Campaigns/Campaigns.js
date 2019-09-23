import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Hourglass from '@material-ui/icons/AccessTime';
import Finished from '@material-ui/icons/DoneRounded';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import FinishCampaignIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from '../SnackbarContentWrapper/SnackbarContentWrapper';
import LandingPageIcon from '@material-ui/icons/Public';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import { api } from '../../services/api';

const useStyles = makeStyles((theme) => ({
    finished: {
        color: 'green',
    },
    inProgress: {
        color: '#ffc107',
    },
    actions: {
        color: '#6C6C6C',
    },
}));

export default function Campaigns(props) {
    const [campaigns, setCampaigns] = useState([]);
    const today = Math.round(new Date().getTime());
    const classes = useStyles();
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackbarVariant, setSnackbarVariant] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        (async function loadCampaigns() {
            const response = await api.get('/campaigns', {});
            if (response.data) {
                setCampaigns(response.data);
            }
        })();
    }, []);

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setSnackOpen(false);
    }

    async function deleteCampaign(campaignId) {
        const response = await api.delete(`/campaigns/${campaignId}`, {});
        if (response.status === 200) {
            setCampaigns(campaigns.filter((campaign) => campaign._id !== campaignId));
        }
    }
    async function createPromotionalCode(campaignId, universityId) {
        // Create promotional code
        let createPromotionalCodeResponse = await api.post(`/promotionalcodes/`, {
            campaignId: campaignId,
        });

        if (createPromotionalCodeResponse.status === 200) {
            // Send email marketing for the students subscribed
            const discount = createPromotionalCodeResponse.data.discount;
            const code = createPromotionalCodeResponse.data.code;
            const emailMarketingResponse = await api.post('/emailmarketings/', {
                subject: 'Your promotional code is available!',
                content: `Use the promotional code ${code} to guarantee ${discount}% off`,
                university: universityId,
            });
            if (emailMarketingResponse.status === 200) {
                setSnackbarVariant('success');
                setSnackbarMessage(`Code created: ${code}! Subscribers are notified by email!`);
                setSnackOpen(true);
            } else {
                setSnackbarVariant('error');
                setSnackbarMessage(`Error creating a promotional code!`);
                setSnackOpen(true);
            }
        }
    }
    async function createEmailMarketing(campaign) {
        const campaignId = campaign._id;
        const universityId = campaign.university._id;
        const universityName = campaign.university.name;

        const baseUrl = window.location.origin;
        const emailMarketingResponse = await api.post('/emailmarketings/', {
            subject: 'Do not forget about the group discount campaign!',
            content: `Invite your friends with the link ${baseUrl}/subscribe/${campaignId} to guarantee discounts!`,
            university: universityId,
        });

        if (emailMarketingResponse.status === 200) {
            setSnackbarVariant('success');
            setSnackbarMessage(`Reminder email send to all the contacts studying at ${universityName}!`);
            setSnackOpen(true);
        } else {
            setSnackbarVariant('error');
            setSnackbarMessage(`There was an error sending the reminder e-mail!`);
            setSnackOpen(true);
        }
    }

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Campaigns
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>University</TableCell>
                        <TableCell>Discount mode (Subscriptions - Discount)</TableCell>
                        <TableCell>Subscriptions</TableCell>
                        <TableCell>End date</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {campaigns.map((campaign) => (
                        <TableRow key={campaign._id}>
                            <TableCell>
                                {campaign.endDate > today ? (
                                    <Tooltip title="In progress">
                                        <Hourglass className={classes.inProgress} />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Finished">
                                        <Finished className={classes.finished} />
                                    </Tooltip>
                                )}
                            </TableCell>
                            <TableCell>{campaign.university.name}</TableCell>
                            <TableCell>
                                {campaign.discountMode.rules.map((rule) => {
                                    return `${rule.numberOfPeople} - ${rule.discountGiven}% `;
                                })}
                            </TableCell>
                            <TableCell>{campaign.subscriptions.length}</TableCell>

                            <TableCell>
                                <Moment fromNow>{campaign.endDate}</Moment>
                            </TableCell>
                            <TableCell align="right">
                                <Button onClick={() => deleteCampaign(campaign._id)}>
                                    <Tooltip title="Delete campaign">
                                        <DeleteIcon className={classes.actions} />
                                    </Tooltip>
                                </Button>
                                <Button onClick={() => createEmailMarketing(campaign)}>
                                    <Tooltip title="Send reminder">
                                        <EmailIcon className={classes.actions} />
                                    </Tooltip>
                                </Button>
                                <Link to={`/subscribe/${campaign._id}`}>
                                    <Button>
                                        <Tooltip title="Visit landing page">
                                            <LandingPageIcon className={classes.actions} />
                                        </Tooltip>
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() =>
                                        createPromotionalCode(campaign._id, campaign.university._id)
                                    }
                                >
                                    <Tooltip title="Finish campaign">
                                        <FinishCampaignIcon className={classes.actions} />
                                    </Tooltip>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={snackOpen}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <SnackbarContentWrapper
                        onClose={handleClose}
                        variant={snackbarVariant}
                        message={snackbarMessage}
                    />
                </Snackbar>
            </div>
        </React.Fragment>
    );
}
