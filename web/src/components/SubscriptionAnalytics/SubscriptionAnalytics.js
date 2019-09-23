import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { api } from '../../services/api';
import './SubscriptionAnalytics.css';

export default function SubscriptionAnalytics() {
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        (async function loadSubscriptions() {
            const response = await api.get('/campaigns', {});

            const universities = [];
            if (response.data) {
                response.data.map((campaign) => {
                    universities.push({
                        university: campaign.university.name,
                        Subscriptions: campaign.subscriptions.length,
                    });
                    return true;
                });

                setSubscriptions(universities);
            }
        })();
    }, []);
    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Subscriptions
            </Typography>
            <ResponsiveContainer className="barchart">
                <BarChart
                    width={500}
                    height={300}
                    data={subscriptions}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="university" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Subscriptions" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}
