import React from 'react';

const Home = () => {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
                <h1>Welcome to the Meme Game</h1>
                <a href="/login" className="btn btn-primary mt-3">Login</a>
            </div>
        </div>
    );
};

export default Home;
