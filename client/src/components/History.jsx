// client/src/components/History.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/History.css';
import { UserContext } from '../context/UserContext';

const History = () => {
    const [games, setGames] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGameHistory = async () => {
            if (user && user.id) {
                try {
                    const res = await axios.get(`http://localhost:3001/api/game-history/${user.id}`);
                    setGames(res.data.games);
                } catch (error) {
                    console.error('Error fetching game history:', error);
                }
            }
        };

        fetchGameHistory();
    }, [user]);

    const handleDeleteHistory = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/game-history/${user.id}`);
            setGames([]); // Clear history in state
        } catch (error) {
            console.error('Error deleting history:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3001/auth/logout');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div>
            <h2>Game History</h2>
            {games.length === 0 ? (
                <p>No games played yet.</p>
            ) : (
                games.map((game) => (
                    <div key={game.id} className="game-summary">
                        <h3>Game {game.id}</h3>
                        <p>Total Score: {game.total_score}</p>
                        {game.rounds.map((round, index) => (
                            <div key={round.id} className="round-summary">
                                <h4>Round {index + 1}</h4>
                                <img src={round.meme.image_url} alt="Meme" />
                                <p>Selected Caption: {round.caption.text}</p>
                                <p>Score: {round.score}</p>
                            </div>
                        ))}
                    </div>
                ))
            )}
            <button onClick={handleDeleteHistory}>Delete History</button>
            <button onClick={() => navigate('/options')}>Back to Options</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default History;