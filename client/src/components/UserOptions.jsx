// client/src/components/UserOptions.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/UserOptions.css';

const UserOptions = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3001/auth/logout');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="user-options-container">
            <h2>Welcome! What would you like to do?</h2>
            <div className="button-container">
                <button className="option-button" onClick={() => navigate('/history')}>View Game History</button>
                <button className="option-button" onClick={() => navigate('/game')}>Start New Game</button>
                <button className="option-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default UserOptions;