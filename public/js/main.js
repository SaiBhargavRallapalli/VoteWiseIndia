import { initFirebase, handleAuth } from './firebase.js';
import { setupNavigation, loadHomeData, loadSteps, applyLang } from './ui.js';
import { updateReadinessWidget } from './utils.js';
import { setupChat } from './chat.js';
import { verifyVoterID, doAnalyze, doTextToSpeech, doTranslate } from './cloud.js';

window.addEventListener('load', () => {
  initFirebase();
  setupNavigation();
  setupChat();
  loadHomeData();
  loadSteps();
  updateReadinessWidget();

  document.getElementById('lang-select')?.addEventListener('change', e => applyLang(e.target.value));
  document.getElementById('auth-btn')?.addEventListener('click', handleAuth);
  document.getElementById('translate-btn')?.addEventListener('click', doTranslate);
  
  document.getElementById('verify-voter-id-btn')?.addEventListener('click', verifyVoterID);
  document.getElementById('analyze-btn')?.addEventListener('click', doAnalyze);
  document.getElementById('tts-btn')?.addEventListener('click', doTextToSpeech);
});
