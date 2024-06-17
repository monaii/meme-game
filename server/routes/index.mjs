import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import apiRoutes from './api.mjs'; // Correct path
import authRoutes from './auth.mjs'; // Correct path
import { initializeDatabase } from '../db/schema.mjs';
import './setup.mjs'; // Passport.js setup

const app = express();
app.use(express.static('client/public')); // Serve static files

app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const startServer = async () => {
    await initializeDatabase();

    app.use('/api', apiRoutes);
    app.use('/auth', authRoutes);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
