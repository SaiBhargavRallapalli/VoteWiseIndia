import { escHtml, trackFeatureUsed } from './utils.js';
import { logEvent } from './firebase.js';

let evmLoaded = false;
let evmEnabled = false;
let evmVoted   = false;
let evmCandidates = [];

export async function initEVM() {
  if (evmLoaded) return;
  try {
    const res  = await fetch('/api/evm/candidates');
    const data = await res.json();
    evmCandidates = data.candidates;
    evmLoaded = true;
    renderEVMCandidates();

    document.getElementById('evm-ballot-btn')?.addEventListener('click', evmEnableVoting);
    document.getElementById('evm-try-again-btn')?.addEventListener('click', evmReset);

    document.getElementById('evm-candidates-list')?.addEventListener('click', e => {
      const btn = e.target.closest('button.evm-vote-btn[data-cand-id]');
      if (btn) evmCastVote(parseInt(btn.dataset.candId, 10));
    });
  } catch (e) {
    const list = document.getElementById('evm-candidates-list');
    if (list) list.innerHTML = '<div class="error-state">Failed to load EVM candidates.</div>';
  }
}

function renderEVMCandidates() {
  const list = document.getElementById('evm-candidates-list');
  if (!list) return;
  list.innerHTML = evmCandidates.map(c => `
    <div class="evm-candidate-row" id="evm-row-${c.id}" role="listitem">
      <div class="evm-slot-num" aria-hidden="true">${c.slotNum}</div>
      <div class="evm-symbol" aria-hidden="true">${escHtml(c.symbol)}</div>
      <div class="evm-cand-info">
        <div class="evm-cand-name">${escHtml(c.name)}</div>
        <div class="evm-cand-party">${escHtml(c.party)}</div>
      </div>
      <button class="evm-vote-btn" id="evm-btn-${c.id}"
        data-cand-id="${c.id}"
        aria-label="Vote for ${escHtml(c.name)} of ${escHtml(c.party)}"
        disabled>
        ▮ VOTE
      </button>
      <div class="evm-led" id="evm-led-${c.id}" aria-hidden="true"></div>
    </div>
  `).join('');
}

function evmEnableVoting() {
  if (evmVoted) return;
  evmEnabled = true;

  const led    = document.getElementById('evm-ctrl-led');
  const status = document.getElementById('evm-ctrl-status');
  const btn    = document.getElementById('evm-ballot-btn');
  if (led)    { led.classList.add('active'); }
  if (status) { status.textContent = 'Voting enabled — press a candidate button to cast your vote'; }
  if (btn)    { btn.disabled = true; btn.textContent = '✓ ENABLED'; }

  evmCandidates.forEach(c => {
    const voteBtn = document.getElementById('evm-btn-' + c.id);
    if (voteBtn) voteBtn.disabled = false;
  });

  setEVMStep(2);
  logEvent('evm_ballot_enabled', {});
}

function evmCastVote(candidateId) {
  if (!evmEnabled || evmVoted) return;
  evmVoted = true;

  const candidate = evmCandidates.find(c => c.id === candidateId);
  if (!candidate) return;

  evmCandidates.forEach(c => {
    const btn = document.getElementById('evm-btn-' + c.id);
    if (btn) btn.disabled = true;
  });

  const led = document.getElementById('evm-led-' + candidateId);
  if (led) led.classList.add('voted');

  playEVMBeep();
  showVVPATSlip(candidate);
  setEVMStep(3);

  logEvent('evm_vote_cast', { candidate: candidate.name });
}

function playEVMBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) { /* audio not available */ }
}

function showVVPATSlip(candidate) {
  const idleEl  = document.getElementById('vvpat-idle');
  const slipEl  = document.getElementById('vvpat-slip');
  const infoEl  = document.getElementById('vvpat-info');
  const symEl   = document.getElementById('vvpat-symbol');
  const nameEl  = document.getElementById('vvpat-name');
  const partyEl = document.getElementById('vvpat-party');
  const numEl   = document.getElementById('vvpat-num');
  const secsEl  = document.getElementById('vvpat-secs');

  if (idleEl)  idleEl.style.display  = 'none';
  if (slipEl)  { slipEl.style.display = 'flex'; slipEl.classList.add('slide-in'); }
  if (symEl)   symEl.textContent   = candidate.symbol;
  if (nameEl)  nameEl.textContent  = candidate.name;
  if (partyEl) partyEl.textContent = candidate.party;
  if (numEl)   numEl.textContent   = 'Serial No. ' + candidate.slotNum;
  if (infoEl)  infoEl.textContent  = 'Verify: Is this the candidate you chose?';

  let secs = 7;
  if (secsEl) secsEl.textContent = secs;

  const timer = setInterval(() => {
    secs--;
    if (secsEl) secsEl.textContent = secs;
    if (secs <= 0) {
      clearInterval(timer);
      if (slipEl) slipEl.style.display = 'none';
      if (idleEl) { idleEl.style.display = 'flex'; idleEl.innerHTML = '<div style="color:var(--green);font-size:1.1rem;">✅ VVPAT slip verified and destroyed</div>'; }
      showEVMResult(candidate);
    }
  }, 1000);
}

function showEVMResult(candidate) {
  setEVMStep(4);
  const card    = document.getElementById('evm-result-card');
  const textEl  = document.getElementById('evm-result-text');
  const status  = document.getElementById('evm-ctrl-status');

  if (textEl) textEl.innerHTML = `
    Your vote for <strong style="color:var(--saffron)">${escHtml(candidate.name)}</strong>
    (${escHtml(candidate.party)}) has been recorded. 🗳️<br><br>
    The Booth Officer will now apply <strong>indelible ink</strong> to your left index finger.
  `;
  if (card) card.style.display = 'block';
  if (status) status.textContent = 'Vote cast successfully — indelible ink will be applied';

  trackFeatureUsed();
}

function evmReset() {
  evmEnabled = false;
  evmVoted   = false;

  const led    = document.getElementById('evm-ctrl-led');
  const status = document.getElementById('evm-ctrl-status');
  const btn    = document.getElementById('evm-ballot-btn');
  const card   = document.getElementById('evm-result-card');
  const idleEl = document.getElementById('vvpat-idle');
  const slipEl = document.getElementById('vvpat-slip');
  const infoEl = document.getElementById('vvpat-info');

  if (led)    led.classList.remove('active');
  if (status) status.textContent = 'Ready — Booth Officer must enable voting';
  if (btn)    { btn.disabled = false; btn.textContent = '▶ BALLOT'; }
  if (card)   card.style.display = 'none';
  if (idleEl) {
    idleEl.style.display = 'flex';
    idleEl.innerHTML = '<div style="font-size:1.5rem;margin-bottom:0.4rem;">📋</div><div>VVPAT slip appears here after you vote</div><div style="font-size:0.72rem;margin-top:0.4rem;opacity:0.7;">Visible for 7 seconds per ECI rules</div>';
  }
  if (slipEl) slipEl.style.display = 'none';
  if (infoEl) infoEl.textContent = 'Enable voting and select a candidate to see the VVPAT slip.';

  evmCandidates.forEach(c => {
    const voteBtn = document.getElementById('evm-btn-' + c.id);
    const cLed    = document.getElementById('evm-led-' + c.id);
    if (voteBtn) { voteBtn.disabled = true; }
    if (cLed)    cLed.classList.remove('voted');
  });

  setEVMStep(1);
}

function setEVMStep(n) {
  document.querySelectorAll('.evm-step').forEach(el => {
    const stepNum = parseInt(el.dataset.step);
    el.classList.toggle('active',    stepNum === n);
    el.classList.toggle('completed', stepNum < n);
  });
}
