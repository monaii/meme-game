import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

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
      meme_id INTEGER,
      text TEXT,
      FOREIGN KEY(meme_id) REFERENCES memes(id)
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

    const user = await db.get('SELECT * FROM users WHERE username = ?', 'testuser');
    if (!user) {
        const hashedPassword = await bcrypt.hash('password', 10);
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', 'testuser', hashedPassword);
    }

    const memeCount = await db.get('SELECT COUNT(*) as count FROM memes');
    if (memeCount.count === 0) {
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme1.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme2.jpg');
    }

    const captionCount = await db.get('SELECT COUNT(*) as count FROM captions');
    if (captionCount.count === 0) {
        const meme1 = await db.get('SELECT id FROM memes WHERE image_url = ?', 'meme1.jpg');
        const meme2 = await db.get('SELECT id FROM memes WHERE image_url = ?', 'meme2.jpg');
        await db.run('INSERT INTO captions (meme_id, text) VALUES (?, ?)', meme1.id, 'Caption 1 for Meme 1');
        await db.run('INSERT INTO captions (meme_id, text) VALUES (?, ?)', meme1.id, 'Caption 2 for Meme 1');
        await db.run('INSERT INTO captions (meme_id, text) VALUES (?, ?)', meme2.id, 'Caption 1 for Meme 2');
        await db.run('INSERT INTO captions (meme_id, text) VALUES (?, ?)', meme2.id, 'Caption 2 for Meme 2');
    }

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
    return db.all('SELECT * FROM captions WHERE meme_id = ?', [memeId]);
};

export const getOtherCaptions = async (memeId) => {
    const db = await dbPromise;
    return db.all('SELECT * FROM captions WHERE meme_id != ? ORDER BY RANDOM() LIMIT 5', [memeId]);
};

export const addRound = async (memeId, selectedCaptionId, gameId, score) => {
    const db = await dbPromise;
    return db.run('INSERT INTO rounds (meme_id, selected_caption_id, game_id, score) VALUES (?, ?, ?, ?)', [memeId, selectedCaptionId, gameId, score]);
};

export const addUser = async (username, password) => {
    const db = await dbPromise;
    return db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
};
