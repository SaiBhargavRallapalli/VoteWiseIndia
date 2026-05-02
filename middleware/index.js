'use strict';

/**
 * Logs incoming API requests with timing information.
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  const url   = req.originalUrl || req.url;
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (url.startsWith('/api/')) {
      console.info(`[${new Date().toISOString()}] ${req.method} ${url} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
}

/**
 * Validates required environment variables at startup.
 * Logs warnings for missing optional configs.
 */
function validateEnvironment() {
  const required = ['PORT'];
  const optional = [
    'GEMINI_API_KEY',
    'GOOGLE_CLOUD_API_KEY',
    'FIREBASE_API_KEY',
    'FIREBASE_PROJECT_ID',
    'BIGQUERY_DATASET',
  ];

  const missing = required.filter(key => !process.env[key] && key !== 'PORT');
  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(', ')}`);
  }

  const unconfigured = optional.filter(key => !process.env[key]);
  if (unconfigured.length > 0) {
    console.warn(`Optional env vars not set (features may run in demo mode): ${unconfigured.join(', ')}`);
  }
}

module.exports = { requestLogger, validateEnvironment };
