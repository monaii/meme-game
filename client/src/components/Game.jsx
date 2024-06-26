import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Game.css';

function Game() {
    const [meme, setMeme] = useState(null);
    const [captions, setCaptions] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState(null);
    const [correctCaptions, setCorrectCaptions] = useState([]);
    const [round, setRound] = useState(1);
    const [timer, setTimer] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [rounds, setRounds] = useState([]);
    const [shownMemes, setShownMemes] = useState([]);
    const [score, setScore] = useState(0);
    const [resultMessage, setResultMessage] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [waitingForNextRound, setWaitingForNextRound] = useState(false);
    const [roundHandled, setRoundHandled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const isGuest = new URLSearchParams(location.search).get('guest') === 'true';

    useEffect(() => {
        if (round <= (isGuest ? 1 : 3) && !waitingForNextRound) {
            fetchMeme();
        } else if (round > (isGuest ? 1 : 3)) {
            setGameOver(true);
            if (!isGuest) {
                recordGame();
            }
        }
    }, [round, waitingForNextRound]);

    useEffect(() => {
        if (timer > 0 && !showResult) {
            const timeout = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(timeout);
        } else if (timer === 0 && !roundHandled) {
            handleTimeout();
        }
    }, [timer, showResult, roundHandled]);

    const fetchMeme = async () => {
        try {
            const res = await axios.post('http://localhost:3001/api/random-meme', { excludeMemes: shownMemes });
            const shuffledCaptions = shuffleArray(res.data.captions);
            setMeme(res.data.meme);
            setCaptions(shuffledCaptions);
            setCorrectCaptions(shuffledCaptions.filter(c => c.correct));
            setSelectedCaption(null);
            setShownMemes([...shownMemes, res.data.meme.id]);
            setTimer(30);
            setShowResult(false);
            setWaitingForNextRound(false);
            setRoundHandled(false);
        } catch (error) {
            console.error('Error fetching meme:', error);
        }
    };

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const handleCaptionClick = async (caption) => {
        if (roundHandled) return;
        setRoundHandled(true);
        setSelectedCaption(caption);

        try {
            const res = await axios.post('http://localhost:3001/api/submit-round', {
                user_id: isGuest ? null : user.id,
                guest_id: isGuest ? 'guest' : null,
                meme_id: meme.id,
                selected_caption_id: caption.id
            });
            const roundScore = res.data.score;
            setScore(score + roundScore);
            const correct = roundScore > 0;
            const roundData = { memeId: meme.id, memeImage: meme.image_url, selectedCaption: caption.text, correct };
            setRounds([...rounds, roundData]);

            if (correct) {
                setResultMessage('Correct answer, now you got 5 scores!');
                setCorrectCaptions(res.data.correctCaptions);
                setTimeout(() => {
                    nextRound();
                }, 2000); // 2 seconds delay
            } else {
                setResultMessage('Incorrect answer, better luck next time.');
                setCorrectCaptions(res.data.correctCaptions);
                setShowResult(true);
            }
            setWaitingForNextRound(true);
        } catch (error) {
            console.error('Error submitting round:', error);
        }
    };

    const handleTimeout = async () => {
        if (roundHandled) return;
        setRoundHandled(true);

        try {
            const res = await axios.post('http://localhost:3001/api/submit-round', {
                user_id: isGuest ? null : user.id,
                guest_id: isGuest ? 'guest' : null,
                meme_id: meme.id,
                selected_caption_id: null
            });

            setResultMessage(`Time up, check the correct captions for the next time!`);
            const roundData = { memeId: meme.id, memeImage: meme.image_url, selectedCaption: null, correct: false };
            setRounds([...rounds, roundData]);
            setShowResult(true);
            setCorrectCaptions(res.data.correctCaptions);
            setWaitingForNextRound(true);
        } catch (error) {
            console.error('Error handling timeout:', error);
        }
    };

    const recordGame = async () => {
        try {
            const uniqueRounds = rounds.reduce((acc, round) => {
                if (!acc.find(r => r.memeId === round.memeId)) {
                    acc.push(round);
                }
                return acc;
            }, []);

            await axios.post('http://localhost:3001/api/record-game', {
                userId: user.id,
                rounds: uniqueRounds,
                totalScore: score
            });
        } catch (error) {
            console.error('Error recording game:', error);
        }
    };

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

    const nextRound = () => {
        setRound(round + 1);
        setTimer(30);
        setShowResult(false);
        setWaitingForNextRound(false);
        setRoundHandled(false);
    };

    const correctAnswers = rounds.filter(round => round.correct);

    return (
        <div className="game-container">
            {gameOver ? (
                <div className="game-over">
                    <h2>Game Over</h2>
                    <p>Your total score: {score}</p>
                    <h3>{correctAnswers.length > 0 ? 'Recap correct answers' : 'No correct answer to recap'}</h3>
                    <ul>
                        {correctAnswers.map((round, index) => (
                            <li key={index}>
                                <img src={round.memeImage} alt={`Meme ${index + 1}`} />
                                Meme {index + 1}: Your Caption: {round.selectedCaption}
                            </li>
                        ))}
                    </ul>
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
                        {captions.map((caption) => {
                            const isSelected = selectedCaption && selectedCaption.id === caption.id;
                            const isCorrect = correctCaptions.includes(caption.text);
                            const isIncorrect = showResult && !isCorrect && isSelected;

                            let buttonClass = 'caption-button';
                            if (isSelected) {
                                if (isCorrect) {
                                    buttonClass += ' selected-correct';
                                } else if (isIncorrect) {
                                    buttonClass += ' selected-incorrect';
                                }
                            }
                            if (showResult && !isSelected) {
                                if (isCorrect) {
                                    buttonClass += ' correct';
                                }
                            }
                            return (
                                <button
                                    className={buttonClass}
                                    key={caption.id}
                                    onClick={() => handleCaptionClick(caption)}
                                    disabled={selectedCaption !== null || timer === 0}
                                >
                                    {caption.text}
                                </button>
                            );
                        })}
                    </div>
                    {(showResult || timer === 0) && (
                        <div className="round-result">
                            {resultMessage}
                            {waitingForNextRound && (
                                <button className="next-round-button" onClick={nextRound}>Next Round</button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Game;