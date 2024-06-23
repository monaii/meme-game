import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const Home = () => {
    const navigate = useNavigate();

    const handleGuestPlay = () => {
        navigate('/game?guest=true');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-lilac-100 to-lilac-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-800">Welcome to What do you meme?!</h2>
                <p className="text-center text-gray-600">Log in to start playing the meme guessing game!</p>
                <Link to="/login">
                    <button className="w-full py-3 mt-4 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400">
                        Log In
                    </button>
                </Link>
                <button onClick={handleGuestPlay} className="w-full py-3 mt-4 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400">
                    Play as Guest
                </button>
            </div>
        </div>
    );
};

export default Home;