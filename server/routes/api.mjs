import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const router = express.Router();
let db;

const initializeDatabase = async () => {
    db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        );

        CREATE TABLE IF NOT EXISTS memes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT
        );

        CREATE TABLE IF NOT EXISTS captions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT
        );

        CREATE TABLE IF NOT EXISTS meme_captions (
            meme_id INTEGER,
            caption_id INTEGER,
            correct BOOLEAN,
            FOREIGN KEY(meme_id) REFERENCES memes(id),
            FOREIGN KEY(caption_id) REFERENCES captions(id)
        );

        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_score INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS rounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id INTEGER,
            meme_id INTEGER,
            selected_caption_id INTEGER,
            score INTEGER,
            FOREIGN KEY(game_id) REFERENCES games(id),
            FOREIGN KEY(meme_id) REFERENCES memes(id),
            FOREIGN KEY(selected_caption_id) REFERENCES captions(id)
        );
    `);
};

initializeDatabase();

// Get random meme and captions
router.get('/random-meme', async (req, res) => {
    try {
        const meme = await db.get('SELECT * FROM memes ORDER BY RANDOM() LIMIT 1');
        const correctCaptions = await db.all('SELECT c.* FROM captions c JOIN meme_captions mc ON c.id = mc.caption_id WHERE mc.meme_id = ? AND mc.correct = 1', [meme.id]);
        const otherCaptions = await db.all('SELECT * FROM captions WHERE id NOT IN (SELECT caption_id FROM meme_captions WHERE meme_id = ?) ORDER BY RANDOM() LIMIT 5', [meme.id]);

        const captions = [...correctCaptions, ...otherCaptions]

        res.json({ meme, captions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
