import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleGuestPlay = () => {
        navigate('/game?guest=true');
    };

    return (
        <div className="home-container">
            <h1>Welcome to Meme Game</h1>
            <p>Log in to start playing the meme guessing game!</p>
            <button onClick={() => navigate('/login')}>Log In</button>
            <button onClick={handleGuestPlay}>Play as Guest</button>
        </div>
    );
}

export default Home;
