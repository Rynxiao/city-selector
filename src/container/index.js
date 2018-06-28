import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";

import App from '../pages/app/App';
import City from '../pages/city/City';

class Index extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={ App } />
                <Route path="/city" component={ City } />
            </Switch>
        );
    }
}

export default Index;