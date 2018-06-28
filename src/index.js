import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './static/styles/index.css';
import Container from './container';
import registerServiceWorker from './static/scripts/registerServiceWorker';

ReactDOM.render(
    <Router>
        <Route component={ Container } />
    </Router>, 
    document.getElementById('root')
);
registerServiceWorker();
