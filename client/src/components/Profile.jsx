import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, ListGroup, Alert } from 'react-bootstrap';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [gameHistory, setGameHistory] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/profile', { withCredentials: true });
                setProfile(response.data.user);
                setGameHistory(response.data.gameHistory);
            } catch (err) {
                setError('Failed to load profile');
            }
        };
        fetchProfile();
    }, []);

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2>Profile</h2>
            {profile && (
                <div>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <h3>Game History</h3>
                    <ListGroup>
                        {gameHistory.map((game, index) => (
                            <ListGroup.Item key={index}>
                                Meme: {game.meme_id}, Score: {game.score}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}
        </Container>
    );
}

export default Profile;
