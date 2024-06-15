import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFilePath = path.resolve(__dirname, 'database.sqlite');
console.log('Database file path:', dbFilePath);

const dbPromise = open({
  filename: dbFilePath,
  driver: sqlite3.Database
});

const initDb = async () => {
  try {
    const db = await dbPromise;
    console.log('Database opened successfully'); // Log database opening

    await db.exec(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      password TEXT
    )`);
    console.log('Users table created');

    await db.exec(`CREATE TABLE IF NOT EXISTS memes (
      id INTEGER PRIMARY KEY,
      url TEXT
    )`);
    console.log('Memes table created');

    await db.exec(`CREATE TABLE IF NOT EXISTS captions (
      id INTEGER PRIMARY KEY,
      text TEXT,
      meme_id INTEGER
    )`);
    console.log('Captions table created');

    await db.exec(`CREATE TABLE IF NOT EXISTS game_history (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      meme_id INTEGER,
      caption_id INTEGER,
      score INTEGER
    )`);
    console.log('Game history table created');

    const memeCount = await db.get('SELECT COUNT(*) as count FROM memes');
    if (memeCount.count === 0) {
      await db.run('INSERT INTO memes (url) VALUES (?)', ['http://example.com/meme1.jpg']);
      await db.run('INSERT INTO memes (url) VALUES (?)', ['http://example.com/meme2.jpg']);
      console.log('Inserted initial meme data');
    }

    const captionCount = await db.get('SELECT COUNT(*) as count FROM captions');
    if (captionCount.count === 0) {
      await db.run('INSERT INTO captions (text, meme_id) VALUES (?, ?)', ['Caption 1', 1]);
      await db.run('INSERT INTO captions (text, meme_id) VALUES (?, ?)', ['Caption 2', 1]);
      await db.run('INSERT INTO captions (text, meme_id) VALUES (?, ?)', ['Caption 3', 1]);
      await db.run('INSERT INTO captions (text, meme_id) VALUES (?, ?)', ['Caption 4', 1]);
      await db.run('INSERT INTO captions (text, meme_id) VALUES (?, ?)', ['Caption 5', 1]);
      await db.run('INSERT INTO captions (text, meme_id) VALUES (?, ?)', ['Caption 6', 1]);
      await db.run('INSERT INTO captions (text, meme_id) VALUES (?, ?)', ['Caption 7', 1]);
      console.log('Inserted initial captions data');
    }

    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (userCount.count === 0) {
      const hashedPassword1 = 'password1'; // Use pre-hashed passwords for simplicity
      const hashedPassword2 = 'password2';
      await db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['user1', hashedPassword1]);
      await db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['user2', hashedPassword2]);
      console.log('Inserted initial users data');
    }

    const users = await db.all('SELECT * FROM users');
    console.log('Users:', users);

  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

initDb().then(() => {
  console.log('Database initialized');
}).catch(console.error);
