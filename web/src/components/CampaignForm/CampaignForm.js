/* eslint-disable no-script-url */

import React, { useState, useRef, Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { DatePicker } from '@material-ui/pickers';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from '../SnackbarContentWrapper/SnackbarContentWrapper';
import Button from '@material-ui/core/Button';
import { api } from '../../services/api';
import './CampaignForm.css';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 20,
    },
    createCampaignButton: {
        marginTop: 15,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    campaignFormItem: { flexGrow: 2 },
}));

export default function CampaignForm() {
    const classes = useStyles();
    const [universities, setUniversities] = useState([]);
    const [discountModes, setDiscountModes] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [selectedDiscountMode, setSelectedDiscountMode] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [snackbarVariant, setSnackbarVariant] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const inputLabel = useRef(null);

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }
    useEffect(() => {
        (async function loadUniversities() {
            const response = await api.get('/universities', {});
            setUniversities(response.data);
        })();
    }, []);

    useEffect(() => {
        (async function loadDiscountModes() {
            const response = await api.get('/discountmodes', {});
            setDiscountModes(response.data);
        })();
    }, []);

    async function handleSubmit(event) {
        const date = new Date(selectedEndDate);
        const endDate = date.getTime();

        // Send the new campaign request to the API
        const response = await api.post('/campaigns', {
            university: selectedUniversity,
            discountMode: selectedDiscountMode,
            endDate: endDate,
        });

        if (response.status === 200) {
            setSnackbarVariant('success');
            setSnackbarMessage('Campaign created!');
            setOpen(true);
        } else {
            setSnackbarVariant('error');
            setSnackbarMessage('Error! Campaign was not created!');
            setOpen(true);
        }
    }

    return (
        <Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Create a new campaign
            </Typography>
            <form className={classes.root} autoComplete="off">
                <div className={classes.row}>
                    <div className={classes.column}>
                        {/* University Select */}
                        <InputLabel ref={inputLabel} htmlFor="outlined-university-simple">
                            University
                        </InputLabel>
                        <Select
                            onChange={(e) => setSelectedUniversity(e.target.value)}
                            labelWidth={universities.name}
                            inputProps={{
                                name: 'university',
                                id: 'outlined-university-simple',
                            }}
                            value={selectedUniversity}
                        >
                            {/* University options */}
                            {universities.map((university) => {
                                return (
                                    <MenuItem key={university._id} value={university._id}>{university.name}</MenuItem>
                                );
                            })}
                        </Select>
                    </div>
                    <div className={classes.column}>
                        {/* Discount mode Select */}
                        <InputLabel ref={inputLabel} htmlFor="outlined-discount-mode-simple">
                            Discount mode
                        </InputLabel>
                        <Select
                            onChange={(e) => setSelectedDiscountMode(e.target.value)}
                            labelWidth={universities.name}
                            inputProps={{
                                name: 'discount-mode',
                                id: 'outlined-discount-mode-simple',
                            }}
                            value={selectedDiscountMode}
                        >
                            {/* University options */}
                            {discountModes.map((discountMode) => {
                                return (
                                    <MenuItem key={discountMode._id} value={discountMode._id}>
                                        {discountMode.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </div>
                </div>
                <div className={classes.row}>
                    <div className={classes.column}>
                        <InputLabel ref={inputLabel}>End date</InputLabel>
                        <DatePicker value={selectedEndDate} onChange={setSelectedEndDate} />
                    </div>
                    <div className={classes.column}>
                        <Button
                            variant="outlined"
                            className={classes.createCampaignButton}
                            onClick={handleSubmit}
                            color="primary"
                        >
                            Create
                        </Button>
                    </div>
                </div>
            </form>
            {/* Snackbar informing statuses */}
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={open}
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
        </Fragment>
    );
}
