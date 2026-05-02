'use strict';

const admin = require('firebase-admin');

let db = null;

try {
  admin.initializeApp();
  db = admin.firestore();
  console.info('Firebase Firestore: connected');
} catch (e) {
  console.warn('Firebase Firestore: running without persistence —', e.message);
}

/**
 * Saves a quiz score to Firestore for leaderboard tracking.
 * Silently skips if Firestore is not configured.
 * @param {string} sessionId - Anonymous session identifier
 * @param {number} score     - Number of correct answers
 * @param {number} total     - Total number of questions
 */
async function saveQuizScore(sessionId, score, total) {
  if (!db) return;
  try {
    await db.collection('quizScores').add({
      sessionId,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore write failed:', err.message);
  }
}

/**
 * Retrieves top quiz scores from Firestore for leaderboard display.
 * Returns empty array if Firestore is not configured or query fails.
 * @param {number} [limit=10] - Maximum number of scores to return
 * @returns {Promise<Array>} Array of score objects
 */
async function getTopScores(limit = 10) {
  if (!db) return [];
  try {
    const snap = await db.collection('quizScores')
      .orderBy('percentage', 'desc')
      .limit(limit)
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Firestore read failed:', err.message);
    return [];
  }
}

module.exports = { db, saveQuizScore, getTopScores };
