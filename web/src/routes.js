import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import LandingPage from './components/LandingPage/LandingPage';

export default function Routes() {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Login} />
            <Route path="/dashboard/" component={Dashboard} />
            <Route path="/subscribe/:campaignId" exact component={LandingPage} />
        </BrowserRouter>
    );
}
