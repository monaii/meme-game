import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/login', { username, password }, { withCredentials: true });
            if (response.data) {
                navigate('/game');
            }
        } catch (error) {
            setError('Login failed. Please check your username and password.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900">Welcome</h2>
                    <p className="text-center text-gray-600">Please login to your account</p>
                </div>
                {error && <div className="p-3 text-sm text-red-600 bg-red-100 rounded">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
