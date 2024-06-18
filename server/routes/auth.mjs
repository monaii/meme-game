import express from 'express';
import passport from 'passport';
import { comparePassword } from '../utilities.js'; // Adjust the import path as needed

const router = express.Router();

// Login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.status(400).json({ success: false, message: info.message }); }

        req.logIn(user, async (err) => {
            if (err) { return next(err); }
            const isMatch = await comparePassword(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Incorrect password.' });
            }
            return res.json({ success: true, user });
        });
    })(req, res, next);
});

// Logout route
router.post('/logout', (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.json({ success: true });
    });
});

// Check if user is authenticated
router.get('/authenticated', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

export default router;