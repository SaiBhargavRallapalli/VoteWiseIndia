const { app, ELECTION_DATA } = require('./server');

console.log("Total questions: " + ELECTION_DATA.quizQuestions.length);

const answers = ELECTION_DATA.quizQuestions.map(q => q.answer);

const results = ELECTION_DATA.quizQuestions.map((q, i) => ({
  id: q.id,
  question: q.q,
  yourAnswer: answers[i],
  correct: q.answer,
  isCorrect: answers[i] === q.answer,
  explain: q.explain,
}));

console.log("Score: " + results.filter(r => r.isCorrect).length);
