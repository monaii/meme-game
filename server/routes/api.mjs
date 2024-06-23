import express from 'express';
import { getRandomMeme, submitRound, recordGame,getGameHistory,deleteGameHistory ,getTotalScores} from '../controllers/gameController.mjs';

const router = express.Router();

router.post('/random-meme', getRandomMeme);
router.post('/submit-round', submitRound);
router.post('/record-game', recordGame);
router.get('/game-history/:userId', getGameHistory);
router.delete('/game-history/:userId', deleteGameHistory);
router.get('/total-scores/:userId', getTotalScores);

export default router;