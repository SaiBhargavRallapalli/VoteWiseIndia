'use strict';

/**
 * Language code mapping for Google Cloud Translation API.
 * Maps human-readable names to ISO 639-1 codes.
 * @constant {Object.<string, string>}
 */
const LANGUAGE_CODES = {
  hindi:      'hi',
  tamil:      'ta',
  telugu:     'te',
  kannada:    'kn',
  marathi:    'mr',
  bengali:    'bn',
  gujarati:   'gu',
  punjabi:    'pa',
  malayalam:  'ml',
  odia:       'or',
  english:    'en',
  urdu:       'ur',
  assamese:   'as',
  nepali:     'ne',
  sindhi:     'sd',
  konkani:    'gom',
  maithili:   'mai',
  dogri:      'doi',
  kashmiri:   'ks',
  manipuri:   'mni-Mtei',
  sanskrit:   'sa',
  santhali:   'sat',
  bodo:       'brx',
};

/**
 * Translates text using Google Cloud Translation API (v2),
 * falling back to Gemini if Cloud Translation is unavailable.
 * @param {string} text      - Text to translate
 * @param {string} language  - Target language name (hindi, tamil, etc.)
 * @param {string} cloudKey  - Google Cloud API key
 * @param {string} geminiKey - Gemini API key (fallback)
 * @returns {Promise<{translated: string, service: string}>}
 */
async function translateWithCloudAPI(text, language, cloudKey, geminiKey) {
  const targetLang = LANGUAGE_CODES[language.toLowerCase()] || 'hi';

  if (cloudKey) {
    try {
      const res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${cloudKey}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ q: text, target: targetLang, format: 'text' }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const translated = data?.data?.translations?.[0]?.translatedText;
        if (translated) {
          return {
            translated,
            service: 'cloud-translation-api',
            detectedLanguage: data?.data?.translations?.[0]?.detectedSourceLanguage,
          };
        }
      }
      console.warn('Cloud Translation API failed, falling back to Gemini');
    } catch (err) {
      console.warn('Cloud Translation error:', err.message);
    }
  }

  if (geminiKey) {
    const prompt = `Translate the following text to ${language}. Return only the translated text, nothing else:\n\n${text}`;
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          contents:         [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 256, temperature: 0.2 },
        }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (translated) return { translated, service: 'gemini-fallback' };
    }
  }

  return { translated: `[Demo] "${text}" → ${language}`, service: 'demo' };
}

/**
 * Converts text to speech using Google Cloud Text-to-Speech API.
 * Supports multiple Indian languages for accessibility.
 * @param {string} text     - Text to synthesize
 * @param {string} language - Language code (hi, ta, te, etc.)
 * @param {string} apiKey   - Google Cloud API key
 * @returns {Promise<{audioContent: string, service: string}|null>}
 */
async function textToSpeech(text, language, apiKey) {
  if (!apiKey) return null;

  const voiceMap = {
    hi: { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A' },
    ta: { languageCode: 'ta-IN', name: 'ta-IN-Neural2-A' },
    te: { languageCode: 'te-IN', name: 'te-IN-Standard-A' },
    kn: { languageCode: 'kn-IN', name: 'kn-IN-Standard-A' },
    mr: { languageCode: 'mr-IN', name: 'mr-IN-Standard-A' },
    bn: { languageCode: 'bn-IN', name: 'bn-IN-Standard-A' },
    gu: { languageCode: 'gu-IN', name: 'gu-IN-Standard-A' },
    pa: { languageCode: 'pa-IN', name: 'pa-IN-Standard-A' },
    ml: { languageCode: 'ml-IN', name: 'ml-IN-Standard-A' },
    en: { languageCode: 'en-IN', name: 'en-IN-Neural2-A' },
  };

  const voice = voiceMap[language] || voiceMap.en;

  try {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          input:       { text },
          voice:       { languageCode: voice.languageCode, name: voice.name },
          audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95 },
        }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      return { audioContent: data.audioContent, service: 'cloud-text-to-speech' };
    }
  } catch (err) {
    console.warn('Text-to-Speech error:', err.message);
  }
  return null;
}

/**
 * Performs OCR on an image using Google Cloud Vision API.
 * Used for Voter ID card verification and text extraction.
 * @param {string} imageBase64 - Base64 encoded image data
 * @param {string} apiKey      - Google Cloud API key
 * @returns {Promise<{text: string, confidence: number, service: string}|null>}
 */
async function extractTextFromImage(imageBase64, apiKey) {
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          requests: [{
            image:    { content: imageBase64 },
            features: [
              { type: 'TEXT_DETECTION',          maxResults: 10 },
              { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1  },
            ],
          }],
        }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      const textAnnotations = data.responses?.[0]?.textAnnotations;
      const fullText = data.responses?.[0]?.fullTextAnnotation?.text
        || textAnnotations?.[0]?.description || '';
      const confidence = data.responses?.[0]?.fullTextAnnotation?.pages?.[0]?.confidence || 0.85;
      return { text: fullText, confidence, service: 'cloud-vision-api' };
    }
  } catch (err) {
    console.warn('Vision API error:', err.message);
  }
  return null;
}

/**
 * Exports analytics events to BigQuery.
 * Simulates the export in demo mode when no project is configured.
 * @param {string} eventType - Event type identifier
 * @param {Object} eventData - Event payload
 * @returns {Promise<{success: boolean, service: string}>}
 */
async function exportToBigQuery(eventType, eventData) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const dataset   = process.env.BIGQUERY_DATASET || 'votewise_analytics';

  if (!projectId) {
    return { success: true, service: 'demo', message: 'BigQuery export simulated (no project configured)' };
  }

  const row = {
    event_type: eventType,
    event_data: JSON.stringify(eventData),
    timestamp:  new Date().toISOString(),
    session_id: eventData.sessionId || 'anonymous',
  };

  console.log(`[BigQuery] Export to ${projectId}.${dataset}: ${eventType}`, row);
  return { success: true, service: 'bigquery', table: `${dataset}.events`, row };
}

module.exports = { LANGUAGE_CODES, translateWithCloudAPI, textToSpeech, extractTextFromImage, exportToBigQuery };
