import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { hashPassword } from '../utilities.js';

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
            const hashedPassword = await hashPassword(user.password);
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
        ];
        for (const meme of memes) {
            await db.run('INSERT INTO memes (image_url) VALUES (?)', `/images/${meme}`);
        }
    }

    const captionCount = await db.get('SELECT COUNT(*) as count FROM captions');
    if (captionCount.count === 0) {
        const captions = [
            // Meme 1
            'Me trying to act cool when I don\'t understand the joke but everyone is laughing.',
            'When your friend says they\'re \'good\' at cooking but burns water.',
            'I need six months of vacation, twice a year.',
            'I don’t always study, but when I do, I still don’t.',
            'Why do they call it rush hour when nothing moves?',
            'Exercise? I thought you said extra fries.',
            'Why fall in love when you can fall asleep?',

            // Meme 2
            'When they say \'Trust me, bro\' for the third time.',
            'When they say pineapple belongs on pizza.',
            'If Monday had a face, I would punch it.',
            'I\'m not lazy, I\'m on energy-saving mode.',
            'I don\'t need a therapist, I have a dog.',
            'Brains are awesome. I wish everybody had one.',
            'Please cancel my subscription to your issues.',

            // Meme 3
            'When you promise to focus on work but a new Netflix series drops.',
            'When you say you\'re going to learn Python but JavaScript releases a new framework.',
            'I’m on a 30-day diet. So far, I’ve lost 15 days.',
            'Dear Math, grow up and solve your own problems.',
            'I tried to be normal once. Worst two minutes of my life.',
            'Exercise? Extra fries!',
            'Seafood diet: I see food, eat it.',

            // Meme 4
            'When your code runs without errors and you have no idea why.',
            'When you add a new feature and the whole project stops working.',
            'Not lazy, energy-saving mode.',
            'Diet plan: fatter friends.',
            'Alexa, skip to Friday.',
            'I wish my wallet came with free refills.',
            'The first five days after the weekend are always the hardest.',

            // Meme 5
            'When the client changes the project requirements a day before the deadline.',
            'everyone in the machine learning and pattern recognition class.',
            'I\'m not weird, I\'m limited edition.',
            'I thought I wanted a career, turns out I just wanted paychecks.',
            'I’m not arguing, I’m just explaining why I’m right.',
            'I wish my bank account filled up as fast as my laundry basket.',
            'I could be a morning person if morning happened around noon.',

            // Meme 6
            'When you realize all your friends have done we project and you haven\'t even started.',
            'When you\'re the first one to finish the exam and everyone is still writing.',
            'Why don’t they just make mouse-flavored cat food?',
            'Some people just need a high five. In the face. With a chair.',
            'My room is not messy. It’s an obstacle course designed to keep me fit.',
            'If I were a superhero, my power would be making things awkward.',
            'I’m multitasking: I can listen, ignore, and forget all at the same time.',

            // Meme 7
            'How you doing?',
            'Joye doesn\'t share food.',
            'My bed is a magical place where I suddenly remember everything I forgot to do.',
            'Silence is golden, unless you have kids. Then silence is just suspicious.',
            'Why don’t they make the whole plane out of the black box material?',
            'Doing nothing is hard. You never know when you’re done.',
            'I didn’t choose the thug life, the thug life chose me.',

            // Meme 8
            'I\'m fine, I\'m totally fine. I\'m more than fine , I\'m great !!!.',
            'when everything is falling apart but you still try to be positive.',
            'If I’m not back in five minutes, just wait longer.',
            'I love my six-pack so much, I protect it with a layer of fat.',
            'I am one step away from being rich. All I need now is money.',
            'I hate when I’m singing a song and the artist gets the words wrong.',
            'The more you weigh, the harder you are to kidnap. Stay safe. Eat cake.',

            // Meme 9
            'Oh no, god , no , no , noooooooo, no , no no no no',
            'that\'s what she said',
            'The older I get, the more I understand why roosters just scream to start their day.',
            'I didn’t fail the test. I just found 100 ways to do it wrong.',
            'If stress burned calories, I\'d be a supermodel.',
            'I\'m not ignoring you, I\'m just selectively paying attention.',
            'Why don\'t scientists trust atoms? Because they make up everything.',

            // Meme 10
            'But you said my score will be 30, I said 30 out of 100.',
            'You stole my fries!, Sharing is caring.',
            'I can\'t find my keys!, Did you check the couch?',
            'You broke the vase!,Gravity did it.',
            'You ate the last slice of pizza!,It was self-defense.',
            'Common sense is not so common."',
            'If each day is a gift, I’d like to know where to return Mondays.',

            // Meme 11
            'my eyes , my eyessss , my eyesssssssss',
            'Monica and Chandler, Chandler and Monica',
            'I\'m not late; I\'m just early for tomorrow.',
            'Whoever said \'Out of sight, out of mind\' has never had a spider disappear in their room.',
            'I want a username and password prompt to say \'close enough.\'',
            'That moment when you spell a word so wrong, even spell check is like, \'I got nothing.\'',
            'My cooking is so awesome, even the smoke alarm cheers me on.',

            // Meme 12
            'True story',
            'Its gonna be LEGENDARY',
            'Running late is my cardio.',
            'If I had a dollar for every time I got distracted, I wish I had a puppy.',
            'I’m not short. I’m fun-sized.',
            'I don’t need a hair stylist. My pillow gives me a new hairstyle every morning."',
            'I’m not crazy. My reality is just different than yours.',

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
