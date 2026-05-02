export function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function mdToHtml(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^[•-] (.+)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br>');
}

const READINESS_KEY = 'vw_readiness';

export function getReadinessState() {
  try { return JSON.parse(localStorage.getItem(READINESS_KEY) || '{}'); } catch { return {}; }
}

export function setReadinessState(patch) {
  const state = { ...getReadinessState(), ...patch };
  localStorage.setItem(READINESS_KEY, JSON.stringify(state));
  updateReadinessWidget();
}

export function updateReadinessWidget() {
  const state = getReadinessState();
  const checklistDone = parseInt(state.checklistDone || 0);
  const quizScore     = parseInt(state.quizScore     || 0);
  const quizTotal     = parseInt(state.quizTotal     || 0);
  const featureCount  = parseInt(state.featuresUsed  || 0);

  const quizPts     = quizTotal > 0 ? Math.round((quizScore / quizTotal) * 40) : 0;
  const checkPts    = Math.round((checklistDone / 12) * 40);
  const featurePts  = Math.min(featureCount, 3) * Math.round(20 / 3);
  const total       = Math.min(100, quizPts + checkPts + featurePts);

  const fillEl  = document.getElementById('readiness-fill');
  const pctEl   = document.getElementById('readiness-pct');
  const meterEl = document.querySelector('.readiness-meter');
  if (fillEl)  { fillEl.style.width = total + '%'; }
  if (pctEl)   { pctEl.textContent = total + '%'; }
  if (meterEl) { meterEl.setAttribute('aria-valuenow', total); }

  const rdQuiz = document.getElementById('rd-quiz');
  const rdCl   = document.getElementById('rd-checklist');
  const rdFeat = document.getElementById('rd-features');

  if (rdQuiz) rdQuiz.innerHTML = `<span class="rd-icon">🎯</span> Quiz: ${quizTotal > 0 ? quizScore + '/' + quizTotal + ' correct' : 'Not taken'}`;
  if (rdCl)   rdCl.innerHTML   = `<span class="rd-icon">✅</span> Checklist: ${checklistDone} / 12 tasks`;
  if (rdFeat) rdFeat.innerHTML = `<span class="rd-icon">🔧</span> Features tried: ${Math.min(featureCount, 3)} / 3`;
}

export function trackFeatureUsed() {
  const state = getReadinessState();
  const current = parseInt(state.featuresUsed || 0);
  if (current < 3) setReadinessState({ featuresUsed: current + 1 });
}

export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 })
  : null;

export function observeReveals() {
  if (prefersReducedMotion || !revealObserver) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }
  document.querySelectorAll('.reveal:not(.in)').forEach(el => revealObserver.observe(el));
}

export function animateCountUps() {
  if (prefersReducedMotion) return;
  document.querySelectorAll('.fact-val[data-count]').forEach(el => {
    const raw = el.dataset.count;
    const match = raw.match(/^([\d,.]+)(.*)$/);
    if (!match) return;
    const target = parseFloat(match[1].replace(/,/g, ''));
    if (!isFinite(target) || target === 0) return;
    const suffix = match[2];
    const hasDecimal = match[1].includes('.');
    const decimals = hasDecimal ? (match[1].split('.')[1] || '').length : 0;
    const duration = 1200;
    const start = performance.now();
    el.textContent = '0' + suffix;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = raw;
    }
    requestAnimationFrame(tick);
  });
}

export function attachStepHoverTracking() {
  if (prefersReducedMotion) return;
  document.querySelectorAll('.step-card').forEach(card => {
    if (card.dataset.hoverBound) return;
    card.dataset.hoverBound = '1';
    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
    });
  });
}
