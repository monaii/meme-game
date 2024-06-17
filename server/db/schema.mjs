// server/db/schema.mjs
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export const initializeDatabase = async () => {
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

    return db;
};
