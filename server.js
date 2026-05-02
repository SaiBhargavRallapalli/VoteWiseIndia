/**
 * @fileoverview VoteWise India — Express backend server
 * @description AI-powered Indian election education assistant.
 *   Provides election data, Gemini-powered chat, quiz engine,
 *   Firebase Firestore persistence, multilingual support, and
 *   comprehensive Google Cloud service integrations including:
 *   - Cloud Translation API for accurate multilingual content
 *   - Cloud Text-to-Speech API for accessibility features
 *   - Cloud Vision API for Voter ID verification
 *   - Cloud Natural Language API for text analysis
 *   - BigQuery for analytics data export
 * @module server
 * @version 3.0.0
 */

'use strict';

require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const compress = require('compression');
const path     = require('path');

const { validateEnvironment, requestLogger } = require('./middleware/index');
const configRouter      = require('./routes/config');
const electionRouter    = require('./routes/election');
const contentDataRouter = require('./routes/contentData');
const aiRouter          = require('./routes/ai');
const { ELECTION_DATA } = require('./data/electionData');

validateEnvironment();

const app  = express();
const PORT = process.env.PORT || 8080;

// ── Security & Middleware ─────────────────────────────────────────────────────

app.use(compress());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // Set ALLOWED_ORIGIN env var in production to restrict cross-origin access
      scriptSrc:  ["'self'",
                   'https://www.gstatic.com',
                   'https://apis.google.com',
                   'https://www.googletagmanager.com',
                   'https://www.google-analytics.com'],
      styleSrc:   ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:    ["'self'", 'https://fonts.gstatic.com'],
      frameSrc:   ['https://www.google.com', 'https://accounts.google.com',
                   ...(process.env.FIREBASE_AUTH_DOMAIN ? [`https://${process.env.FIREBASE_AUTH_DOMAIN}`] : [])],
      connectSrc: ["'self'",
                   'https://*.googleapis.com',
                   'https://www.gstatic.com',
                   'https://www.google-analytics.com',
                   'https://firebaseapp.com',
                   'https://*.firebaseio.com',
                   'https://apis.google.com'],
      imgSrc:     ["'self'", 'data:', 'https:'],
    },
  },
}));

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*', methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// ── Routes ────────────────────────────────────────────────────────────────────

app.use('/api', configRouter);
app.use('/api', electionRouter);
app.use('/api', contentDataRouter);
app.use('/api', aiRouter);

// ── Static Files & SPA Fallback ───────────────────────────────────────────────

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Global Error Handler ──────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

// ── Start Server ──────────────────────────────────────────────────────────────

const { db } = require('./services/firestore');

const server = app.listen(PORT, () => {
  console.info(`VoteWise India on http://localhost:${PORT}`);
  console.info(`Gemini: ${process.env.GEMINI_API_KEY ? 'configured ✓' : 'demo mode'}`);
  console.info(`Firestore: ${db ? 'connected ✓' : 'not configured'}`);
});

module.exports = { app, server, ELECTION_DATA };
