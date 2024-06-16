import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Strategy as LocalStrategy } from 'passport-local';
import { initializeDatabase } from './database.mjs'; // Import the database module
import { comparePassword } from './utilities.js'; // Import the utility functions

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your client origin
  credentials: true
}));

app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/images', express.static('client/public/images'));

let db;
initializeDatabase().then(database => {
  db = database;
  console.log('Database initialized');

  // Passport.js setup
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.get('SELECT * FROM users WHERE username = ?', username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.get('SELECT * FROM users WHERE id = ?', id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Routes
  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
  });

  app.post('/api/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
  });

  app.get('/api/memes', async (req, res) => {
    try {
      const memes = await db.all('SELECT * FROM memes ORDER BY RANDOM() LIMIT 1');
      const meme = memes[0];
      const captions = await db.all('SELECT * FROM captions WHERE meme_id = ? ORDER BY RANDOM() LIMIT 7', meme.id);
      res.json({ meme, captions });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch memes or captions' });
    }
  });

  app.post('/api/game', async (req, res) => {
    try {
      const { userId, memeId, selectedCaptionId } = req.body;
      const meme = await db.get('SELECT * FROM memes WHERE id = ?', memeId);
      const correctCaptions = await db.all('SELECT * FROM captions WHERE id IN (SELECT caption_id FROM meme_captions WHERE meme_id = ?)', memeId);

      let score = 0;
      if (correctCaptions.some(caption => caption.id === selectedCaptionId)) {
        score = 5;
      }

      const game = await db.run('INSERT INTO games (user_id, total_score) VALUES (?, ?)', userId, score);
      await db.run('INSERT INTO rounds (game_id, meme_id, selected_caption_id, score) VALUES (?, ?, ?, ?)', game.lastID, memeId, selectedCaptionId, score);

      res.json({ score });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save game data' });
    }
  });

  app.get('/api/history', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const games = await db.all(`
        SELECT g.id as game_id, g.total_score, r.meme_id, r.selected_caption_id, r.score 
        FROM games g 
        JOIN rounds r ON g.id = r.game_id 
        WHERE g.user_id = ?
      `, req.user.id);

      const history = games.map(game => ({
        gameId: game.game_id,
        totalScore: game.total_score,
        memeId: game.meme_id,
        selectedCaptionId: game.selected_caption_id,
        score: game.score,
      }));

      res.json(history);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch game history' });
    }
  });

  // Start server
  app.listen(3001, () => {
    console.log('Server listening on port 3001');
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
