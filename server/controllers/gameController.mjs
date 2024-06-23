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
        if (!meme) {
            res.status(404).json({ error: 'No meme found' });
            return;
        }
        const correctCaptions = await db.all('SELECT c.* FROM captions c JOIN meme_captions mc ON c.id = mc.caption_id WHERE mc.meme_id = ? AND mc.correct = 1', [meme.id]);
        const otherCaptions = await db.all('SELECT * FROM captions WHERE id NOT IN (SELECT caption_id FROM meme_captions WHERE meme_id = ?) ORDER BY RANDOM() LIMIT 5', [meme.id]);
        const captions = [...correctCaptions, ...otherCaptions].sort(() => Math.random() - 0.5);
        res.json({ meme, captions });
    } catch (error) {
        console.error('Error fetching meme:', error);
        res.status(500).json({ error: error.message });
    }
};

export const submitRound = async (req, res) => {
    try {
        const { meme_id, selected_caption_id } = req.body;
        const correct = await db.get('SELECT correct FROM meme_captions WHERE meme_id = ? AND caption_id = ?', [meme_id, selected_caption_id]);
        const score = correct ? calculateScore(correct.correct) : 0;
        const correctCaptions = await db.all('SELECT c.text FROM captions c JOIN meme_captions mc ON c.id = mc.caption_id WHERE mc.meme_id = ? AND mc.correct = 1', [meme_id]);
        res.json({ score, correctCaptions: correctCaptions.map(c => c.text) });
    } catch (error) {
        console.error('Error submitting round:', error);
        res.status(500).json({ error: error.message });
    }
};

export const recordGame = async (req, res) => {
    try {
        const { userId, rounds, totalScore } = req.body;

        // Only record games with the required number of rounds completed
        const requiredRounds = 3;
        if (rounds.length < requiredRounds) {
            res.status(400).json({ error: 'Game not completed' });
            return;
        }

        await db.run('INSERT INTO games (user_id, total_score) VALUES (?, ?)', [userId, totalScore]);
        const gameId = await db.get('SELECT last_insert_rowid() as id');
        for (const round of rounds) {
            await db.run('INSERT INTO rounds (game_id, meme_id, selected_caption_id, score) VALUES (?, ?, ?, ?)', [gameId.id, round.memeId, round.selectedCaption, calculateScore(round.correct)]);
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error recording game:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getGameHistory = async (req, res) => {
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
};

export const deleteGameHistory = async (req, res) => {
    const { userId } = req.params;
    try {
        await db.run('DELETE FROM rounds WHERE game_id IN (SELECT id FROM games WHERE user_id = ?)', [userId]);
        await db.run('DELETE FROM games WHERE user_id = ?', [userId]);
        await db.run('UPDATE sqlite_sequence SET seq = 0 WHERE name = "games"');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getTotalScores = async (req, res) => {
    try {
        const userId = req.params.userId;
        const totalScores = await db.all(`
            SELECT g.id as game_id, g.total_score
            FROM games g
            WHERE g.user_id = ?
        `, [userId]);

        res.json({ totalScores });
    } catch (error) {
        console.error('Error fetching total scores:', error);
        res.status(500).json({ error: error.message });
    }
};
