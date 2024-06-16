import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Game from './components/Game.jsx';
import Profile from './components/Profile.jsx';
import History from './components/History.jsx';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/game" component={Game} />
                <Route path="/profile" component={Profile} />
                <Route path="/history" component={History} />
            </Switch>
        </Router>
    );
};

export default App;
