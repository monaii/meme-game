import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/login', { username, password }, { withCredentials: true });
            if (response.data) {
                navigate('/game');
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="w-100">
                    <div className="mb-3">
                        <label className="form-label">Username:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
