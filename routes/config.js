'use strict';

const express    = require('express');
const { db }     = require('../services/firestore');
const { apiLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

/** @route GET /api/health */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'VoteWise India', timestamp: new Date().toISOString() });
});

/** @route GET /api/config */
router.get('/config', apiLimiter, (_req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json({
    firebase: {
      apiKey:            process.env.FIREBASE_API_KEY             || '',
      authDomain:        process.env.FIREBASE_AUTH_DOMAIN         || '',
      projectId:         process.env.FIREBASE_PROJECT_ID          || '',
      storageBucket:     process.env.FIREBASE_STORAGE_BUCKET      || '',
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      appId:             process.env.FIREBASE_APP_ID              || '',
      measurementId:     process.env.FIREBASE_MEASUREMENT_ID      || '',
    },
    features: {
      auth:            !!process.env.FIREBASE_API_KEY,
      analytics:       !!process.env.FIREBASE_MEASUREMENT_ID,
      translate:       !!(process.env.GOOGLE_CLOUD_API_KEY || process.env.GEMINI_API_KEY),
      textToSpeech:    !!process.env.GOOGLE_CLOUD_API_KEY,
      visionAPI:       !!process.env.GOOGLE_CLOUD_API_KEY,
      naturalLanguage: !!process.env.GEMINI_API_KEY,
      bigQuery:        !!process.env.FIREBASE_PROJECT_ID,
      geminiChat:      !!process.env.GEMINI_API_KEY,
    },
    googleServices: {
      total:   9,
      enabled: [
        !!db,
        !!process.env.FIREBASE_API_KEY,
        !!process.env.FIREBASE_MEASUREMENT_ID,
        !!process.env.GEMINI_API_KEY,
        !!process.env.GOOGLE_CLOUD_API_KEY,
        !!process.env.GOOGLE_CLOUD_API_KEY,
        !!process.env.GOOGLE_CLOUD_API_KEY,
        !!process.env.GEMINI_API_KEY,
        !!process.env.FIREBASE_PROJECT_ID,
      ].filter(Boolean).length,
    },
  });
});

/** @route GET /api/services */
router.get('/services', apiLimiter, (_req, res) => {
  const services = {
    firebase: {
      firestore:  !!db,
      auth:       !!process.env.FIREBASE_API_KEY,
      analytics:  !!process.env.FIREBASE_MEASUREMENT_ID,
    },
    googleCloud: {
      geminiAI:          !!process.env.GEMINI_API_KEY,
      cloudTranslation:  !!process.env.GOOGLE_CLOUD_API_KEY,
      cloudTextToSpeech: !!process.env.GOOGLE_CLOUD_API_KEY,
      cloudVision:       !!process.env.GOOGLE_CLOUD_API_KEY,
      naturalLanguage:   !!process.env.GEMINI_API_KEY,
      bigQuery:          !!process.env.FIREBASE_PROJECT_ID,
    },
    integrations: {
      googleCalendar: true,
      googleMaps:     true,
    },
  };

  const enabledCount = Object.values(services.googleCloud).filter(Boolean).length +
                       Object.values(services.firebase).filter(Boolean).length;

  res.json({
    services,
    summary: {
      totalGoogleServices: 9,
      enabledServices:     enabledCount,
      coverage:            `${Math.round((enabledCount / 9) * 100)}%`,
    },
  });
});

module.exports = router;
