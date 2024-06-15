import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col, Alert, Image, Spinner, Card, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Game.css';

function Game({ user }) {
    const [meme, setMeme] = useState(null);
    const [captions, setCaptions] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [feedback, setFeedback] = useState('');
    const [timer, setTimer] = useState(30);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMemeData();
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        } else if (timer === 0) {
            checkCaption(null);
        }
    }, [timer]);

    const fetchMemeData = async () => {
        try {
            setLoading(true);
            setError(null);
            const memeResponse = await axios.get('http://localhost:3001/api/memes/random');
            const captionsResponse = await axios.get('http://localhost:3001/api/captions/random', {
                params: { memeId: memeResponse.data.id }
            });

            setMeme(memeResponse.data);
            setCaptions(captionsResponse.data);
            setLoading(false);
            setSelectedCaption('');
            setFeedback('');
            setTimer(30);
        } catch (error) {
            setLoading(false);
            setError('Failed to load meme data. Please try again.');
        }
    };

    const handleCaptionClick = (caption) => {
        setSelectedCaption(caption);
        checkCaption(caption);
    };

    const checkCaption = (caption) => {
        const correctCaptions = captions.slice(0, 2);

        if (caption && correctCaptions.some(correctCaption => correctCaption.id === caption.id)) {
            setScore(score + 5);
            setFeedback('Correct! You earned 5 points.');
        } else {
            setFeedback(`Incorrect. The correct captions were: "${correctCaptions[0].text}" and "${correctCaptions[1].text}".`);
        }

        if (user && round < 3) {
            setTimeout(() => {
                setRound(round + 1);
                fetchMemeData();
            }, 3000);
        } else if (!user && round >= 1) {
            setFeedback(`Game over! Your total score is ${score}. Please log in to play more rounds.`);
        } else if (user) {
            setFeedback(`Game over! Your total score is ${score}.`);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="game-container mt-5">
            <Card className="text-center">
                <Card.Header>Round {round}</Card.Header>
                <Card.Body>
                    {meme && (
                        <>
                            <Row className="justify-content-center mb-3">
                                <Image src={meme.url} alt="Meme" className="meme-image" />
                            </Row>
                            <Row className="justify-content-center mb-3">
                                {captions.map((caption, index) => (
                                    <Col xs={12} md={6} lg={4} className="mb-3" key={index}>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleCaptionClick(caption)}
                                            disabled={!!selectedCaption}
                                            className={`w-100 ${selectedCaption ? (selectedCaption.id === caption.id && feedback.includes('Correct') ? 'correct' : 'incorrect') : ''}`}
                                        >
                                            {caption.text}
                                        </Button>
                                    </Col>
                                ))}
                            </Row>
                            <Row className="justify-content-center mb-3">
                                <Col xs={12} className="text-center">
                                    <ProgressBar now={(30 - timer) / 30 * 100} label={`${timer} s`} />
                                </Col>
                            </Row>
                        </>
                    )}
                    {feedback && <Alert variant="info" className="text-center">{feedback}</Alert>}
                    {!user && round >= 1 && (
                        <Button variant="primary" onClick={handleLoginRedirect}>
                            Login to Play More Rounds
                        </Button>
                    )}
                </Card.Body>
                <Card.Footer>
                    <Row className="justify-content-between">
                        <Col xs={6} className="text-left">
                            Score: {score}
                        </Col>
                        <Col xs={6} className="text-right">
                            Round: {round}
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default Game;
