import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Game = () => {
    const [meme, setMeme] = useState(null);
    const [captions, setCaptions] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState(null);
    const [score, setScore] = useState(null);
    const [correctCaptions, setCorrectCaptions] = useState([]);

    useEffect(() => {
        const fetchMeme = async () => {
            try {
                const memeResponse = await axios.get('http://localhost:3001/api/memes', { withCredentials: true });
                setMeme(memeResponse.data.meme);
                const captionsResponse = await axios.get('http://localhost:3001/api/captions/random', { params: { memeId: memeResponse.data.meme.id }, withCredentials: true });
                setCaptions(captionsResponse.data);
            } catch (error) {
                console.error('Failed to fetch meme and captions', error);
            }
        };
        fetchMeme();
    }, []);

    const handleCaptionSelect = async (captionId) => {
        setSelectedCaption(captionId);
        try {
            const response = await axios.post('http://localhost:3001/api/game', {
                userId: 1, // Replace with actual user ID
                memeId: meme.id,
                selectedCaptionId: captionId
            }, { withCredentials: true });
            setScore(response.data.score);
            setCorrectCaptions(response.data.correctCaptions);
        } catch (error) {
            console.error('Failed to submit caption', error);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
                {meme && (
                    <div>
                        <img src={`/images/${meme.image_url}`} alt="Meme" className="img-fluid mb-3" />
                        <div className="d-grid gap-2">
                            {captions.map(caption => (
                                <button
                                    key={caption.id}
                                    className={`btn btn-outline-secondary ${selectedCaption === caption.id ? 'active' : ''}`}
                                    onClick={() => handleCaptionSelect(caption.id)}
                                >
                                    {caption.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {score !== null && (
                    <div className="mt-3">
                        <p>Your score: {score}</p>
                        {correctCaptions.length > 0 && (
                            <div>
                                <p>The correct captions were:</p>
                                {correctCaptions.map(id => (
                                    <p key={id}>{captions.find(caption => caption.id === id)?.text}</p>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;
