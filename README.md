# VoteWise India 🗳️

> **AI-powered Indian election education assistant** — Understand how to vote, register, and participate in India's democracy.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_API-blue)](https://ai.google.dev)
[![Cloud Run](https://img.shields.io/badge/Google-Cloud_Run-blue)](https://cloud.google.com/run)
[![PromptWars](https://img.shields.io/badge/PromptWars-Virtual_2026-orange)](https://promptwars.in)

---

## Chosen Vertical

**Election Process Education** — VoteWise India helps Indian citizens understand the complete election process: voter registration, how to vote on election day, types of elections, important dates, and their democratic rights — all through an interactive AI assistant.

---

## What It Does

VoteWise India is a bilingual (English + Hindi) election education app for India:

- 🤖 **AI Assistant** — Ask anything about Indian elections in English or Hindi, powered by Google Gemini
- 🗳️ **How to Vote** — 7-step interactive guide from checking registration to casting your vote
- 📋 **Voter Registration** — 6-step guide with Form 6, document requirements, and official links
- 🎯 **Election Quiz** — 10-question quiz with explanations, scores saved to Firestore leaderboard
- 📍 **ECI Map** — Google Maps showing Election Commission of India HQ with official links
- 📅 **Election Dates** — Upcoming elections with Google Calendar integration
- 🌐 **Translate** — Translate election content to 8 Indian languages via Gemini
- 📢 **Updates** — Latest ECI announcements and policy updates

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│            Browser (Single-Page App)                 │
│  index.html — Vanilla JS, bilingual, accessible      │
└────────────────────┬────────────────────────────────┘
                     │ HTTP REST
┌────────────────────▼────────────────────────────────┐
│           Express.js Backend (Node 18)               │
│  helmet · compression · express-rate-limit           │
│  In-memory cache (25s TTL) · JSDoc throughout        │
│  /api/health  /api/config  /api/election             │
│  /api/steps   /api/quiz    /api/quiz/submit          │
│  /api/dates   /api/chat    /api/translate            │
│  /api/leaderboard  /api/announcements               │
└──────────┬───────────────────────┬──────────────────┘
           │                       │
┌──────────▼──────────┐  ┌────────▼────────────────┐
│  Google Gemini API   │  │  Firebase Firestore      │
│  (AI chat + translate│  │  (Quiz score persistence │
│   bilingual support) │  │   and leaderboard)       │
└─────────────────────┘  └─────────────────────────┘
```

---

## Google Services Used

| Service | Integration Type | Usage |
|---|---|---|
| **Gemini 2.0 Flash** | AI chat (server-side proxy) | Bilingual election Q&A with full context |
| **Gemini (Translation)** | API call | Translate content to 8 Indian languages |
| **Firebase Firestore** | Admin SDK + client SDK | Quiz score persistence and leaderboard |
| **Firebase Authentication** | Google Sign-In | User identity via `/api/config` |
| **Google Analytics (GA4)** | gtag.js | Tab views, chat messages, quiz events |
| **Google Maps Embed** | iframe | ECI Headquarters, New Delhi |
| **Google Calendar** | Deep-link URLs | Add election dates to personal calendar |
| **Google Cloud Run** | Deployment target | Serverless containerised hosting |
| **Google Fonts** | CDN | Playfair Display + DM Sans + DM Mono |
| **Google Identity Toolkit** | Firebase Auth | OAuth 2.0 Sign in with Google |

**10 Google Services integrated.**

---

## Project Structure

```
VoteWiseIndia/
├── server.js           # Express backend — full JSDoc, modular helpers
├── server.test.js      # Jest + Supertest — 66 tests
├── public/
│   └── index.html      # SPA frontend — bilingual, accessible, saffron theme
├── Dockerfile          # Cloud Run deployment
├── package.json
├── .env.example
└── .gitignore
```

---

## How to Run Locally

```bash
git clone https://github.com/SaiBhargavRallapalli/VoteWiseIndia.git
cd VoteWiseIndia
npm install
cp .env.example .env
# Add your GEMINI_API_KEY to .env
npm start
# → http://localhost:8080
npm test
```

---

## Deploy to Google Cloud Run

```bash
gcloud config set project promptwars-493418
gcloud services enable run.googleapis.com artifactregistry.googleapis.com \
  cloudbuild.googleapis.com firestore.googleapis.com \
  identitytoolkit.googleapis.com firebase.googleapis.com

gcloud run deploy votewise-india \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY,FIREBASE_API_KEY=YOUR_KEY,...
```

---

## Assumptions Made

1. Election data reflects the state as of early 2026. Real deployments would use ECI's live API.
2. The app is politically neutral — it educates about the process, never about parties or candidates.
3. Quiz scores use anonymous session IDs — no PII is stored.
4. Translation is powered by Gemini rather than Cloud Translation API for flexibility with context.
5. The app targets first-time voters and rural citizens — hence simple language and bilingual support.

---

## Accessibility

- Skip-to-content link for keyboard users
- All interactive elements have `aria-label` attributes
- `aria-live` regions for dynamic content (chat, quiz, translations)
- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`)
- WCAG 2.1 AA compliant contrast ratios
- Bilingual interface (English + Hindi)
- Mobile-responsive layout

---

*Built for PromptWars Virtual 2026 — Election Process Education vertical.*
