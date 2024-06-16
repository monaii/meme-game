import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Game = () => {
    const [meme, setMeme] = useState(null);
    const [captions, setCaptions] = useState([]);

    useEffect(() => {
        const fetchMeme = async () => {
            try {
                const memeResponse = await axios.get('/api/memes');
                setMeme(memeResponse.data.meme);

                const captionsResponse = await axios.get('/api/captions/random', { params: { memeId: memeResponse.data.meme.id } });
                setCaptions(captionsResponse.data);
            } catch (error) {
                console.error('Failed to fetch meme and captions', error);
            }
        };

        fetchMeme();
    }, []);

    return (
        <div>
            {meme && (
                <div>
                    <img src={`/images/${meme.image_url}`} alt="Meme" />
                    <div>
                        {captions.map(caption => (
                            <button key={caption.id}>{caption.text}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;
