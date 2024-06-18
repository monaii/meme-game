// client/src/components/Home.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleGuestPlay = () => {
        navigate('/game?guest=true');
    };

    return (
        <div className="center-container bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">Welcome to What do you meme?!</h2>
                <p className="text-center text-gray-600">Log in to start playing the meme guessing game!</p>
                <Link to="/login">
                    <button className="w-full py-3 mt-4 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        Log In
                    </button>
                </Link>
                <button onClick={handleGuestPlay} className="w-full py-3 mt-4 text-lg font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400">
                    Play as Guest
                </button>
            </div>
        </div>
    );
};

export default Home;