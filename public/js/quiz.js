import { escHtml, setReadinessState } from './utils.js';
import { logEvent } from './firebase.js';

let quizLoaded = false;
let questions = [];
let currentQ = 0;
let selectedAnswers = [];
const SESSION_ID = Math.random().toString(36).slice(2);

export async function initQuiz() {
  if (quizLoaded) {
    renderQuestion();
    return;
  }

  try {
    const res = await fetch('/api/quiz');
    const data = await res.json();
    questions = data.questions;
    selectedAnswers = new Array(questions.length).fill(-1);
    quizLoaded = true;
    renderQuestion();

  } catch (e) {
    console.error('Quiz load error:', e);
    const container = document.getElementById('quiz-container');
    if (container) container.innerHTML = '<div class="error-state">Failed to load quiz. Please refresh the page.</div>';
  }
}

function renderQuestion() {
  const q = questions[currentQ];
  const pct = Math.round((currentQ / questions.length) * 100);
  const container = document.getElementById('quiz-container');
  const sel = selectedAnswers[currentQ];

  if (!container) return;

  container.innerHTML = `
    <div class="quiz-progress">
      <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
      <span class="progress-text">${currentQ + 1} / ${questions.length}</span>
    </div>
    <div class="quiz-question" id="q-text">${escHtml(q.q)}</div>
    <div class="quiz-options" id="quiz-options" role="group" aria-labelledby="q-text">
      ${q.options.map((opt, i) => `
        <button class="quiz-option${sel === i ? ' selected' : sel !== -1 ? ' dimmed' : ''}"
          data-index="${i}"
          aria-label="Option ${i + 1}: ${escHtml(opt)}"
          aria-pressed="${sel === i}">
          ${String.fromCharCode(65 + i)}. ${escHtml(opt)}
        </button>
      `).join('')}
    </div>
    <div class="quiz-nav">
      <span style="font-family:var(--font-m);font-size:0.75rem;color:var(--text-3);">
        ${sel !== -1 ? '✓ Answer saved — click Next' : 'Select an answer'}
      </span>
      <button class="btn btn-primary" id="next-btn"
        ${sel === -1 ? 'disabled' : ''}
        aria-label="${currentQ === questions.length - 1 ? 'See results' : 'Next question'}">
        ${currentQ === questions.length - 1 ? 'See Results →' : 'Next →'}
      </button>
    </div>
  `;

  const optionsContainer = document.getElementById('quiz-options');
  if (optionsContainer) {
    optionsContainer.addEventListener('click', handleOptionClick);
  }
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (selectedAnswers[currentQ] !== -1) nextQuestion();
    });
  }
}

function handleOptionClick(e) {
  const button = e.target.closest('.quiz-option');
  if (!button) return;

  const index = parseInt(button.dataset.index, 10);
  if (isNaN(index)) return;

  selectAnswer(index);
}

function selectAnswer(idx) {
  selectedAnswers[currentQ] = idx;
  renderQuestion();
}

function nextQuestion() {
  if (selectedAnswers[currentQ] === -1) return;
  currentQ++;
  if (currentQ >= questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

async function showResults() {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  container.innerHTML = '<div class="loading-state">Calculating your results…</div>';

  try {
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: selectedAnswers, sessionId: SESSION_ID }),
    });
    const data = await res.json();

    const score = data.score;
    const total = data.total;
    const pct = data.percentage;
    const badge = pct >= 80 ? ['🏆 Election Expert!', '#FFD700', 'rgba(255,215,0,0.15)']
      : pct >= 60 ? ['👍 Good Knowledge!', '#138808', 'rgba(19,136,8,0.15)']
        : ['📚 Keep Learning!', '#FF6B00', 'rgba(255,107,0,0.15)'];

    container.innerHTML = `
      <div class="quiz-result">
        <div class="result-score">${score}/${total}</div>
        <div class="result-label">You scored ${pct}%</div>
        <div class="result-badge" style="background:${badge[2]};color:${badge[1]};border:1px solid ${badge[1]};">${badge[0]}</div>
        <div class="quiz-review">
          ${data.results.map((r, i) => `
            <div class="review-item ${r.isCorrect ? 'review-correct' : 'review-wrong'}">
              <div class="review-q">${i + 1}. ${escHtml(r.question)}</div>
              <div class="review-a">
                ${r.isCorrect ? '✅ Correct' : '❌ Wrong'} —
                Your answer: <strong>${escHtml(questions[i].options[r.yourAnswer])}</strong>
                ${!r.isCorrect ? ` · Correct: <strong>${escHtml(questions[i].options[r.correct])}</strong>` : ''}
              </div>
              <div class="review-explain">${escHtml(r.explain)}</div>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary" id="retake-btn" style="margin-top:1.5rem;" aria-label="Retake quiz">🔄 Retake Quiz</button>
      </div>
    `;

    logEvent('quiz_complete', { score: pct });
    setReadinessState({ quizScore: score, quizTotal: total });
    document.getElementById('retake-btn')?.addEventListener('click', retakeQuiz);
  } catch (e) {
    container.innerHTML = `
      <div class="quiz-result">
        <div class="result-label">Quiz complete!</div>
        <button class="btn btn-primary" id="retake-btn" style="margin-top:1rem;">🔄 Retake Quiz</button>
      </div>
    `;
    document.getElementById('retake-btn')?.addEventListener('click', retakeQuiz);
  }
}

function retakeQuiz() {
  currentQ = 0;
  selectedAnswers = new Array(questions.length).fill(-1);
  renderQuestion();
}
