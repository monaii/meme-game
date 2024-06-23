// client/src/components/Login.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/auth/login', { username, password }, { withCredentials: true });
            if (response.data.success) {
                setUser(response.data.user); // Set the user context
                navigate('/options'); // Redirect to options page
            }
        } catch (error) {
            setError('Login failed. Please check your username and password.');
        }
    };

    const handleGuestPlay = () => {
        navigate('/game?guest=true');
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Welcome</h2>
                <p>Please login to your account or play as a guest</p>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="button">
                        Login
                    </button>
                </form>
                <button onClick={handleGuestPlay} className="button mt-3">
                    Play as Guest
                </button>
            </div>
        </div>
    );
};

export default Login;