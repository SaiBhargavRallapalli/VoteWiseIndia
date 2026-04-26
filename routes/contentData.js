'use strict';

const express = require('express');
const { ELECTION_DATA, STATES, UNION_TERRITORIES, LOK_SABHA, RAJYA_SABHA, PRESIDENT } = require('../data/electionData');
const { getCached, setCache } = require('../services/cache');
const { apiLimiter }          = require('../middleware/rateLimiters');

const router = express.Router();

/** @route GET /api/dates */
router.get('/dates', apiLimiter, (_req, res) => {
  const cached = getCached('dates');
  if (cached) return res.set('X-Cache', 'HIT').json(cached);

  const dates = ELECTION_DATA.importantDates.map(d => ({
    ...d,
    calUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE` +
            `&text=${encodeURIComponent(d.event)}` +
            `&dates=${d.calStart}/${d.calEnd}` +
            `&details=${encodeURIComponent('Indian Election Event — VoteWise India')}` +
            `&location=${encodeURIComponent('India')}`,
  }));

  setCache('dates', { dates });
  res.set('X-Cache', 'MISS').json({ dates });
});

/** @route GET /api/announcements */
router.get('/announcements', apiLimiter, (_req, res) => {
  res.json({ announcements: ELECTION_DATA.announcements });
});

/** @route GET /api/analyze */
router.get('/analyze', apiLimiter, async (req, res) => {
  const { text } = req.query;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text query parameter is required.' });
  }
  if (text.trim().length === 0) {
    return res.status(400).json({ error: 'text cannot be empty.' });
  }
  if (text.length > 500) {
    return res.status(400).json({ error: 'text too long. Max 500 characters.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      entities: [
        { name: 'Election Commission of India', type: 'ORGANIZATION', salience: 0.80 },
        { name: 'Lok Sabha',                    type: 'EVENT',        salience: 0.60 },
        { name: 'Voter ID',                     type: 'OTHER',        salience: 0.35 },
      ],
      sentiment: { score: 0.1, magnitude: 0.5, label: 'Neutral' },
      language:  'en',
      demo:      true,
    });
  }

  try {
    const NL_BASE = 'https://language.googleapis.com/v1/documents';

    const entityRes = await fetch(`${NL_BASE}:analyzeEntities?key=${apiKey}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        document:     { type: 'PLAIN_TEXT', content: text.trim() },
        encodingType: 'UTF8',
      }),
    });

    if (!entityRes.ok) {
      const err = await entityRes.json().catch(() => ({}));
      console.error('NL Entity API error:', entityRes.status, err);
      return res.status(502).json({ error: 'Natural Language API unavailable. Please try again.' });
    }

    const entityData = await entityRes.json();

    const sentRes = await fetch(`${NL_BASE}:analyzeSentiment?key=${apiKey}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        document:     { type: 'PLAIN_TEXT', content: text.trim() },
        encodingType: 'UTF8',
      }),
    });

    const sentData  = sentRes.ok ? await sentRes.json() : null;
    const score     = sentData?.documentSentiment?.score     ?? 0;
    const magnitude = sentData?.documentSentiment?.magnitude ?? 0;
    const sentimentLabel = s => s > 0.25 ? 'Positive' : s < -0.25 ? 'Negative' : 'Neutral';

    res.json({
      entities: (entityData.entities || [])
        .slice(0, 8)
        .map(e => ({
          name:     e.name,
          type:     e.type,
          salience: Math.round((e.salience || 0) * 100) / 100,
        })),
      sentiment: {
        score:     Math.round(score * 100) / 100,
        magnitude: Math.round(magnitude * 100) / 100,
        label:     sentimentLabel(score),
      },
      language: entityData.language || 'en',
    });
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

/** @route GET /api/states */
router.get('/states', apiLimiter, (req, res) => {
  const { region, type } = req.query;
  let states = [...STATES, ...UNION_TERRITORIES];
  if (type && (type === 'state' || type === 'ut')) states = states.filter(s => s.type === type);
  if (region) states = states.filter(s => s.region.toLowerCase() === decodeURIComponent(region).toLowerCase());
  res.set('Cache-Control', 'public, max-age=3600').json({
    states, total: states.length,
    totalStates: STATES.length, totalUTs: UNION_TERRITORIES.length,
  });
});

/** @route GET /api/parliament */
router.get('/parliament', apiLimiter, (_req, res) => {
  const cached = getCached('parliament');
  if (cached) return res.set('X-Cache', 'HIT').set('Cache-Control', 'public, max-age=3600').json(cached);
  const data = { lokSabha: LOK_SABHA, rajyaSabha: RAJYA_SABHA };
  setCache('parliament', data);
  res.set('X-Cache', 'MISS').set('Cache-Control', 'public, max-age=3600').json(data);
});

/** @route GET /api/president */
router.get('/president', apiLimiter, (_req, res) => {
  const cached = getCached('president');
  if (cached) return res.set('X-Cache', 'HIT').set('Cache-Control', 'public, max-age=3600').json(cached);
  setCache('president', PRESIDENT);
  res.set('X-Cache', 'MISS').set('Cache-Control', 'public, max-age=3600').json(PRESIDENT);
});

module.exports = router;
