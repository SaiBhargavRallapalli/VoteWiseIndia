'use strict';

const express        = require('express');
const { ELECTION_DATA, CHECKLIST_ITEMS, EVM_CANDIDATES } = require('../data/electionData');
const { getCached, setCache }           = require('../services/cache');
const { saveQuizScore, getTopScores }   = require('../services/firestore');
const { apiLimiter }                    = require('../middleware/rateLimiters');

const router = express.Router();

/** @route GET /api/election */
router.get('/election', apiLimiter, (_req, res) => {
  const cached = getCached('election');
  if (cached) return res.set('X-Cache', 'HIT').set('Cache-Control', 'public, max-age=300').json(cached);

  const { quizQuestions, ...data } = ELECTION_DATA;
  setCache('election', data);
  res.set('X-Cache', 'MISS').set('Cache-Control', 'public, max-age=300').json(data);
});

/** @route GET /api/steps */
router.get('/steps', apiLimiter, (_req, res) => {
  const cached = getCached('steps');
  if (cached) return res.set('X-Cache', 'HIT').json(cached);

  const data = { votingSteps: ELECTION_DATA.votingSteps, registrationSteps: ELECTION_DATA.registrationSteps };
  setCache('steps', data);
  res.set('X-Cache', 'MISS').json(data);
});

/** @route GET /api/quiz */
router.get('/quiz', apiLimiter, (_req, res) => {
  const questions = ELECTION_DATA.quizQuestions.map(({ answer, explain, ...q }) => q);
  res.set('Cache-Control', 'public, max-age=600').json({ questions, total: questions.length });
});

/** @route POST /api/quiz/submit */
router.post('/quiz/submit', apiLimiter, async (req, res) => {
  const { answers, sessionId } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'answers must be an array.' });
  }
  if (answers.length !== ELECTION_DATA.quizQuestions.length) {
    return res.status(400).json({ error: `Expected ${ELECTION_DATA.quizQuestions.length} answers.` });
  }
  if (!answers.every(a => typeof a === 'number')) {
    return res.status(400).json({ error: 'Each answer must be a number (option index).' });
  }

  const results = ELECTION_DATA.quizQuestions.map((q, i) => ({
    id:         q.id,
    question:   q.q,
    yourAnswer: answers[i],
    correct:    q.answer,
    isCorrect:  answers[i] === q.answer,
    explain:    q.explain,
  }));

  const score = results.filter(r => r.isCorrect).length;
  const total = results.length;
  const sid   = typeof sessionId === 'string' ? sessionId.slice(0, 64) : 'anonymous';

  await saveQuizScore(sid, score, total);

  res.json({ score, total, percentage: Math.round((score / total) * 100), results });
});

/** @route GET /api/leaderboard */
router.get('/leaderboard', apiLimiter, async (_req, res) => {
  const cached = getCached('leaderboard');
  if (cached) return res.set('X-Cache', 'HIT').json(cached);

  const scores  = await getTopScores(10);
  const payload = { scores };
  setCache('leaderboard', payload);
  res.set('X-Cache', 'MISS').json(payload);
});

/** @route GET /api/checklist */
router.get('/checklist', apiLimiter, (_req, res) => {
  const cached = getCached('checklist');
  if (cached) return res.set('X-Cache', 'HIT').set('Cache-Control', 'public, max-age=3600').json(cached);

  const payload = { items: CHECKLIST_ITEMS, total: CHECKLIST_ITEMS.length };
  setCache('checklist', payload);
  res.set('X-Cache', 'MISS').set('Cache-Control', 'public, max-age=3600').json(payload);
});

/** @route GET /api/evm/candidates */
router.get('/evm/candidates', apiLimiter, (_req, res) => {
  const cached = getCached('evm-candidates');
  if (cached) return res.set('X-Cache', 'HIT').set('Cache-Control', 'public, max-age=3600').json(cached);

  const payload = { candidates: EVM_CANDIDATES, total: EVM_CANDIDATES.length };
  setCache('evm-candidates', payload);
  res.set('X-Cache', 'MISS').set('Cache-Control', 'public, max-age=3600').json(payload);
});

module.exports = router;
