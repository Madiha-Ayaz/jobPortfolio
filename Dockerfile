# Nova AI — full-stack Docker image for Hugging Face Spaces.
# Serves the built React frontend (dist/) AND the Node.js AI backend on port 7860.
# Node 24 runs the TypeScript server natively (no build step needed).
# HF Spaces expects the app to listen on port 7860.

# ── Stage 1: build the frontend ──────────────────────────────────────────
FROM node:24-slim AS build

WORKDIR /app

# Install all dependencies (including dev deps needed for `vite build`).
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Give Vite enough heap memory during the production build.
ENV NODE_OPTIONS=--max-old-space-size=3072

# Everything the frontend build needs.
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.mjs ./
COPY public ./public
COPY src ./src

# Vite bakes these client-side Firebase values into the bundle at build time.
# They are PUBLIC (they ship to every browser in the JS bundle), so they are
# safe to declare here. Server-side secrets (OPENROUTER_API_KEY, DATABASE_URL)
# are injected at RUNTIME from the Space's Settings > Variables & Secrets.
ENV VITE_FIREBASE_API_KEY=AIzaSyBK0d4UupVbKBcwQeRxAaR_hqcEvxHgO84
ENV VITE_FIREBASE_AUTH_DOMAIN=portfoliojob-48320.firebaseapp.com
ENV VITE_FIREBASE_PROJECT_ID=portfoliojob-48320
ENV VITE_FIREBASE_STORAGE_BUCKET=portfoliojob-48320.firebasestorage.app
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=802293694992
ENV VITE_FIREBASE_APP_ID=1:802293694992:web:5266fd5861487cd51cc095
ENV VITE_FIREBASE_MEASUREMENT_ID=G-2ZG3XHMFKB

RUN npm run build

# ── Stage 2: runtime ─────────────────────────────────────────────────────
FROM node:24-slim

WORKDIR /app

# Install runtime dependencies first (cached layer).
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Server source + the built frontend.
COPY server ./server
COPY src/lib ./src/lib
COPY tsconfig.json ./
COPY --from=build /app/dist ./dist

ENV PORT=7860
ENV NODE_ENV=production

EXPOSE 7860

# Secrets come from HF Space settings (Settings > Variables & Secrets),
# NOT from a committed .env file.
CMD ["node", "server/index.ts"]
