import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Game.css';

function Game() {
    const [meme, setMeme] = useState(null);
    const [captions, setCaptions] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState(null);
    const [round, setRound] = useState(1);
    const [timer, setTimer] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [rounds, setRounds] = useState([]);
    const [shownMemes, setShownMemes] = useState([]);
    const [score, setScore] = useState(0); // Initialize score
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
            const res = await axios.post('http://localhost:3001/api/random-meme', { excludeMemes: shownMemes });
            const shuffledCaptions = shuffleArray(res.data.captions);
            setMeme(res.data.meme);
            setCaptions(shuffledCaptions);
            setSelectedCaption(null);
            setShownMemes([...shownMemes, res.data.meme.id]);
            setTimer(30);
        } catch (error) {
            console.error('Error fetching meme:', error);
        }
    };

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const handleCaptionClick = async (caption) => {
        setSelectedCaption(caption);

        try {
            const res = await axios.post('http://localhost:3001/api/submit-round', {
                user_id: isGuest ? null : 1, // Assuming user ID 1 for logged in user, adjust as needed
                guest_id: isGuest ? 'guest' : null,
                meme_id: meme.id,
                selected_caption_id: caption.id
            });
            const roundScore = res.data.score;
            setScore(score + roundScore);
            const correct = roundScore > 0;
            const roundData = { memeId: meme.id, selectedCaption: caption.id, correct };
            setRounds([...rounds, roundData]);
            setTimeout(() => setRound(round + 1), 2000);
        } catch (error) {
            console.error('Error submitting round:', error);
        }
    };

    const handleTimeout = () => {
        const roundData = { memeId: meme.id, selectedCaption: selectedCaption ? selectedCaption.id : null, correct: false };
        setRounds([...rounds, roundData]);
        setTimeout(() => setRound(round + 1), 2000);
    };

    const recordGame = async () => {
        try {
            await axios.post('http://localhost:3001/api/record-game', {
                userId: 1, // Assuming a logged-in user ID is set to 1, adjust as needed
                rounds,
                totalScore: score
            });
        } catch (error) {
            console.error('Error recording game:', error);
        }
    };

    const totalScore = rounds.reduce((acc, round) => acc + (round.correct ? 5 : 0), 0);

    const startOver = () => {
        setMeme(null);
        setCaptions([]);
        setSelectedCaption(null);
        setRound(1);
        setTimer(30);
        setGameOver(false);
        setRounds([]);
        setShownMemes([]);
        setScore(0);
        fetchMeme();
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
                            <p>Have fun? Do you want to play more?</p>
                            <button className="start-over-button" onClick={startOver}>Start Over</button>
                            <button className="logout-button" onClick={handleLogout}>Logout</button>
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
                                className={`caption-button ${selectedCaption && selectedCaption.id === caption.id ? 'selected' : ''}`}
                                key={caption.id}
                                onClick={() => handleCaptionClick(caption)}
                                disabled={selectedCaption && selectedCaption.id === caption.id}
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