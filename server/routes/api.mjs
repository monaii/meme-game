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
router.post('/random-meme', async (req, res) => {
    try {
        const { excludeMemes } = req.body;
        const meme = await db.get(`SELECT * FROM memes WHERE id NOT IN (${excludeMemes.join(',')}) ORDER BY RANDOM() LIMIT 1`);
        const correctCaptions = await db.all('SELECT c.* FROM captions c JOIN meme_captions mc ON c.id = mc.caption_id WHERE mc.meme_id = ? AND mc.correct = 1', [meme.id]);
        const otherCaptions = await db.all('SELECT * FROM captions WHERE id NOT IN (SELECT caption_id FROM meme_captions WHERE meme_id = ?) ORDER BY RANDOM() LIMIT 5', [meme.id]);

        // Merge correct and incorrect captions and shuffle them
        const captions = [...correctCaptions, ...otherCaptions].sort(() => Math.random() - 0.5);

        res.json({ meme, captions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit round results
router.post('/submit-round', async (req, res) => {
    try {
        const { user_id, guest_id, meme_id, selected_caption_id } = req.body;
        const correct = await db.get('SELECT correct FROM meme_captions WHERE meme_id = ? AND caption_id = ?', [meme_id, selected_caption_id]);
        const score = correct && correct.correct ? 5 : 0;
        res.json({ score });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Record game results
router.post('/record-game', async (req, res) => {
    try {
        const { userId, rounds, totalScore } = req.body;
        await db.run('INSERT INTO games (user_id, total_score) VALUES (?, ?)', [userId, totalScore]);
        const gameId = await db.get('SELECT last_insert_rowid() as id');
        for (const round of rounds) {
            await db.run('INSERT INTO rounds (game_id, meme_id, selected_caption_id, score) VALUES (?, ?, ?, ?)', [gameId.id, round.memeId, round.selectedCaption, round.correct ? 5 : 0]);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get game history for a user
router.get('/game-history/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const games = await db.all(`
            SELECT g.id as game_id, g.total_score, r.id as round_id, r.score as round_score, m.image_url, c.text as caption_text
            FROM games g
            LEFT JOIN rounds r ON g.id = r.game_id
            LEFT JOIN memes m ON r.meme_id = m.id
            LEFT JOIN captions c ON r.selected_caption_id = c.id
            WHERE g.user_id = ?
            ORDER BY g.id, r.id
        `, [userId]);

        const formattedGames = games.reduce((acc, game) => {
            if (!acc[game.game_id]) {
                acc[game.game_id] = {
                    id: game.game_id,
                    total_score: game.total_score,
                    rounds: []
                };
            }
            acc[game.game_id].rounds.push({
                id: game.round_id,
                meme: { image_url: game.image_url },
                caption: { text: game.caption_text },
                score: game.round_score
            });
            return acc;
        }, {});

        res.json({ games: Object.values(formattedGames) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete game history for a user
router.delete('/game-history/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        await db.run('DELETE FROM rounds WHERE game_id IN (SELECT id FROM games WHERE user_id = ?)', [userId]);
        await db.run('DELETE FROM games WHERE user_id = ?', [userId]);
        await db.run('UPDATE sqlite_sequence SET seq = 0 WHERE name = "games"');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;