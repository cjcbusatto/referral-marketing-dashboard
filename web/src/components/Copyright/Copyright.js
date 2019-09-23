import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
    copyrightText: {
        marginTop: '20px',
    },
}));

export default function Copyright() {
    const classes = useStyles();
    return (
        <Typography
            variant="body2"
            className={classes.copyrightText}
            color="textSecondary"
            align="center"
        >
            {'Copyright © '}
            <Link
                color="inherit"
                href="https://github.com/cjcbusatto/referral-marketing-dashboard/"
            >
                Referral Marketing Dashboard
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
