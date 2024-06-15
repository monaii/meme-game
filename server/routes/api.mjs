import { Router } from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const router = Router();
const dbPromise = open({
    filename: './server/database.sqlite',
    driver: sqlite3.Database
});

// Fetch a random meme
router.get('/memes/random', async (req, res) => {
    try {
        const db = await dbPromise;
        const meme = await db.get('SELECT * FROM memes ORDER BY RANDOM() LIMIT 1');
        if (!meme) {
            return res.status(404).json({ error: 'No meme found' });
        }
        res.json(meme);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch meme' });
    }
});

// Fetch random captions for a given meme
router.get('/captions/random', async (req, res) => {
    try {
        const memeId = req.query.memeId;
        const db = await dbPromise;
        const captions = await db.all('SELECT * FROM captions WHERE meme_id = ? ORDER BY RANDOM() LIMIT 7', [memeId]);
        if (captions.length === 0) {
            return res.status(404).json({ error: 'No captions found' });
        }
        res.json(captions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch captions' });
    }
});

// Fetch user profile and game history
router.get('/profile', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
        const gameHistory = await db.all('SELECT * FROM game_history WHERE user_id = ?', [req.user.id]);
        res.json({ user, gameHistory });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

export default router;
