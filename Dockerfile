# Nova AI backend — Docker image for Hugging Face Spaces
# Node 24 runs the TypeScript server natively (no build step needed).
# HF Spaces expects the app to listen on port 7860.
FROM node:24-slim

WORKDIR /app

# Install runtime dependencies first (cached layer).
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Server source + the single data file it imports from the frontend.
COPY server ./server
COPY src/lib ./src/lib
COPY tsconfig.json ./

ENV PORT=7860
ENV NODE_ENV=production

EXPOSE 7860

# Secrets come from HF Space settings (Settings > Variables & Secrets),
# NOT from a committed .env file.
CMD ["node", "server/index.ts"]
