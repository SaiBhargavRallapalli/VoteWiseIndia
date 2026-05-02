import { escHtml, observeReveals, animateCountUps, attachStepHoverTracking } from './utils.js';
import { initQuiz } from './quiz.js';
import { initEVM } from './evm.js';
import { initChecklist } from './checklist.js';
import { logEvent } from './firebase.js';

export let currentLang = 'en';

let parliamentLoaded = false;
let statesLoaded = false;
let presidentLoaded = false;
let datesLoaded = false;
let annLoaded = false;
let stepsLoaded = false;
let allStates = [];

export function setupNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.panel');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.panel;
      navBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
      document.getElementById('panel-' + target).classList.add('active');

      if (target === 'quiz') initQuiz();
      if (target === 'parliament' && !parliamentLoaded) loadParliament();
      if (target === 'states' && !statesLoaded) loadStates();
      if (target === 'president' && !presidentLoaded) loadPresident();
      if (target === 'dates' && !datesLoaded) loadDates();
      if (target === 'updates' && !annLoaded) loadAnnouncements();
      if (target === 'how-to-vote' && !stepsLoaded) loadSteps();
      if (target === 'register' && !stepsLoaded) loadSteps();
      if (target === 'evm') initEVM();
      if (target === 'checklist') initChecklist();

      logEvent('tab_view', { tab_name: target });
    });
  });
}

export async function loadHomeData() {
  try {
    const res = await fetch('/api/election');
    const data = await res.json();

    const factsGrid = document.getElementById('facts-grid');
    if (factsGrid) {
      factsGrid.innerHTML = data.keyFacts.map((f, i) => `
        <div class="fact-card reveal" role="listitem" style="transition-delay:${i * 70}ms">
          <div class="fact-val" data-count="${escHtml(f.value)}">${escHtml(f.value)}</div>
          <div class="fact-lbl">${f.icon} ${escHtml(f.label)}</div>
        </div>
      `).join('');
    }

    const typesEl = document.getElementById('election-types');
    if (typesEl) {
      typesEl.innerHTML = data.electionTypes.map((t, i) => `
        <div class="type-card reveal" role="listitem" style="transition-delay:${i * 60}ms">
          <div class="type-name">${escHtml(t.name)}</div>
          <div class="type-desc">${escHtml(t.desc)}</div>
          <div class="type-meta">Frequency: ${escHtml(t.frequency)} · Next: ${escHtml(t.nextDue)}</div>
        </div>
      `).join('');
    }

    observeReveals();
    animateCountUps();
  } catch (e) { console.error('loadHomeData:', e); }
}

export async function loadSteps() {
  if (stepsLoaded) return;
  try {
    const res = await fetch('/api/steps');
    const data = await res.json();
    stepsLoaded = true;

    const vSteps = document.getElementById('voting-steps');
    if (vSteps) {
      vSteps.innerHTML = data.votingSteps.map(s => `
        <article class="step-card reveal" role="listitem" aria-label="Step ${s.step}: ${escHtml(s.title)}" style="transition-delay:${s.step * 50}ms">
          <div>
            <div class="step-num" aria-hidden="true">${s.step}</div>
            <div class="step-icon" aria-hidden="true" style="margin-top:0.4rem;">${s.icon}</div>
          </div>
          <div>
            <div class="step-title">${escHtml(s.title)}</div>
            <div class="step-desc">${escHtml(s.description)}</div>
          </div>
        </article>
      `).join('');
    }

    const rSteps = document.getElementById('reg-steps');
    if (rSteps) {
      rSteps.innerHTML = data.registrationSteps.map(s => `
        <article class="step-card reveal" role="listitem" aria-label="Step ${s.step}: ${escHtml(s.title)}" style="transition-delay:${s.step * 50}ms">
          <div>
            <div class="step-num" aria-hidden="true">${s.step}</div>
          </div>
          <div>
            <div class="step-title">${escHtml(s.title)}</div>
            <div class="step-desc">${escHtml(s.desc)}</div>
          </div>
        </article>
      `).join('');
    }
    observeReveals();
    attachStepHoverTracking();
  } catch (e) { console.error('loadSteps:', e); }
}

export async function loadDates() {
  if (datesLoaded) return;
  datesLoaded = true;
  const list = document.getElementById('dates-list');
  try {
    const res = await fetch('/api/dates');
    const data = await res.json();
    if (list) {
      list.innerHTML = data.dates.map(d => `
        <div class="date-card" role="listitem">
          <div class="date-dot ${escHtml(d.type)}" aria-hidden="true"></div>
          <div class="date-info">
            <div class="date-event">${escHtml(d.event)}</div>
            <div class="date-when">📅 ${escHtml(d.date)}</div>
          </div>
          <a class="cal-btn" href="${escHtml(d.calUrl)}" target="_blank" rel="noopener noreferrer"
             aria-label="Add ${escHtml(d.event)} to Google Calendar">
            📆 <span>Add</span>
          </a>
        </div>
      `).join('');
    }
  } catch (e) { if (list) list.innerHTML = '<div class="error-state">Failed to load dates.</div>'; }
}

export async function loadAnnouncements() {
  if (annLoaded) return;
  annLoaded = true;
  const list = document.getElementById('ann-list');
  try {
    const res = await fetch('/api/announcements');
    const data = await res.json();
    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️' };
    if (list) {
      list.innerHTML = data.announcements.map(a => `
        <div class="ann-item ${escHtml(a.type)}" role="listitem">
          <div class="ann-icon" aria-hidden="true">${icons[a.type] || 'ℹ️'}</div>
          <div>
            <div class="ann-text">${escHtml(a.text)}</div>
            <div class="ann-time">${escHtml(a.time)}</div>
          </div>
        </div>
      `).join('');
    }
  } catch (e) { if (list) list.innerHTML = '<div class="error-state">Failed to load.</div>'; }
}

export async function loadParliament() {
  if (parliamentLoaded) return;
  parliamentLoaded = true;
  const el = document.getElementById('parliament-content');
  try {
    const res = await fetch('/api/parliament');
    const data = await res.json();
    const ls = data.lokSabha;
    const rs = data.rajyaSabha;

    if (el) {
      el.innerHTML = `
        <div class="parl-grid">
          <div class="parl-card">
            <h3>🏛️ Lok Sabha — ${ls.totalSeats} Seats</h3>
            <div class="parl-stat"><span class="label">Full Name</span><span class="value">${escHtml(ls.fullName)}</span></div>
            <div class="parl-stat"><span class="label">Term</span><span class="value">${escHtml(ls.term)}</span></div>
            <div class="parl-stat"><span class="label">Current</span><span class="value">${escHtml(ls.currentTerm)}</span></div>
            <div class="parl-stat"><span class="label">Elected By</span><span class="value">${escHtml(ls.electedBy)}</span></div>
            <div class="parl-stat"><span class="label">Eligibility</span><span class="value">${escHtml(ls.eligibility)}</span></div>
            <div class="parl-stat"><span class="label">Speaker</span><span class="value">${escHtml(ls.speaker)}</span></div>
            <div class="parl-stat"><span class="label">Reserved Seats</span><span class="value">${escHtml(ls.specialSeats)}</span></div>
            <div style="margin-top:0.75rem;">
              <div style="font-size:0.75rem;color:var(--text-3);margin-bottom:0.5rem;font-family:var(--font-m);">KEY FUNCTIONS</div>
              <ul class="pres-list">${ls.keyFunctions.map(f => '<li>' + escHtml(f) + '</li>').join('')}</ul>
            </div>
          </div>
          <div class="parl-card">
            <h3>🏛️ Rajya Sabha — ${rs.totalSeats} Seats</h3>
            <div class="parl-stat"><span class="label">Full Name</span><span class="value">${escHtml(rs.fullName)}</span></div>
            <div class="parl-stat"><span class="label">Term</span><span class="value">${escHtml(rs.term)}</span></div>
            <div class="parl-stat"><span class="label">Elected Seats</span><span class="value">${escHtml(String(rs.electedSeats))}</span></div>
            <div class="parl-stat"><span class="label">Nominated</span><span class="value">${escHtml(String(rs.nominatedSeats))} (expertise in art/science/literature)</span></div>
            <div class="parl-stat"><span class="label">Elected By</span><span class="value">${escHtml(rs.electedBy)}</span></div>
            <div class="parl-stat"><span class="label">Eligibility</span><span class="value">${escHtml(rs.eligibility)}</span></div>
            <div class="parl-stat"><span class="label">Chairman</span><span class="value">${escHtml(rs.chairman)}</span></div>
            <div class="parl-stat"><span class="label">Permanent?</span><span class="value">Yes — never dissolved</span></div>
            <div style="margin-top:0.75rem;">
              <div style="font-size:0.75rem;color:var(--text-3);margin-bottom:0.5rem;font-family:var(--font-m);">TOP STATE ALLOCATIONS</div>
              ${rs.stateSeats.slice(0, 6).map(s => `<div class="parl-stat"><span class="label">${escHtml(s.state)}</span><span class="value">${escHtml(String(s.seats))} seats</span></div>`).join('')}
            </div>
          </div>
        </div>
      `;
    }
  } catch (e) { if (el) el.innerHTML = '<div class="error-state">Failed to load parliament data.</div>'; }
}

export async function loadStates() {
  if (statesLoaded) return;
  statesLoaded = true;
  const el = document.getElementById('states-content');
  try {
    const res = await fetch('/api/states');
    const data = await res.json();
    allStates = data.states;
    renderStates(allStates);
  } catch (e) { if (el) el.innerHTML = '<div class="error-state">Failed to load states data.</div>'; }
}

function renderStates(states) {
  const el = document.getElementById('states-content');
  if (!el) return;
  el.innerHTML = `
    <table class="states-table" role="table" aria-label="States and UTs electoral data">
      <thead>
        <tr>
          <th>Name</th><th>Capital</th><th>Type</th>
          <th>Vidhan Sabha</th><th>Lok Sabha</th><th>Rajya Sabha</th><th>Region</th>
        </tr>
      </thead>
      <tbody>
        ${states.map(s => `
          <tr>
            <td>${escHtml(s.name)}</td>
            <td style="color:var(--text-2)">${escHtml(s.capital)}</td>
            <td><span class="state-badge ${s.type === 'state' ? 'badge-state' : 'badge-ut'}">${escHtml(s.type.toUpperCase())}</span></td>
            <td style="font-family:var(--font-m);font-size:0.78rem;color:var(--saffron)">${escHtml(String(s.vidhanSabhaSeats))}</td>
            <td style="font-family:var(--font-m);font-size:0.78rem;color:var(--green)">${escHtml(String(s.lokSabhaSeats))}</td>
            <td style="font-family:var(--font-m);font-size:0.78rem;color:var(--gold)">${escHtml(String(s.rajyaSabhaSeats))}</td>
            <td style="color:var(--text-3);font-size:0.75rem">${escHtml(s.region)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div style="margin-top:0.75rem;font-family:var(--font-m);font-size:0.72rem;color:var(--text-3);">
      Showing ${states.length} of 36 states/UTs
    </div>
  `;
}

export function filterStates(btn) {
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  if (f === 'all') { renderStates(allStates); return; }
  if (f === 'state') { renderStates(allStates.filter(s => s.type === 'state')); return; }
  if (f === 'ut') { renderStates(allStates.filter(s => s.type === 'ut')); return; }
  renderStates(allStates.filter(s => s.region === f));
}

export async function loadPresident() {
  if (presidentLoaded) return;
  presidentLoaded = true;
  const el = document.getElementById('president-content');
  try {
    const res = await fetch('/api/president');
    const p = await res.json();

    if (el) {
      el.innerHTML = `
        <div class="pres-grid">
          <div class="pres-card">
            <h3>🇮🇳 ${escHtml(p.title)}</h3>
            <div class="parl-stat"><span class="label">Current</span><span class="value">${escHtml(p.currentPresident)}</span></div>
            <div class="parl-stat"><span class="label">Term</span><span class="value">${escHtml(p.term)}</span></div>
            <div class="parl-stat"><span class="label">Elected By</span><span class="value">${escHtml(p.electedBy)}</span></div>
            <div class="parl-stat"><span class="label">Voting System</span><span class="value">${escHtml(p.votingSystem)}</span></div>
            <div style="margin-top:0.75rem;">
              <div style="font-size:0.75rem;color:var(--text-3);margin-bottom:0.5rem;font-family:var(--font-m);">ELIGIBILITY</div>
              <ul class="pres-list">${p.eligibility.map(e => '<li>' + escHtml(e) + '</li>').join('')}</ul>
            </div>
          </div>
          <div class="pres-card">
            <h3>🏛️ Election Process</h3>
            ${p.process.map(s => `<div class="parl-stat"><span class="label">Step ${s.step}: ${escHtml(s.title)}</span><span class="value" style="text-align:right;max-width:200px">${escHtml(s.desc)}</span></div>`).join('')}
          </div>
        </div>
        <div class="pres-grid">
          <div class="pres-card">
            <h3>⚡ Presidential Powers</h3>
            <ul class="pres-list">${p.powers.map(pw => '<li>' + escHtml(pw) + '</li>').join('')}</ul>
          </div>
          <div class="pres-card">
            <h3>🎖️ Vice President</h3>
            <div class="parl-stat"><span class="label">Current</span><span class="value">${escHtml(p.vicePresident.current)}</span></div>
            <div class="parl-stat"><span class="label">Term</span><span class="value">${escHtml(p.vicePresident.term)}</span></div>
            <div class="parl-stat"><span class="label">Role</span><span class="value">${escHtml(p.vicePresident.role)}</span></div>
            <div class="parl-stat"><span class="label">Elected By</span><span class="value">${escHtml(p.vicePresident.electedBy)}</span></div>
          </div>
        </div>
      `;
    }
  } catch (e) { if (el) el.innerHTML = '<div class="error-state">Failed to load president data.</div>'; }
}

const I18N = {
  en: {
    nav: ['🏠 Home', '🗳️ How to Vote', '📋 Registration', '🎯 Quiz', '📍 ECI Map', '🤖 AI Assistant', '📅 Dates', '🏛️ Parliament', '🗺️ States & UTs', '🇮🇳 President', '🌐 Translate', '📢 Updates', '⚡ EVM Demo', '✅ Checklist'],
    heroTag: "India's Democracy Guide",
    heroH1: 'Your Vote,<br><span>Your Voice</span>',
    heroSub: 'Understand Indian elections — from Lok Sabha to Panchayat — with AI-powered guidance. Know your rights, register to vote, and participate in democracy.',
    signIn: 'Sign in with Google',
    chatPlaceholder: 'Ask about elections… / चुनाव के बारे में पूछें…',
    secTitle_home: 'Types of Elections in India',
    secTitle_vote: 'How to Vote — Step by Step',
    secTitle_reg: 'How to Register as a Voter',
    secTitle_quiz: 'Test Your Election Knowledge',
    secTitle_map: 'Election Commission of India — HQ',
    secTitle_chat: '',
    secTitle_dates: 'Important Election Dates',
    secTitle_parl: 'Parliament of India',
    secTitle_states: 'States & Union Territories',
    secTitle_pres: 'President & Vice President of India',
    secTitle_translate: 'Translate Election Content',
    secTitle_updates: 'ECI Updates & Announcements',
  },
  hi: {
    nav: ['🏠 होम', '🗳️ मतदान कैसे करें', '📋 पंजीकरण', '🎯 क्विज़', '📍 ECI मानचित्र', '🤖 AI सहायक', '📅 तारीखें', '🏛️ संसद', '🗺️ राज्य और UTs', '🇮🇳 राष्ट्रपति', '🌐 अनुवाद', '📢 अपडेट', '⚡ EVM डेमो', '✅ चेकलिस्ट'],
    heroTag: 'भारत का लोकतंत्र गाइड',
    heroH1: 'आपका वोट,<br><span>आपकी आवाज़</span>',
    heroSub: 'लोक सभा से पंचायत तक भारतीय चुनावों को AI-संचालित मार्गदर्शन के साथ समझें। अपने अधिकार जानें, मतदाता पंजीकरण करें और लोकतंत्र में भाग लें।',
    signIn: 'Google से साइन इन करें',
    chatPlaceholder: 'चुनाव के बारे में पूछें…',
    secTitle_home: 'भारत में चुनावों के प्रकार',
    secTitle_vote: 'मतदान कैसे करें — चरण दर चरण',
    secTitle_reg: 'मतदाता के रूप में पंजीकरण कैसे करें',
    secTitle_quiz: 'अपने चुनाव ज्ञान का परीक्षण करें',
    secTitle_map: 'भारत निर्वाचन आयोग — मुख्यालय',
    secTitle_chat: '',
    secTitle_dates: 'महत्वपूर्ण चुनाव तिथियाँ',
    secTitle_parl: 'भारत की संसद',
    secTitle_states: 'राज्य और केंद्र शासित प्रदेश',
    secTitle_pres: 'भारत के राष्ट्रपति एवं उपराष्ट्रपति',
    secTitle_translate: 'चुनाव सामग्री का अनुवाद',
    secTitle_updates: 'ECI अपडेट और घोषणाएँ',
  },
};

export function applyLang(lang) {
  currentLang = lang;
  const t = I18N[lang];
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';

  document.querySelectorAll('.nav-btn').forEach((btn, i) => {
    if (t.nav[i]) btn.textContent = t.nav[i];
  });

  const heroTag = document.querySelector('.hero-tag');
  if (heroTag) heroTag.textContent = t.heroTag;
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) heroH1.innerHTML = t.heroH1;
  const heroSub = document.querySelector('.hero-sub');
  if (heroSub) heroSub.textContent = t.heroSub;

  const authBtn = document.getElementById('auth-btn');
  // Avoid importing auth if possible to prevent circular dependencies, just update text
  if (authBtn && !authBtn.textContent.includes('✓')) authBtn.textContent = t.signIn;

  const chatIn = document.getElementById('chat-input');
  if (chatIn) chatIn.placeholder = t.chatPlaceholder;

  const titleMap = {
    'panel-home': t.secTitle_home,
    'panel-how-to-vote': t.secTitle_vote,
    'panel-register': t.secTitle_reg,
    'panel-quiz': t.secTitle_quiz,
    'panel-map': t.secTitle_map,
    'panel-dates': t.secTitle_dates,
    'panel-parliament': t.secTitle_parl,
    'panel-states': t.secTitle_states,
    'panel-president': t.secTitle_pres,
    'panel-translate': t.secTitle_translate,
    'panel-updates': t.secTitle_updates,
  };
  Object.entries(titleMap).forEach(([panelId, title]) => {
    if (!title) return;
    const panel = document.getElementById(panelId);
    if (!panel) return;
    const h2 = panel.querySelector('h2.section-title');
    if (h2) h2.textContent = title;
  });
}
