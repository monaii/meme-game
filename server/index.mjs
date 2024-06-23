import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import apiRoutes from './routes/api.mjs'; // Ensure correct path
import authRoutes from './routes/auth.mjs'; // Ensure correct path
import { initializeDatabase } from './db/schema.mjs';
import './routes/setup.mjs'; // Passport.js setup

const app = express();
//app.use(express.static('client/public')); // Serve static files

app.use(cors({
    origin: 'http://localhost:5173', // or the address of your frontend
    credentials: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60000 * 60 * 24
    }
}));
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