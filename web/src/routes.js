import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Main from './pages/Main';

export default function Routes() {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Login} />
            <Route path="/developer/:id/" component={Main} />
        </BrowserRouter>
    );
}
