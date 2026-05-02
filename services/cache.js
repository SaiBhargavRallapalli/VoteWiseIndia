'use strict';

/** @type {Map<string, {data: *, ts: number}>} */
const responseCache = new Map();

/** Cache TTL in milliseconds */
const CACHE_TTL = 30_000;

/**
 * Retrieves a cached response if it exists and has not expired.
 * @param {string} key - Cache key identifier
 * @returns {*|null} Cached data or null if miss/expired
 */
function getCached(key) {
  const entry = responseCache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) { return entry.data; }
  return null;
}

/**
 * Stores data in the in-memory response cache.
 * @param {string} key  - Cache key identifier
 * @param {*}      data - Data to cache
 */
function setCache(key, data) {
  responseCache.set(key, { data, ts: Date.now() });
}

module.exports = { getCached, setCache, CACHE_TTL };
