import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

let db;

const initializeDb = async () => {
    db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });
};

initializeDb();

const calculateScore = (isCorrect) => {
    return isCorrect ? 5 : 0;
};

export const getRandomMeme = async (req, res) => {
    try {
        const excludeMemes = req.body.excludeMemes || [];
        const meme = await db.get(`SELECT * FROM memes WHERE id NOT IN (${excludeMemes.join(',')}) ORDER BY RANDOM() LIMIT 1`);
        const correctCaptions = await db.all('SELECT c.* FROM captions c JOIN meme_captions mc ON c.id = mc.caption_id WHERE mc.meme_id = ? AND mc.correct = 1', [meme.id]);
        const otherCaptions = await db.all('SELECT * FROM captions WHERE id NOT IN (SELECT caption_id FROM meme_captions WHERE meme_id = ?) ORDER BY RANDOM() LIMIT 5', [meme.id]);
        const captions = [...correctCaptions, ...otherCaptions].sort(() => Math.random() - 0.5);
        res.json({ meme, captions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const submitRound = async (req, res) => {
    try {
        const { user_id, guest_id, meme_id, selected_caption_id } = req.body;
        const correct = await db.get('SELECT correct FROM meme_captions WHERE meme_id = ? AND caption_id = ?', [meme_id, selected_caption_id]);
        const score = calculateScore(correct.correct);
        res.json({ score });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const recordGame = async (req, res) => {
    try {
        const { userId, rounds, totalScore } = req.body;
        await db.run('INSERT INTO games (user_id, total_score) VALUES (?, ?)', [userId, totalScore]);
        const gameId = await db.get('SELECT last_insert_rowid() as id');
        for (const round of rounds) {
            await db.run('INSERT INTO rounds (game_id, meme_id, selected_caption_id, score) VALUES (?, ?, ?, ?)', [gameId.id, round.memeId, round.selectedCaptions.join(','), calculateScore(round.correct)]);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};