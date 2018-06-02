import React from 'react';
import registerServiceWorker from './registerServiceWorker'
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Title, List } from './components/App';
import login from './components/login'
import getuser from './components/get_user'
import './index.css';
ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={login} />
            <Route path="/getUser/:id/:type?/:subtype?" component={getuser} />
        </div>
    </Router>,
    document.getElementById('root')
);

registerServiceWorker()