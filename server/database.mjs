import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';

export async function initializeDatabase() {
    const db = await open({
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

    // Check if the user already exists before inserting
    const user = await db.get('SELECT * FROM users WHERE username = ?', 'testuser');
    if (!user) {
        const hashedPassword = await bcrypt.hash('password', 10);
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', 'testuser', hashedPassword);
    }

    // Preload some memes and captions (replace with actual URLs and texts)
    const memeCount = await db.get('SELECT COUNT(*) as count FROM memes');
    if (memeCount.count === 0) {
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme1.jpg');
        await db.run('INSERT INTO memes (image_url) VALUES (?)', 'meme2.jpg');
        // Add more memes as needed
    }

    const captionCount = await db.get('SELECT COUNT(*) as count FROM captions');
    if (captionCount.count === 0) {
        const meme1 = await db.get('SELECT id FROM memes WHERE image_url = ?', 'meme1.jpg');
        const meme2 = await db.get('SELECT id FROM memes WHERE image_url = ?', 'meme2.jpg');
        await db.run('INSERT INTO captions (meme_id, text) VALUES (?, ?)', meme1.id, 'Caption 1 for Meme 1');
        await db.run('INSERT INTO captions (meme_id, text) VALUES (?, ?)', meme1.id, 'Caption 2 for Meme 1');
        await db.run('INSERT INTO captions (meme_id, text) VALUES (?, ?)', meme2.id, 'Caption 1 for Meme 2');
        await db.run('INSERT INTO captions (meme_id, text) VALUES (?, ?)', meme2.id, 'Caption 2 for Meme 2');
        // Add more captions as needed
    }

    return db;
}
