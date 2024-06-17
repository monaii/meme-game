import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';

const seedDatabase = async () => {
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
            'meme10.jpeg',
            'meme11.jpeg',
            'meme12.jpeg',
            'meme13.jpeg',
        ];
        for (const meme of memes) {
            await db.run('INSERT INTO memes (image_url) VALUES (?)', `/images/${meme}`);
        }
    }

    const captionCount = await db.get('SELECT COUNT(*) as count FROM captions');
    if (captionCount.count === 0) {
        const captions = [
            // Meme 1
            'Correct Caption 1 for Meme 1',
            'Correct Caption 2 for Meme 1',
            'Incorrect Caption 1 for Meme 1',
            'Incorrect Caption 2 for Meme 1',
            'Incorrect Caption 3 for Meme 1',
            'Incorrect Caption 4 for Meme 1',
            'Incorrect Caption 5 for Meme 1',

            // Meme 2
            'Correct Caption 1 for Meme 2',
            'Correct Caption 2 for Meme 2',
            'Incorrect Caption 1 for Meme 2',
            'Incorrect Caption 2 for Meme 2',
            'Incorrect Caption 3 for Meme 2',
            'Incorrect Caption 4 for Meme 2',
            'Incorrect Caption 5 for Meme 2',

            // Meme 3
            'Correct Caption 1 for Meme 3',
            'Correct Caption 2 for Meme 3',
            'Incorrect Caption 1 for Meme 3',
            'Incorrect Caption 2 for Meme 3',
            'Incorrect Caption 3 for Meme 3',
            'Incorrect Caption 4 for Meme 3',
            'Incorrect Caption 5 for Meme 3',

            // Meme 4
            'Correct Caption 1 for Meme 4',
            'Correct Caption 2 for Meme 4',
            'Incorrect Caption 1 for Meme 4',
            'Incorrect Caption 2 for Meme 4',
            'Incorrect Caption 3 for Meme 4',
            'Incorrect Caption 4 for Meme 4',
            'Incorrect Caption 5 for Meme 4',

            // Meme 5
            'Correct Caption 1 for Meme 5',
            'Correct Caption 2 for Meme 5',
            'Incorrect Caption 1 for Meme 5',
            'Incorrect Caption 2 for Meme 5',
            'Incorrect Caption 3 for Meme 5',
            'Incorrect Caption 4 for Meme 5',
            'Incorrect Caption 5 for Meme 5',

            // Meme 6
            'Correct Caption 1 for Meme 6',
            'Correct Caption 2 for Meme 6',
            'Incorrect Caption 1 for Meme 6',
            'Incorrect Caption 2 for Meme 6',
            'Incorrect Caption 3 for Meme 6',
            'Incorrect Caption 4 for Meme 6',
            'Incorrect Caption 5 for Meme 6',

            // Meme 7
            'Correct Caption 1 for Meme 7',
            'Correct Caption 2 for Meme 7',
            'Incorrect Caption 1 for Meme 7',
            'Incorrect Caption 2 for Meme 7',
            'Incorrect Caption 3 for Meme 7',
            'Incorrect Caption 4 for Meme 7',
            'Incorrect Caption 5 for Meme 7',

            // Meme 8
            'Correct Caption 1 for Meme 8',
            'Correct Caption 2 for Meme 8',
            'Incorrect Caption 1 for Meme 8',
            'Incorrect Caption 2 for Meme 8',
            'Incorrect Caption 3 for Meme 8',
            'Incorrect Caption 4 for Meme 8',
            'Incorrect Caption 5 for Meme 8',

            // Meme 9
            'Correct Caption 1 for Meme 9',
            'Correct Caption 2 for Meme 9',
            'Incorrect Caption 1 for Meme 9',
            'Incorrect Caption 2 for Meme 9',
            'Incorrect Caption 3 for Meme 9',
            'Incorrect Caption 4 for Meme 9',
            'Incorrect Caption 5 for Meme 9',

            // Meme 10
            'Correct Caption 1 for Meme 10',
            'Correct Caption 2 for Meme 10',
            'Incorrect Caption 1 for Meme 10',
            'Incorrect Caption 2 for Meme 10',
            'Incorrect Caption 3 for Meme 10',
            'Incorrect Caption 4 for Meme 10',
            'Incorrect Caption 5 for Meme 10',

            // Meme 11
            'Correct Caption 1 for Meme 11',
            'Correct Caption 2 for Meme 11',
            'Incorrect Caption 1 for Meme 11',
            'Incorrect Caption 2 for Meme 11',
            'Incorrect Caption 3 for Meme 11',
            'Incorrect Caption 4 for Meme 11',
            'Incorrect Caption 5 for Meme 11',

            // Meme 12
            'Correct Caption 1 for Meme 12',
            'Correct Caption 2 for Meme 12',
            'Incorrect Caption 1 for Meme 12',
            'Incorrect Caption 2 for Meme 12',
            'Incorrect Caption 3 for Meme 12',
            'Incorrect Caption 4 for Meme 12',
            'Incorrect Caption 5 for Meme 12',

        ];
        for (const caption of captions) {
            await db.run('INSERT INTO captions (text) VALUES (?)', caption);
        }
    }

    // Ensure relationships in meme_captions table
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (1, 1, 1)'); // Correct Caption 1 for Meme 1
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (1, 2, 1)'); // Correct Caption 2 for Meme 1
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (1, 3, 0)'); // Incorrect Caption 1 for Meme 1
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (1, 4, 0)'); // Incorrect Caption 2 for Meme 1
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (1, 5, 0)'); // Incorrect Caption 3 for Meme 1
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (1, 6, 0)'); // Incorrect Caption 4 for Meme 1
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (1, 7, 0)'); // Incorrect Caption 5 for Meme 1

    // Meme 2
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (2, 8, 1)'); // Correct Caption 1 for Meme 2
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (2, 9, 1)'); // Correct Caption 2 for Meme 2
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (2, 10, 0)'); // Incorrect Caption 1 for Meme 2
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (2, 11, 0)'); // Incorrect Caption 2 for Meme 2
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (2, 12, 0)'); // Incorrect Caption 3 for Meme 2
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (2, 13, 0)'); // Incorrect Caption 4 for Meme 2
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (2, 14, 0)'); // Incorrect Caption 5 for Meme 2

    // Meme 3
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (3, 15, 1)'); // Correct Caption 1 for Meme 3
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (3, 16, 1)'); // Correct Caption 2 for Meme 3
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (3, 17, 0)'); // Incorrect Caption 1 for Meme 3
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (3, 18, 0)'); // Incorrect Caption 2 for Meme 3
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (3, 19, 0)'); // Incorrect Caption 3 for Meme 3
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (3, 20, 0)'); // Incorrect Caption 4 for Meme 3
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (3, 21, 0)'); // Incorrect Caption 5 for Meme 3

    // Meme 4
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (4, 22, 1)'); // Correct Caption 1 for Meme 4
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (4, 23, 1)'); // Correct Caption 2 for Meme 4
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (4, 24, 0)'); // Incorrect Caption 1 for Meme 4
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (4, 25, 0)'); // Incorrect Caption 2 for Meme 4
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (4, 26, 0)'); // Incorrect Caption 3 for Meme 4
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (4, 27, 0)'); // Incorrect Caption 4 for Meme 4
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (4, 28, 0)'); // Incorrect Caption 5 for Meme 4

    // Meme 5
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (5, 29, 1)'); // Correct Caption 1 for Meme 5
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (5, 30, 1)'); // Correct Caption 2 for Meme 5
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (5, 31, 0)'); // Incorrect Caption 1 for Meme 5
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (5, 32, 0)'); // Incorrect Caption 2 for Meme 5
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (5, 33, 0)'); // Incorrect Caption 3 for Meme 5
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (5, 34, 0)'); // Incorrect Caption 4 for Meme 5
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (5, 35, 0)'); // Incorrect Caption 5 for Meme 5

    // Meme 6
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (6, 36, 1)'); // Correct Caption 1 for Meme 6
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (6, 37, 1)'); // Correct Caption 2 for Meme 6
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (6, 38, 0)'); // Incorrect Caption 1 for Meme 6
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (6, 39, 0)'); // Incorrect Caption 2 for Meme 6
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (6, 40, 0)'); // Incorrect Caption 3 for Meme 6
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (6, 41, 0)'); // Incorrect Caption 4 for Meme 6
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (6, 42, 0)'); // Incorrect Caption 5 for Meme 6

    // Meme 7
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (7, 43, 1)'); // Correct Caption 1 for Meme 7
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (7, 44, 1)'); // Correct Caption 2 for Meme 7
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (7, 45, 0)'); // Incorrect Caption 1 for Meme 7
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (7, 46, 0)'); // Incorrect Caption 2 for Meme 7
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (7, 47, 0)'); // Incorrect Caption 3 for Meme 7
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (7, 48, 0)'); // Incorrect Caption 4 for Meme 7
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (7, 49, 0)'); // Incorrect Caption 5 for Meme 7

    // Meme 8
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (8, 50, 1)'); // Correct Caption 1 for Meme 8
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (8, 51, 1)'); // Correct Caption 2 for Meme 8
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (8, 52, 0)'); // Incorrect Caption 1 for Meme 8
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (8, 53, 0)'); // Incorrect Caption 2 for Meme 8
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (8, 54, 0)'); // Incorrect Caption 3 for Meme 8
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (8, 55, 0)'); // Incorrect Caption 4 for Meme 8
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (8, 56, 0)'); // Incorrect Caption 5 for Meme 8

    // Meme 9
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (9, 57, 1)'); // Correct Caption 1 for Meme 9
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (9, 58, 1)'); // Correct Caption 2 for Meme 9
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (9, 59, 0)'); // Incorrect Caption 1 for Meme 9
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (9, 60, 0)'); // Incorrect Caption 2 for Meme 9
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (9, 61, 0)'); // Incorrect Caption 3 for Meme 9
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (9, 62, 0)'); // Incorrect Caption 4 for Meme 9
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (9, 63, 0)'); // Incorrect Caption 5 for Meme 9

    // Meme 10
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (10, 64, 1)'); // Correct Caption 1 for Meme 10
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (10, 65, 1)'); // Correct Caption 2 for Meme 10
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (10, 66, 0)'); // Incorrect Caption 1 for Meme 10
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (10, 67, 0)'); // Incorrect Caption 2 for Meme 10
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (10, 68, 0)'); // Incorrect Caption 3 for Meme 10
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (10, 69, 0)'); // Incorrect Caption 4 for Meme 10
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (10, 70, 0)'); // Incorrect Caption 5 for Meme 10

    // Meme 11
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (11, 71, 1)'); // Correct Caption 1 for Meme 11
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (11, 72, 1)'); // Correct Caption 2 for Meme 11
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (11, 73, 0)'); // Incorrect Caption 1 for Meme 11
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (11, 74, 0)'); // Incorrect Caption 2 for Meme 11
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (11, 75, 0)'); // Incorrect Caption 3 for Meme 11
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (11, 76, 0)'); // Incorrect Caption 4 for Meme 11
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (11, 77, 0)'); // Incorrect Caption 5 for Meme 11

    // Meme 12
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (12, 78, 1)'); // Correct Caption 1 for Meme 12
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (12, 79, 1)'); // Correct Caption 2 for Meme 12
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (12, 80, 0)'); // Incorrect Caption 1 for Meme 12
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (12, 81, 0)'); // Incorrect Caption 2 for Meme 12
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (12, 82, 0)'); // Incorrect Caption 3 for Meme 12
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (12, 83, 0)'); // Incorrect Caption 4 for Meme 12
    await db.run('INSERT INTO meme_captions (meme_id, caption_id, correct) VALUES (12, 84, 0)'); // Incorrect Caption 5 for Meme 12

};

seedDatabase().catch(err => console.error(err));
