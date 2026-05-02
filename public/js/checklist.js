import { escHtml, setReadinessState, trackFeatureUsed } from './utils.js';
import { logEvent } from './firebase.js';

let checklistLoaded = false;
const CHECKLIST_KEY = 'vw_checklist';

export function getChecklistState() {
  try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}'); } catch { return {}; }
}

export async function initChecklist() {
  if (checklistLoaded) return;
  try {
    const res  = await fetch('/api/checklist');
    const data = await res.json();
    checklistLoaded = true;
    renderChecklist(data.items);
  } catch (e) {
    const listEl = document.getElementById('checklist-items');
    if (listEl) listEl.innerHTML = '<div class="error-state">Failed to load checklist.</div>';
  }
}

function renderChecklist(items) {
  const state   = getChecklistState();
  const listEl  = document.getElementById('checklist-items');
  if (!listEl) return;

  listEl.innerHTML = items.map(item => `
    <label class="checklist-item ${state[item.id] ? 'done' : ''}" role="listitem" for="cl-${item.id}">
      <input type="checkbox" id="cl-${item.id}" ${state[item.id] ? 'checked' : ''}
        data-cl-id="${escHtml(item.id)}"
        aria-label="${escHtml(item.task)}" />
      <span class="cl-icon" aria-hidden="true">${item.icon}</span>
      <span class="cl-content">
        <span class="cl-task">${escHtml(item.task)}</span>
        <span class="cl-hint">${escHtml(item.hint)}</span>
      </span>
      <span class="cl-priority priority-${item.priority}" aria-label="Priority: ${item.priority}">${item.priority}</span>
    </label>
  `).join('');

  listEl.addEventListener('change', e => {
    const cb = e.target.closest('input[type="checkbox"][data-cl-id]');
    if (cb) toggleChecklistItem(cb.dataset.clId, cb.checked);
  });

  document.getElementById('cl-select-all')?.addEventListener('click', checklistSelectAll);
  document.getElementById('cl-clear-all')?.addEventListener('click', checklistClearAll);

  updateChecklistProgress();
  logEvent('page_view', { tab_name: 'checklist' });
}

function toggleChecklistItem(id, checked) {
  const state = getChecklistState();
  state[id] = checked;
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));

  const label = document.querySelector(`label[for="cl-${id}"]`);
  if (label) label.classList.toggle('done', checked);

  updateChecklistProgress();
  trackFeatureUsed();
}

export function updateChecklistProgress() {
  const state   = getChecklistState();
  const total   = 12;
  const done    = Object.values(state).filter(Boolean).length;
  const pct     = Math.round((done / total) * 100);

  const doneEl  = document.getElementById('cl-done');
  const barEl   = document.getElementById('cl-bar-fill');
  const pctBadge = document.getElementById('cl-pct-badge');
  const badgeIcon = document.getElementById('cl-badge-icon');
  const badgeText = document.getElementById('cl-badge-text');

  if (doneEl)   doneEl.textContent  = done;
  if (barEl)    barEl.style.width   = pct + '%';
  if (pctBadge) pctBadge.textContent = pct + '%';

  if (badgeIcon && badgeText) {
    if (done === total) {
      badgeIcon.textContent = '🏅';
      badgeText.innerHTML   = '<strong style="color:var(--gold)">🎉 Citizen Voter Badge Unlocked!</strong><br>You\'re fully prepared to vote. Go exercise your democratic right!';
    } else if (done >= 9) {
      badgeIcon.textContent = '🥈';
      badgeText.innerHTML   = `<strong style="color:var(--saffron)">Almost there!</strong><br>Complete ${total - done} more task${total - done > 1 ? 's' : ''} to unlock your badge.`;
    } else if (done >= 6) {
      badgeIcon.textContent = '🥉';
      badgeText.innerHTML   = `<strong>Good progress!</strong><br>Complete ${total - done} more tasks to unlock your badge.`;
    } else {
      badgeIcon.textContent = '🔒';
      badgeText.innerHTML   = `Complete all 12 tasks to unlock your <strong style="color:var(--gold)">Citizen Voter</strong> badge!`;
    }
  }

  setReadinessState({ checklistDone: done });
}

function checklistSelectAll() {
  const state = {};
  for (let i = 1; i <= 12; i++) state['c' + i] = true;
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
  document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(cb => {
    cb.checked = true;
    const label = cb.closest('label');
    if (label) label.classList.add('done');
  });
  updateChecklistProgress();
}

function checklistClearAll() {
  localStorage.removeItem(CHECKLIST_KEY);
  document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
    const label = cb.closest('label');
    if (label) label.classList.remove('done');
  });
  updateChecklistProgress();
}
