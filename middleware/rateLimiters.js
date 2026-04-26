'use strict';

const rateLimit = require('express-rate-limit');

const isTestEnv = process.env.NODE_ENV === 'test';

/** Rate limiter for AI chat endpoint — 20 req/min per IP */
const chatLimiter = rateLimit({
  windowMs: 60_000,
  max:      isTestEnv ? 10000 : 20,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many requests. Please wait a moment.' },
  skip: () => isTestEnv,
});

/** General rate limiter for data endpoints — 100 req/min per IP */
const apiLimiter = rateLimit({
  windowMs: 60_000,
  max:      isTestEnv ? 10000 : 100,
  message:  { error: 'Too many requests.' },
  skip: () => isTestEnv,
});

module.exports = { chatLimiter, apiLimiter, isTestEnv };
