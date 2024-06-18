import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Game from './components/Game';
import History from "./components/History.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/game" element={<Game />} />
                <Route path="/History" element={<History />} />
            </Routes>
        </Router>
    );
};

export default App;
