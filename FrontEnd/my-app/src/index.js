import React from 'react';
import registerServiceWorker from './registerServiceWorker'
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Title, List } from './components/App';
import get_groups from './components/get_groups'
import register from './components/register'
import login from './components/login'
import getuser from './components/get_user'
import add_item from './components/add_item'
import get_group_info from './components/get_group_info'
import create_group from './components/create_group'
import logout from './components/logout'
import './index.css';
ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={login} />
            <Route path="/register" component={register}/>
            <Route path="/getUser/:id/:type?/:subtype?" component={getuser} />
            <Route path="/addItem/:type" component={add_item}/>
            <Route exact path="/getGroups/" component={get_groups} />
            <Route path="/getGroupInfo/:id/:type/:subtype" component={get_group_info} />
			<Route path="/createGroup/" component={create_group}/>
            <Route path="/logout/" component={logout}/>
        </div>
    </Router>,
    document.getElementById('root')
);

registerServiceWorker()