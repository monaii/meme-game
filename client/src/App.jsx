// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Game from './components/Game';
import History from './components/History';
import UserOptions from './components/UserOptions';
import { UserProvider } from './context/UserContext';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/options" element={<UserOptions />} /> {/* New route */}
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;