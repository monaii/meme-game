// client/src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="center-container bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full">
                <h1 className="text-3xl font-bold mb-5">Welcome to Meme Game</h1>
                <p className="text-lg mb-5">Log in to start playing the meme guessing game!</p>
                <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75">
                    Log In
                </Link>
            </div>
        </div>
    );
}

export default Home;
