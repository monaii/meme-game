// client/src/components/History.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/user-history', { withCredentials: true });
                setHistory(response.data.games);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="history-container">
            <h2>Your Game History</h2>
            {history.length === 0 ? (
                <p>No game history found.</p>
            ) : (
                <div className="history-list">
                    {history.map((game, index) => (
                        <div key={index} className="game-history-item">
                            <h3>Game {index + 1}</h3>
                            <p>Total Score: {game.total_score}</p>
                            <div className="round-history">
                                {game.rounds.map((round, roundIndex) => (
                                    <div key={roundIndex} className="round-history-item">
                                        <p>Round {roundIndex + 1}</p>
                                        <img src={round.meme_image_url} alt={`Meme ${round.meme_id}`} />
                                        <p>Selected Caption: {round.selected_caption_text}</p>
                                        <p>Score: {round.score}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;