import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Image, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Game = () => {
    const [meme, setMeme] = useState(null);
    const [captions, setCaptions] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState(null);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [feedback, setFeedback] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                await axios.get('http://localhost:3001/api/profile', { withCredentials: true });
                setIsLoggedIn(true);
            } catch {
                setIsLoggedIn(false);
            }
        };

        fetchUserStatus();
        fetchMemeAndCaptions();
    }, []);

    useEffect(() => {
        if (gameOver) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleTimeout();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [round, gameOver]);

    const fetchMemeAndCaptions = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/memes', { withCredentials: true });
            setMeme(response.data.meme);
            setCaptions(response.data.captions);
        } catch (error) {
            console.error('Failed to fetch meme and captions', error);
        }
    };

    const handleCaptionSelect = async (captionId) => {
        setSelectedCaption(captionId);
        handleSubmit(captionId);
    };

    const handleSubmit = async (captionId) => {
        try {
            const response = await axios.post('http://localhost:3001/api/game', {
                memeId: meme.id,
                selectedCaptionId: captionId,
                round
            }, { withCredentials: true });
            const { correct, correctCaptions, totalScore } = response.data;
            if (correct) {
                setScore(score + 5);
                setFeedback('Correct!');
            } else {
                setFeedback(`Incorrect. Correct captions were: ${correctCaptions.map(id => captions.find(c => c.id === id).text).join(', ')}`);
            }

            if ((isLoggedIn && round < 3) || (!isLoggedIn && round < 1)) {
                setRound(round + 1);
                setTimeLeft(30);
                setTimeout(() => {
                    fetchMemeAndCaptions();
                    setSelectedCaption(null);
                    setFeedback('');
                }, 3000);
            } else {
                setGameOver(true);
                if (isLoggedIn) {
                    setScore(totalScore);
                }
            }
        } catch (error) {
            console.error('Failed to submit caption', error);
        }
    };

    const handleTimeout = () => {
        if (!selectedCaption) {
            setFeedback('Time is up! Please select a caption faster next time.');
            if ((isLoggedIn && round < 3) || (!isLoggedIn && round < 1)) {
                setRound(round + 1);
                setTimeLeft(30);
                setTimeout(() => {
                    fetchMemeAndCaptions();
                    setSelectedCaption(null);
                    setFeedback('');
                }, 3000);
            } else {
                setGameOver(true);
            }
        }
    };

    return (
        <Container className="center-container text-center">
            <div>
                {meme && !gameOver && (
                    <div>
                        <Image src={`/images/${meme.image_url}`} alt="Meme" fluid className="mb-3" />
                        <div className="d-grid gap-2 mb-3">
                            {captions.map(caption => (
                                <Button
                                    key={caption.id}
                                    variant={selectedCaption === caption.id ? 'success' : 'outline-secondary'}
                                    onClick={() => handleCaptionSelect(caption.id)}
                                    className="mb-2"
                                >
                                    {caption.text}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
                {feedback && <Alert variant={feedback.includes('Correct') ? 'success' : 'danger'} className="mt-3">{feedback}</Alert>}
                <p className="mt-3">Score: {score}</p>
                <p className="mt-3">Round: {round}/{isLoggedIn ? 3 : 1}</p>
                <p className="mt-3">Time Left: {timeLeft}s</p>
                {gameOver && (
                    <div className="mt-3">
                        <Alert variant="info">
                            Great! Your final score is {score}.<br />
                            {isLoggedIn
                                ? <Button variant="link" onClick={() => navigate('/profile')}>View Profile</Button>
                                : <>To play more, please login.</>
                            }
                        </Alert>
                        {!isLoggedIn && <Button variant="primary" onClick={() => navigate('/login')}>Login</Button>}
                    </div>
                )}
            </div>
        </Container>
    );
};

export default Game;
