// client/src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            const userId = 1; // Replace with actual logged-in user ID
            const response = await axios.get(`http://localhost:3001/api/user-history/${userId}`);
            setGames(response.data.games);
        };

        fetchGames();
    }, []);

    return (
        <div className="center-container bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">Your Game History</h2>
                {games.length > 0 ? (
                    <ul className="space-y-4">
                        {games.map((game) => (
                            <li key={game.id} className="p-4 bg-gray-100 rounded-md shadow-md">
                                <p>Game ID: {game.id}</p>
                                <p>Total Score: {game.total_score}</p>
                                {/* Add more details as needed */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-600">No game history available.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;
