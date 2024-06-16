import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

let dbPromise;

export const initializeDatabase = async () => {
    dbPromise = open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    const db = await dbPromise;

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

    const users = [
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' }
    ];

    for (const user of users) {
        const existingUser = await db.get('SELECT * FROM users WHERE username = ?', user.username);
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await db.run('INSERT INTO users (username, password) VALUES (?, ?)', user.username, hashedPassword);
        }
    }

    const memeCount = await db.get('SELECT COUNT(*) as count FROM memes');
    if (memeCount.count === 0) {
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme1.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme2.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme3.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme4.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme5.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme6.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme7.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme8.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme9.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme10.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme11.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme12.jpg');
    }

    const captionCount = await db.get('SELECT COUNT(*) as count FROM captions');
    if (captionCount.count === 0) {
        await db.run('INSERT INTO captions (text) VALUES (?)', 'Caption 1 for Meme 1');
        await db.run('INSERT INTO captions (text) VALUES (?)', 'Caption 2 for Meme 1');
        await db.run('INSERT INTO captions (text) VALUES (?)', 'Caption 1 for Meme 2');
        await db.run('INSERT INTO captions (text) VALUES (?)', 'Caption 2 for Meme 2');
        await db.run('INSERT INTO captions (text) VALUES (?)', 'Random Caption 1');
        await db.run('INSERT INTO captions (text) VALUES (?)', 'Random Caption 2');
        await db.run('INSERT INTO captions (text) VALUES (?)', 'Random Caption 3');
    }

    // Ensure relationships in meme_captions table
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (1, 1, 1)');
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (1, 2, 1)');
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (2, 3, 1)');
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (2, 4, 1)');
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (3, 5, 0)');
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (3, 6, 0)');
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (3, 7, 0)');

    return db;
};

// DAO Functions
export const getUserByUsername = async (username) => {
    const db = await dbPromise;
    return db.get('SELECT * FROM users WHERE username = ?', [username]);
};

export const getUserById = async (id) => {
    const db = await dbPromise;
    return db.get('SELECT * FROM users WHERE id = ?', [id]);
};

export const getRandomMeme = async () => {
    const db = await dbPromise;
    return db.get('SELECT * FROM memes ORDER BY RANDOM() LIMIT 1');
};

export const getCorrectCaptions = async (memeId) => {
    const db = await dbPromise;
    return db.all('SELECT c.* FROM captions c JOIN meme_captions mc ON c.id = mc.caption_id WHERE mc.meme_id = ? AND mc.correct = 1', [memeId]);
};

export const getOtherCaptions = async (memeId) => {
    const db = await dbPromise;
    return db.all('SELECT * FROM captions WHERE id NOT IN (SELECT caption_id FROM meme_captions WHERE meme_id = ?) ORDER BY RANDOM() LIMIT 5', [memeId]);
};

export const addRound = async (memeId, selectedCaptionId, gameId, score) => {
    const db = await dbPromise;
    return db.run('INSERT INTO rounds (meme_id, selected_caption_id, game_id, score) VALUES (?, ?, ?, ?)', [memeId, selectedCaptionId, gameId, score]);
};

export const addUser = async (username, password) => {
    const db = await dbPromise;
    return db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
};

export const getOrCreateGameId = async (userId) => {
    const db = await dbPromise;
    let game = await db.get('SELECT * FROM games WHERE user_id = ? AND total_score IS NULL', [userId]);
    if (!game) {
        const result = await db.run('INSERT INTO games (user_id, total_score) VALUES (?, NULL)', [userId]);
        game = { id: result.lastID };
    }
    return game.id;
};

export const updateGameScore = async (gameId, totalScore) => {
    const db = await dbPromise;
    return db.run('UPDATE games SET total_score = ? WHERE id = ?', [totalScore, gameId]);
};

export const getRoundsByUserId = async (userId) => {
    const db = await dbPromise;
    return db.all(`
        SELECT r.meme_id, r.selected_caption_id, r.score 
        FROM rounds r
        JOIN games g ON r.game_id = g.id
        WHERE g.user_id = ?
    `, [userId]);
};

export const getTotalScoreByGameId = async (gameId) => {
    const db = await dbPromise;
    const result = await db.get('SELECT total_score FROM games WHERE id = ?', [gameId]);
    return result.total_score;
};
