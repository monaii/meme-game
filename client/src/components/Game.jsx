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
    const navigate = useNavigate();

    const fetchMemeAndCaptions = async () => {
        try {
            const memeResponse = await axios.get('http://localhost:3001/api/memes', { withCredentials: true });
            setMeme(memeResponse.data.meme);
            setCaptions(memeResponse.data.captions);
        } catch (error) {
            console.error('Failed to fetch meme and captions', error);
        }
    };

    useEffect(() => {
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

    const handleCaptionSelect = async (captionId) => {
        setSelectedCaption(captionId);
        handleSubmit(captionId);
    };

    const handleSubmit = async (captionId) => {
        try {
            const response = await axios.post('http://localhost:3001/api/game', {
                memeId: meme.id,
                selectedCaptionId: captionId
            }, { withCredentials: true });
            const { correct, correctCaptions } = response.data;
            if (correct) {
                setScore(score + 5);
                setFeedback('Correct!');
            } else {
                setFeedback(`Incorrect. Correct captions were: ${correctCaptions.map(id => captions.find(c => c.id === id).text).join(', ')}`);
            }
            if (round < 1) {
                setRound(round + 1);
                setTimeLeft(30); // Reset the timer for the next round
                setTimeout(() => {
                    fetchMemeAndCaptions();
                    setSelectedCaption(null);
                    setFeedback('');
                }, 3000);
            } else {
                // Game over logic for anonymous user after 1 round
                setGameOver(true);
            }
        } catch (error) {
            console.error('Failed to submit caption', error);
        }
    };

    const handleTimeout = () => {
        if (!selectedCaption) {
            setFeedback('Time is up! Please select a caption faster next time.');
            setRound(round + 1);
            setTimeLeft(30); // Reset the timer for the next round
            setTimeout(() => {
                fetchMemeAndCaptions();
                setSelectedCaption(null);
                setFeedback('');
            }, 3000);
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
                <p className="mt-3">Round: {round}/1</p>
                <p className="mt-3">Time Left: {timeLeft}s</p>
                {gameOver && (
                    <div className="mt-3">
                        <Alert variant="info">
                            Game Over! Your final score is {score}.<br />
                            To play more, please <Button variant="link" onClick={() => navigate('/login')}>login</Button>.
                        </Alert>
                        <Button variant="primary" onClick={() => navigate('/login')}>Login</Button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default Game;
