const fs = require('fs');
const content = fs.readFileSync('./public/app.js', 'utf8');

const sections = content.split('/* ── ');
for (let section of sections) {
  if (!section.trim()) continue;
  const match = section.match(/^(.*?) ──.*?\*\//);
  if (match) {
    console.log(match[1]);
  }
}
