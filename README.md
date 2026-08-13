# Job Portfolio

A modern, AI-powered developer portfolio built with **React + TypeScript + Vite**. Includes an AI project finder, an AI job-compatibility analyzer, a portfolio chatbot agent, Firebase auth, and animated 3D backgrounds.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Three.js
- **Backend:** Node.js server (`server/index.ts`) with Type Stripping
- **AI:** OpenRouter (Gemini/GPT/Claude) **or** xAI Grok
- **Auth & Data:** Firebase Authentication + Firestore
- **Deploy:** Any static host (Vercel / Netlify / GitHub Pages / Render / HF Spaces)

## Quick Start

```bash
npm install
npm run dev
```

- Frontend runs at `http://localhost:5173`
- AI backend runs at `http://localhost:3001`

## Required Environment Variables

> **Important:** create a `.env` file in the project root (same folder as `package.json`)
> by copying the template below. **Never commit your real `.env`** — it is already in `.gitignore`.
> After editing `.env`, restart the dev server.

```bash
cp .env.example .env
```

### The complete key list

| # | Key | Where it's read | Purpose | Where to get it |
|---|-----|-----------------|---------|-----------------|
| 1 | `VITE_FIREBASE_API_KEY` | client (`src/lib/firebase.ts`) | Firebase web app config | Firebase Console → Project settings → Your apps → SDK config |
| 2 | `VITE_FIREBASE_AUTH_DOMAIN` | client | Firebase web app config | same place (format: `your-project-id.firebaseapp.com`) |
| 3 | `VITE_FIREBASE_PROJECT_ID` | client | Firebase web app config | same place |
| 4 | `VITE_FIREBASE_STORAGE_BUCKET` | client | Firebase web app config | same place (format: `your-project-id.appspot.com`) |
| 5 | `VITE_FIREBASE_MESSAGING_SENDER_ID` | client | Firebase web app config | same place |
| 6 | `VITE_FIREBASE_APP_ID` | client | Firebase web app config | same place |
| 7 | `VITE_FIREBASE_MEASUREMENT_ID` | client (optional) | Analytics only — skip if not using GA4 | same place |
| 8 | `VITE_API_BASE_URL` | client (`src/utils/api.ts`) | URL of the AI backend. Leave empty for local dev (defaults to `http://localhost:3001`) | your deployed backend URL |
| 9 | `VITE_OPENROUTER_MODEL` | client (optional fallback) | Default model if the server sends none | OpenRouter model slug |
| 10 | `PORT` | server (`server/index.ts`) | Port for the AI backend | default `3001` |
| 11 | `OPENROUTER_API_KEY` | server (`server/lib/config.ts`) | AI access via OpenRouter (one key → Gemini/GPT/Claude/Llama…) | https://openrouter.ai/keys |
| 12 | `OPENROUTER_MODEL` | server | Default OpenRouter model | default `google/gemini-2.0-flash-exp:free` |
| 13 | `OPENROUTER_BASE_URL` | server (optional) | Custom OpenRouter endpoint | default `https://openrouter.ai/api/v1` |
| 14 | `GROK_API_KEY` | server | **Alternative** AI provider (xAI Grok). If set, Grok is used instead of OpenRouter | https://console.x.ai |
| 15 | `XAI_API_KEY` | server | Alias for the same Grok key (fallback if `GROK_API_KEY` is empty) | same place |
| 16 | `GROK_MODEL` | server | Grok model name | default `grok-3-mini` |
| 17 | `GROK_BASE_URL` | server (optional) | Custom Grok endpoint | default `https://api.x.ai/v1` |
| 18 | `AI_TIMEOUT_MS` | server (optional) | AI request timeout | default `30000` |

### Quick summary — the 7 keys you actually must fill

For everything to work you need, at minimum:

```env
# Firebase (6 required)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# AI — EITHER OpenRouter OR Grok
OPENROUTER_API_KEY=          # or GROK_API_KEY=

# Optional
VITE_API_BASE_URL=           # leave empty for local dev
```

## Project Scripts

```bash
npm run dev        # start frontend + AI backend together
npm run dev:vite   # frontend only
npm run dev:server # AI backend only
npm run build      # production build (outputs to dist/)
npm run preview    # preview the production build
npm run server     # start the AI backend in production
```

## Deployment

1. `npm run build`
2. Deploy the `dist/` folder to any static host.
3. Deploy the AI backend (`npm run server`) separately, then set `VITE_API_BASE_URL` to its public URL.
4. Set all server-side keys (`OPENROUTER_API_KEY`/`GROK_API_KEY`, `PORT`, etc.) as env vars on the server host.
