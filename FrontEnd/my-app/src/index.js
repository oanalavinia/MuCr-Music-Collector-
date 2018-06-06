import React from 'react';
import registerServiceWorker from './registerServiceWorker'
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Title, List } from './components/App';
import register from './components/register'
import login from './components/login'
import getuser from './components/get_user'
import add_item from './components/add_item'
import './index.css';
ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={login} />
            <Route path="/register" component={register}/>
            <Route path="/getUser/:id/:type?/:subtype?" component={getuser} />
            <Route path="/addItem/:type" component={add_item}/>
        </div>
    </Router>,
    document.getElementById('root')
);

registerServiceWorker()