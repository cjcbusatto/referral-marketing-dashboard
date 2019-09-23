import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import UniversityIcon from '@material-ui/icons/School';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from '../SnackbarContentWrapper/SnackbarContentWrapper';
import Paper from '@material-ui/core/Paper';
import Copyright from '../Copyright/Copyright';
import { api } from '../../services/api';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        margin: 20,
        padding: theme.spacing(6),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    paperForm: {
        margin: 20,
        padding: theme.spacing(15),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    avatar: {
        marginLeft: '45%',
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        flexBasis: '100%',
        flex: 1,
    },
}));

export default function SubscriptionPage(props) {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [campaignId, setCampaignId] = useState('');
    const [campaignEndDate, setCampaignEndDate] = useState(null);
    const [subscriptions, setSubscriptions] = useState(0);
    const [universityName, setUniversityName] = useState(null);
    const [discountRules, setDiscountRules] = useState([]);

    // Snackbar states
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackbarVariant, setSnackbarVariant] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const campaignId = props.match.params.campaignId;
        (async function loadCampaign() {
            const response = await api.get(`/campaigns/${campaignId}`, {});

            setDiscountRules(response.data.discountMode.rules);
            setSubscriptions(response.data.subscriptions.length);
            setCampaignId(response.data._id);
            setCampaignEndDate(response.data.endDate);
            setUniversityName(response.data.university.name);
        })();
    }, [props.match.params.campaignId]);

    async function handleSubmit(event) {
        event.preventDefault();
        // Send the new campaign request to the API
        let response = await api.post('/students', {
            name,
            email,
        });

        if (response.status === 200) {
            const studentId = response.data._id;
            response = await api.put(`/campaigns/${campaignId}`, {
                studentId,
            });
            if (response.status === 200) {
                // Inform user about the success request
                setSnackbarVariant('success');
                setSnackbarMessage('You subscribed to the discount group!');
                setSnackOpen(true);

                // Increase the number of subscriptions on the page
                setSubscriptions(subscriptions + 1);
            } else {
                // Inform user about errors in the request
                setSnackbarVariant('error');
                setSnackbarMessage('Error! You were not subscribed!');
                setSnackOpen(true);
            }
        }
    }

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setSnackOpen(false);
    }
    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <CssBaseline />
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Are you a student of {universityName}?
                        </Typography>
                        <Typography>
                            If yes, there is an active group of discounts happening right now!
                        </Typography>

                        <br />
                        <Typography component="h2" variant="h6">
                            <b>How does it work?</b>
                        </Typography>
                        <Typography>
                            Register your name and e-mail to the group by midnight{' '}
                            <Moment format="DD/MM/YYYY">{campaignEndDate}</Moment>. After the
                            deadline, based on the number of subscriptions, we will send to you a
                            promotional code to be used in your purchase!
                        </Typography>
                        <br />
                        <Typography component="h2" variant="h6">
                            <b>What are the possible discounts?</b>
                        </Typography>
                        <Typography>
                            {discountRules.map((rule) => (
                                <Typography>
                                    <b>{rule.numberOfPeople} people</b> subscribed give to the
                                    university <b>{rule.discountGiven}% off</b>!
                                </Typography>
                            ))}
                        </Typography>
                        <br />
                        <Typography component="h2" variant="h6">
                            <b>How is my university going so far?</b>
                        </Typography>
                        <Typography>
                            Your university has already {subscriptions} subscriptions!
                        </Typography>
                        <Typography>
                            <b>Signup</b> and do not forget to invite your colleagues using this
                            link: <a href={window.location.href}>{window.location.href}</a>
                        </Typography>
                        <Typography>Remember, more people, bigger are the discounts!</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paperForm}>
                        <Avatar className={classes.avatar}>
                            <UniversityIcon />
                        </Avatar>

                        <Typography component="h1" variant="h5">
                            Referral Marketing Dashboard
                        </Typography>
                        <form className={classes.form} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="name"
                                label="Name"
                                type="text"
                                id="name"
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                className={classes.submit}
                            >
                                Subscribe
                            </Button>
                        </form>
                    </Paper>
                </Grid>
                {/* Snackbar informing statuses */}
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
                <Grid item xs={12}>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}
