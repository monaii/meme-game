import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Game.css';

function Game() {
    const [meme, setMeme] = useState(null);
    const [captions, setCaptions] = useState([]);
    const [selectedCaptions, setSelectedCaptions] = useState([]);
    const [round, setRound] = useState(1);
    const [timer, setTimer] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [rounds, setRounds] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const isGuest = new URLSearchParams(location.search).get('guest') === 'true';

    useEffect(() => {
        if (round <= (isGuest ? 1 : 3)) {
            fetchMeme();
        } else {
            setGameOver(true);
            if (!isGuest) {
                recordGame();
            }
        }
    }, [round]);

    useEffect(() => {
        if (timer > 0) {
            const timeout = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(timeout);
        } else {
            handleTimeout();
        }
    }, [timer]);

    const fetchMeme = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/random-meme');
            setMeme(res.data.meme);
            setCaptions(res.data.captions);
            setSelectedCaptions([]);
            setTimer(30);
        } catch (error) {
            console.error('Error fetching meme:', error);
        }
    };

    const handleCaptionClick = (caption) => {
        const newSelectedCaptions = [...selectedCaptions, caption];
        setSelectedCaptions(newSelectedCaptions);

        if (newSelectedCaptions.length === 2) {
            const correct = newSelectedCaptions.some(c => c.correct);
            const roundData = { memeId: meme.id, selectedCaptions: newSelectedCaptions.map(c => c.id), correct };
            setRounds([...rounds, roundData]);
            setTimeout(() => setRound(round + 1), 2000);
        }
    };

    const handleTimeout = () => {
        const roundData = { memeId: meme.id, selectedCaptions: selectedCaptions.map(c => c.id), correct: false };
        setRounds([...rounds, roundData]);
        setTimeout(() => setRound(round + 1), 2000);
    };

    const recordGame = async () => {
        try {
            const totalScore = rounds.reduce((acc, round) => acc + (round.correct ? 5 : 0), 0);
            await axios.post('http://localhost:3001/api/record-game', {
                userId: 1, // Assuming a logged-in user ID is set to 1, adjust as needed
                rounds,
                totalScore
            });
        } catch (error) {
            console.error('Error recording game:', error);
        }
    };

    const totalScore = rounds.reduce((acc, round) => acc + (round.correct ? 5 : 0), 0);

    return (
        <div className="game-container">
            {gameOver ? (
                <div className="game-over">
                    <h2>Game Over</h2>
                    <p>Your total score: {totalScore}</p>
                    {isGuest ? (
                        <div>
                            <p>Login to play more rounds</p>
                            <button className="login-button" onClick={() => navigate('/login')}>Login</button>
                        </div>
                    ) : (
                        <div>
                            <p>Check the history of your games</p>
                            <button className="history-button" onClick={() => navigate('/history')}>Game History</button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="game-content">
                    <h2>Round {round}</h2>
                    <div className="timer-bar">
                        <div className="timer-bar-inner" style={{ width: `${(timer / 30) * 100}%` }}></div>
                    </div>
                    <p>Time remaining: {timer}s</p>
                    {meme && (
                        <div className="meme">
                            <img src={meme.image_url} alt="Meme" />
                        </div>
                    )}
                    <div className="captions">
                        {captions.map((caption) => (
                            <button
                                className={`caption-button ${selectedCaptions.includes(caption) ? 'selected' : ''}`}
                                key={caption.id}
                                onClick={() => handleCaptionClick(caption)}
                                disabled={selectedCaptions.includes(caption)}
                            >
                                {caption.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game;