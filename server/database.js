import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';

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
      text TEXT
    );
    CREATE TABLE IF NOT EXISTS meme_captions (
      meme_id INTEGER,
      caption_id INTEGER,
      PRIMARY KEY (meme_id, caption_id),
      FOREIGN KEY (meme_id) REFERENCES memes(id),
      FOREIGN KEY (caption_id) REFERENCES captions(id)
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

    // Clear existing data to prevent duplicate entries
    await db.exec(`
    DELETE FROM meme_captions;
    DELETE FROM captions;
    DELETE FROM memes;
    DELETE FROM users;
  `);

    // Insert memes into the database
    const memes = [
        'meme1.jpeg',
        'meme2.jpeg',
        'meme3.jpeg',
        'meme4.jpeg',
        'meme5.jpeg',
        'meme6.jpeg',
        'meme7.jpeg',
        'meme8.jpeg',
        'meme9.jpeg',
        'meme10.jpeg'
    ];

    for (const imageUrl of memes) {
        await db.run('INSERT INTO memes (image_url) VALUES (?)', imageUrl);
    }

    // Insert captions into the database
    const captions = [
        'When you see your code running without errors',
        'That moment when you realize you forgot to commit your changes',
        'When the code compiles but does not run',
        'Debugging: Being the detective in a crime movie where you are also the murderer',
        'When your program finally works',
        'Why did the programmer quit his job? Because he didn\'t get arrays.',
        'When you find a solution after hours of debugging'
    ];

    for (let i = 0; i < 50; i++) {
        const text = captions[i % captions.length];
        await db.run('INSERT INTO captions (text) VALUES (?)', text);
    }

    // Associate memes with captions (assuming each meme has at least two associated captions)
    for (let memeId = 1; memeId <= 10; memeId++) {
        await db.run('INSERT INTO meme_captions (meme_id, caption_id) VALUES (?, ?)', memeId, (memeId * 2) - 1);
        await db.run('INSERT INTO meme_captions (meme_id, caption_id) VALUES (?, ?)', memeId, memeId * 2);
    }

    // Add initial users
    const hashedPassword1 = await bcrypt.hash('password1', 10);
    const hashedPassword2 = await bcrypt.hash('password2', 10);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', 'user1', hashedPassword1);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', 'user2', hashedPassword2);

    return db;
}

export async function addCaption(db, text) {
    await db.run('INSERT INTO captions (text) VALUES (?)', text);
}

export async function associateMemeCaption(db, memeId, captionId) {
    await db.run('INSERT INTO meme_captions (meme_id, caption_id) VALUES (?, ?)', memeId, captionId);
}
