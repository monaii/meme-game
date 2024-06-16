import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Strategy as LocalStrategy } from 'passport-local';
import { initializeDatabase } from './database.mjs'; // Import the database module

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Adjust the port if necessary
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

  passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await db.get('SELECT * FROM users WHERE username = ?', username);
    if (!user || user.password !== password) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    return done(null, user);
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await db.get('SELECT * FROM users WHERE id = ?', id);
    done(null, user);
  });

  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
  });

  app.post('/api/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
  });

  app.get('/api/memes', async (req, res) => {
    try {
      const meme = await db.get('SELECT * FROM memes ORDER BY RANDOM() LIMIT 1');
      const correctCaptions = await db.all('SELECT * FROM captions WHERE id IN (SELECT caption_id FROM meme_captions WHERE meme_id = ?)', meme.id);
      const otherCaptions = await db.all('SELECT * FROM captions WHERE id NOT IN (SELECT caption_id FROM meme_captions WHERE meme_id = ?) ORDER BY RANDOM() LIMIT 5', meme.id);
      const captions = correctCaptions.concat(otherCaptions).sort(() => 0.5 - Math.random()); // Shuffle captions
      res.json({ meme, captions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch meme and captions' });
    }
  });

  app.post('/api/game', async (req, res) => {
    const { memeId, selectedCaptionId } = req.body;
    try {
      const correctCaptions = await db.all('SELECT * FROM captions WHERE id IN (SELECT caption_id FROM meme_captions WHERE meme_id = ?)', memeId);
      const correct = correctCaptions.some(caption => caption.id === selectedCaptionId);
      res.json({ correct, correctCaptions: correctCaptions.map(caption => caption.id) });
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit caption' });
    }
  });

  app.listen(3001, () => {
    console.log('Server listening on port 3001');
  });
});
