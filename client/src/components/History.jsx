import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('/api/history');
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div>
            <h2>Game History</h2>
            {history.length === 0 ? (
                <p>No games played yet.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Game ID</th>
                        <th>Total Score</th>
                        <th>Meme ID</th>
                        <th>Selected Caption ID</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.map((game, index) => (
                        <tr key={index}>
                            <td>{game.gameId}</td>
                            <td>{game.totalScore}</td>
                            <td>{game.memeId}</td>
                            <td>{game.selectedCaptionId}</td>
                            <td>{game.score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default History;
