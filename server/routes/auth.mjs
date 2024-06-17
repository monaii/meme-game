// server/routes/auth.mjs
import express from 'express';
import passport from 'passport';

const router = express.Router();

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ success: true, user: req.user });
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
