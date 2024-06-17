import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Game.css';

function Game() {
    const [meme, setMeme] = useState(null);
    const [captions, setCaptions] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState(null);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [userId, setUserId] = useState(null);
    const [rounds, setRounds] = useState([]);

    useEffect(() => {
        if (round <= 3) {
            fetchMeme();
        } else {
            setGameOver(true);
            recordGame();
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
            setSelectedCaption(null);
            setTimer(30);
            setMessage('');
        } catch (error) {
            console.error('Error fetching meme:', error);
        }
    };

    const handleCaptionClick = (caption) => {
        setSelectedCaption(caption);
        let roundScore = 0;
        if (caption.correct) {
            roundScore = 5;
            setScore(score + 5);
            setMessage('Correct! You earned 5 points.');
        } else {
            setMessage('Incorrect. Better luck next time.');
        }
        setRounds([...rounds, { memeId: meme.id, selectedCaptionId: caption.id, score: roundScore }]);
        setTimeout(() => setRound(round + 1), 2000);
    };

    const handleTimeout = () => {
        setMessage('Time is up! No points awarded.');
        setRounds([...rounds, { memeId: meme.id, selectedCaptionId: null, score: 0 }]);
        setTimeout(() => setRound(round + 1), 2000);
    };

    const recordGame = async () => {
        try {
            await axios.post('http://localhost:3001/api/record-game', {
                userId,
                rounds
            });
        } catch (error) {
            console.error('Error recording game:', error);
        }
    };

    return (
        <div className="game-container">
            {gameOver ? (
                <div className="game-over">
                    <h2>Game Over</h2>
                    <p>Your total score: {score}</p>
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
                            <button key={caption.id} onClick={() => handleCaptionClick(caption)}>
                                {caption.text}
                            </button>
                        ))}
                    </div>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}

export default Game;
