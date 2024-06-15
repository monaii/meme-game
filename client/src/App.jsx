import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import Login from './components/Login';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/auth/check', { withCredentials: true });
                setUser(response.data.user);
            } catch (err) {
                setUser(null);
            }
        };
        checkAuth();
    }, []);

    const PrivateRoute = ({ children }) => {
        return user ? children : <Navigate to="/login" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game" element={<PrivateRoute><Game /></PrivateRoute>} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
