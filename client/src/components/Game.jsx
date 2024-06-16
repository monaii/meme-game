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
            const response = await axios.get('/api/memes');
            setMeme(response.data.meme);
            setCaptions(response.data.captions);
        };
        fetchMeme();
    }, []);

    const handleCaptionSelect = async (captionId) => {
        setSelectedCaption(captionId);
        const response = await axios.post('/api/game', {
            userId: 1, // Replace with actual user ID
            memeId: meme.id,
            selectedCaptionId: captionId
        });
        setScore(response.data.score);
        setCorrectCaptions(response.data.correctCaptions);
    };

    return (
        <div>
            {meme && (
                <div>
                    <img src={`/images/${meme.image_url}`} alt="Meme" />
                    <div>
                        {captions.map(caption => (
                            <button key={caption.id} onClick={() => handleCaptionSelect(caption.id)}>
                                {caption.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {score !== null && (
                <div>
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
    );
};

export default Game;
