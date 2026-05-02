import { escHtml, trackFeatureUsed } from './utils.js';
import { logEvent } from './firebase.js';

export async function doAnalyze() {
  const text = document.getElementById('analyze-input')?.value?.trim();
  const resultEl = document.getElementById('analyze-result');
  if (!resultEl) return;
  if (!text) { resultEl.textContent = 'Enter some election text to analyse.'; return; }

  resultEl.textContent = 'Analysing with Google Natural Language API…';
  try {
    const res  = await fetch('/api/analyze?text=' + encodeURIComponent(text.slice(0, 500)));
    const data = await res.json();
    if (data.error) { resultEl.textContent = '⚠ ' + data.error; return; }

    const entityLines = data.entities && data.entities.length
      ? data.entities.map(e => escHtml(e.name) + ' (' + escHtml(e.type) + ')').join('\n')
      : 'No named entities found';

    resultEl.innerHTML =
      '<strong style="color:var(--saffron)">Entities:</strong>\n' + entityLines +
      '\n\n<strong style="color:var(--saffron)">Sentiment:</strong> ' +
      escHtml(data.sentiment.label) + ' (' + data.sentiment.score.toFixed(2) + ')' +
      (data.demo ? '\n<em style="color:var(--text-3)">[demo mode]</em>' : '');

    logEvent('nl_analysis', { text_length: text.length });
  } catch (e) {
    resultEl.textContent = '⚠ Analysis failed. Please try again.';
  }
}

export async function doTextToSpeech() {
  const text = document.getElementById('tts-input')?.value?.trim();
  const language = document.getElementById('tts-lang')?.value || 'en';
  const audioEl = document.getElementById('tts-audio');
  const statusEl = document.getElementById('tts-status');
  const btn = document.getElementById('tts-btn');

  if (!text) { statusEl.textContent = 'Please enter text to convert to speech.'; return; }

  btn.disabled = true;
  btn.textContent = '⏳ Generating…';
  statusEl.textContent = 'Generating speech with Cloud Text-to-Speech API…';
  audioEl.style.display = 'none';

  try {
    const res = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });
    const data = await res.json();

    if (data.error) {
      statusEl.textContent = '⚠ ' + data.error;
    } else if (data.audioContent) {
      audioEl.src = 'data:audio/mp3;base64,' + data.audioContent;
      audioEl.style.display = 'block';
      statusEl.innerHTML = '✅ Speech generated using <strong style="color:var(--saffron)">' + escHtml(data.service) + '</strong>';
      audioEl.play();
    } else if (data.demo) {
      statusEl.innerHTML = '⚠ ' + escHtml(data.message) + ' <em style="color:var(--text-3)">[demo mode]</em>';
    } else {
      statusEl.textContent = '⚠ Could not generate speech.';
    }

    logEvent('tts_request', { language, text_length: text.length });
    trackFeatureUsed();
  } catch (e) {
    statusEl.textContent = '⚠ Speech generation failed. Please try again.';
  } finally {
    btn.disabled = false;
    btn.textContent = '🔊 Generate Speech';
  }
}

export async function verifyVoterID() {
  const fileInput = document.getElementById('voter-id-upload');
  const resultEl = document.getElementById('vision-result');

  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    resultEl.textContent = 'Please select a Voter ID image first.';
    return;
  }

  const file = fileInput.files[0];

  if (file.size > 5 * 1024 * 1024) {
    resultEl.textContent = '⚠ Image too large. Max 5MB.';
    return;
  }

  resultEl.textContent = '🔍 Extracting text with Cloud Vision API…';

  try {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const res = await fetch('/api/vision/verify-voter-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64 }),
    });
    const data = await res.json();

    if (data.error) {
      resultEl.textContent = '⚠ ' + data.error;
    } else if (data.extracted) {
      const e = data.extracted;
      let output = '<strong style="color:var(--saffron)">Extracted Data:</strong>\n';

      if (e.epicNumber) {
        output += '✅ EPIC Number: <strong style="color:var(--green)">' + escHtml(e.epicNumber) + '</strong>\n';
      } else {
        output += '⚠ EPIC Number: Not detected\n';
      }

      if (e.name) output += 'Name: ' + escHtml(e.name) + '\n';
      if (e.lineCount) output += 'Lines detected: ' + e.lineCount + '\n';

      output += '\n<strong style="color:var(--saffron)">Confidence:</strong> ' + Math.round(data.confidence * 100) + '%';
      output += '\n<strong style="color:var(--saffron)">Valid Voter ID:</strong> ' + (data.isValidVoterID ? '✅ Yes' : '⚠ Unclear');
      output += '\n<em style="color:var(--text-3)">Service: ' + escHtml(data.service) + '</em>';

      if (data.demo) {
        output += '\n<em style="color:var(--text-3)">[demo mode]</em>';
      }

      resultEl.innerHTML = output;
    }

    logEvent('voter_id_scan', { result: data.isValidVoterID ? 'valid' : 'invalid' });
  } catch (e) {
    resultEl.textContent = '⚠ Image processing failed. Please try again.';
  }
}

export async function doTranslate() {
  const text = document.getElementById('translate-input')?.value?.trim();
  const language = document.getElementById('translate-lang')?.value;
  const resultEl = document.getElementById('translate-result');
  const btn = document.getElementById('translate-btn');

  if (!resultEl || !btn) return;
  if (!text) { resultEl.textContent = 'Please enter text to translate.'; return; }

  btn.disabled = true; btn.textContent = '⏳ Translating…';
  resultEl.textContent = 'Translating with Google Cloud Translation API…';

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });
    const data = await res.json();

    if (data.error) {
      resultEl.textContent = '⚠️ ' + data.error;
    } else {
      resultEl.innerHTML = escHtml(data.translated) +
        '<br><br><em style="color:var(--text-3);font-size:0.75rem;">Service: ' + escHtml(data.service || 'translation-api') + '</em>';
    }

    logEvent('translation', { language, service: data.service });
  } catch (e) {
    resultEl.textContent = '⚠️ Translation failed. Please try again.';
  } finally {
    btn.disabled = false; btn.textContent = '🌐 Translate with Cloud API';
  }
}
