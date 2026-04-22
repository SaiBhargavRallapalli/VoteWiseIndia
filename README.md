# VoteWise India 🗳️

> **AI-powered Indian election education assistant** — Understand how to vote, register, and participate in India's democracy.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_API-blue)](https://ai.google.dev)
[![Cloud Run](https://img.shields.io/badge/Google-Cloud_Run-blue)](https://cloud.google.com/run)
[![Tests](https://img.shields.io/badge/tests-66_passing-brightgreen)](./server.test.js)
[![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)](./server.test.js)
[![PromptWars](https://img.shields.io/badge/PromptWars-Virtual_2026-orange)](https://promptwars.in)

**🌐 Live demo:** [votewise-india-901504497544.asia-south1.run.app](https://votewise-india-901504497544.asia-south1.run.app/) &nbsp;•&nbsp; **🎥 Walkthrough:** _add Loom / YouTube link_

---

## Chosen Vertical

**Election Process Education** — VoteWise India helps Indian citizens understand the complete election process: voter registration, how to vote on election day, types of elections, important dates, and their democratic rights — all through an interactive AI assistant.

---

## Approach & Logic

India has 96.8 crore eligible voters, many of them first-time voters, rural citizens, and non-English speakers. Existing ECI resources are exhaustive but scattered across dozens of PDFs and portals. VoteWise India consolidates that knowledge into a single, conversational, bilingual web app that meets citizens where they are.

**Design philosophy:**
1. **Single page, zero friction** — No signup required to learn. Optional Google Sign-In only for quiz leaderboard.
2. **Bilingual by default** — Every interaction works in English and हिंदी; translation to 8 regional languages via Gemini.
3. **Authoritative, not political** — Content is sourced from ECI / official references only. Never names parties or candidates.
4. **Accessible** — WCAG 2.1 AA contrast, full keyboard navigation, `prefers-reduced-motion` respected, ARIA live regions, skip links.
5. **Server-side secrets** — Gemini & Firestore credentials never leave the backend.

---

## What It Does

- 🤖 **AI Assistant** — Ask anything about Indian elections in English or Hindi, powered by Google Gemini (flash-latest)
- 🗳️ **How to Vote** — 7-step interactive guide from checking registration to casting your vote
- 📋 **Voter Registration** — 6-step guide with Form 6, document requirements, and official links
- 🎯 **Election Quiz** — 10-question quiz with explanations; scores saved to Firestore leaderboard
- 📍 **ECI Map** — Google Maps embed showing Election Commission of India HQ with official links
- 📅 **Election Dates** — Upcoming elections with Google Calendar deep-link integration
- 🏛️ **Parliament & States** — Lok Sabha, Rajya Sabha, 28 states + 8 UTs electoral data
- 🇮🇳 **President & VP** — Election process, powers, eligibility
- 🌐 **Translate** — Any election text → 8 Indian languages via Gemini
- 📢 **Updates** — Latest ECI announcements and policy updates

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│            Browser (Single-Page App)                 │
│  index.html — Vanilla JS, bilingual, accessible      │
│  Rotating Ashoka Chakra · scroll-reveal · count-up   │
│  prefers-reduced-motion aware                        │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS REST
┌────────────────────▼────────────────────────────────┐
│           Express.js Backend (Node 18)               │
│  helmet · compression · express-rate-limit · CORS    │
│  In-memory cache (25 s TTL) · full JSDoc             │
│  12 routes: /api/{health, config, election, steps,   │
│   quiz, quiz/submit, dates, chat, translate,         │
│   leaderboard, announcements, parliament, states,    │
│   president}                                         │
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
| **Gemini Flash (latest)** | AI chat (server-side proxy) | Bilingual election Q&A with full context |
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

## Evaluation Mapping

How this submission addresses each evaluation axis:

| Axis | Where to see it |
|---|---|
| **Code Quality** | `server.js` is fully JSDoc-annotated with modular helpers and no inline secrets. Consistent ESM-style patterns, structured routes, clear separation of cache / validation / handler layers. |
| **Security** | `helmet` (CSP-ready headers), `cors` with origin allow-list env var, `express-rate-limit` on mutative routes, `.env` gitignored, server-side secret proxying (Gemini key never reaches browser), HTML escaping (`escHtml`) on every rendered string to prevent XSS, OAuth 2.0 via Firebase. |
| **Efficiency** | 25 s in-memory response cache, gzip via `compression`, static asset caching, lazy panel rendering (quiz/parliament/states/etc. fetch only when opened), debounced animations, single-page architecture avoids redundant network. |
| **Testing** | **66 Jest + Supertest tests, 90.39 % line coverage** covering every API route, error paths, cache headers, rate limits, input validation, and edge cases. Run with `npm test`. |
| **Accessibility** | Skip-to-content link, `aria-label` on every interactive element, `aria-live` regions for chat/quiz/translations, semantic HTML5 landmarks, WCAG 2.1 AA contrast, full keyboard nav, `prefers-reduced-motion` CSS media query disables every animation for users who need it. |
| **Google Services** | 10 services integrated meaningfully (not just namedropped) — see table above. |

---

## UI / Motion Highlights

- Animated saffron→gold→green gradient under active tab (slides in)
- Hero: staggered fade-in for tag / title / subtitle
- **Rotating Ashoka Chakra** SVG in the hero — India's national emblem, spun at 80 s per revolution
- Scroll-reveal for fact cards and election-type cards (IntersectionObserver)
- Count-up animation for numeric facts (e.g., 96.8 Crore voters)
- Shimmer sweep on fact card hover; radial pointer-glow on step cards
- Moving shine across quiz progress bar
- All motion respects `prefers-reduced-motion: reduce` (animations disabled, transitions clamped to 0.01 ms)

---

## Project Structure

```
VoteWiseIndia/
├── server.js           # Express backend — full JSDoc, modular helpers
├── server.test.js      # Jest + Supertest — 66 tests, 90%+ coverage
├── public/
│   └── index.html      # SPA frontend — bilingual, accessible, animated
├── Dockerfile          # Cloud Run deployment
├── package.json
├── .env.example        # Template — copy to .env and fill in
├── .gitignore          # Excludes .env, node_modules, coverage/
└── README.md
```

---

## How to Run Locally

```bash
git clone https://github.com/SaiBhargavRallapalli/VoteWiseIndia.git
cd VoteWiseIndia
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY (get one at https://aistudio.google.com/apikey)
npm start
# → http://localhost:8080

# Run the test suite (66 tests, ~7 s)
npm test
```

---

## Deploy to Google Cloud Run

```bash
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com artifactregistry.googleapis.com \
  cloudbuild.googleapis.com firestore.googleapis.com \
  identitytoolkit.googleapis.com firebase.googleapis.com

gcloud run deploy votewise-india \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY,FIREBASE_API_KEY=YOUR_KEY,FIREBASE_PROJECT_ID=YOUR_PROJECT
```

Region `asia-south1` (Mumbai) keeps latency low for Indian users.

---

## Security Notes

- **Secrets never committed.** `.env` is listed in `.gitignore`; only `.env.example` is tracked.
- **Gemini key is server-side only.** All AI calls are proxied through `/api/chat` and `/api/translate` — the browser never sees the key.
- **Rate limiting.** All `POST` endpoints (`/api/chat`, `/api/translate`, `/api/quiz/submit`) are rate-limited via `express-rate-limit`.
- **Input sanitisation.** Every user-rendered string is escaped by `escHtml()` before being inserted into the DOM.
- **CORS.** Configurable via `ALLOWED_ORIGIN` env var for production lockdown.
- **Helmet.** Standard secure-by-default HTTP headers.

---

## Assumptions Made

1. Election data reflects the state as of early 2026. Real deployments would sync with ECI's live API / RSS feeds.
2. The app is politically neutral — it educates about the *process*, never about parties or candidates.
3. Quiz scores use anonymous client-generated session IDs — no PII is stored.
4. Translation is powered by Gemini rather than Cloud Translation API to preserve election-domain context across languages.
5. The target audience is first-time voters and rural citizens — hence simple language, bilingual UI, and mobile-first responsive layout.
6. Firebase is optional — the app degrades gracefully (no leaderboard) if Firebase env vars are unset.

---

## Accessibility

- ✅ Skip-to-content link for keyboard users
- ✅ `aria-label` on all interactive elements
- ✅ `aria-live` regions for chat, quiz feedback, translation output
- ✅ Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`)
- ✅ WCAG 2.1 AA contrast ratios throughout
- ✅ Full keyboard navigation — no mouse required
- ✅ `prefers-reduced-motion: reduce` honoured — every animation disabled, every transition clamped
- ✅ Bilingual (EN / HI) interface; 8-language Gemini translation
- ✅ Mobile-responsive layout, tested down to 360 px width

---

*Built for PromptWars Virtual 2026 — Election Process Education vertical.*
