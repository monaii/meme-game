import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { initializeDatabase, getUserByUsername, getUserById, getRandomMeme, getCorrectCaptions, getOtherCaptions, addRound, addUser, getOrCreateGameId, updateGameScore, getRoundsByUserId } from './dao.mjs';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Adjust the port if necessary
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Serve static images from the public/images directory
app.use('/images', express.static('public/images'));

initializeDatabase().then(() => {
  console.log('Database initialized');

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
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
      const meme = await getRandomMeme();
      const correctCaptions = await getCorrectCaptions(meme.id);
      const otherCaptions = await getOtherCaptions(meme.id);
      const captions = [...correctCaptions, ...otherCaptions].sort(() => 0.5 - Math.random());
      res.json({ meme, captions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch meme and captions' });
    }
  });

  app.post('/api/game', async (req, res) => {
    const { memeId, selectedCaptionId, round } = req.body;
    try {
      const correctCaptions = await getCorrectCaptions(memeId);
      const correct = correctCaptions.some(caption => caption.id === selectedCaptionId);
      let gameId = null;
      let totalScore = null;

      if (req.isAuthenticated()) {
        gameId = await getOrCreateGameId(req.user.id);
        const score = correct ? 5 : 0;
        await addRound(memeId, selectedCaptionId, gameId, score);

        const rounds = await getRoundsByUserId(req.user.id);
        if (round >= 3) {
          totalScore = rounds.reduce((sum, r) => sum + r.score, 0);
          await updateGameScore(gameId, totalScore);
        }
      }

      res.json({ correct, correctCaptions: correctCaptions.map(caption => caption.id), totalScore });
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit caption' });
    }
  });

  app.get('/api/profile', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const user = await getUserById(req.user.id);
      const gameHistory = await getRoundsByUserId(req.user.id);
      res.json({ user, gameHistory });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  app.listen(3001, () => {
    console.log('Server listening on port 3001');
  });
});
