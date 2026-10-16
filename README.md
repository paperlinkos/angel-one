# ANGEL ONE

Local conversational devotional-companion prototype. Sample devotionals, teaching metadata and media are explicitly labelled **ORIGINAL DEMO content**. This project is not an official Loveworld, Rhapsody of Realities or PCDL service, and does not claim endorsement or official API connectivity.

## macOS Quick Start

```bash
cd app
npm install
cp .env.example .env
npm run dev:server
```

In another terminal window:

```bash
cd app
npm run dev
```

Open `http://127.0.0.1:5173/playground`.

- The default `AI_PROVIDER=demo` requires no API key and exercises deterministic, database-backed tool flows.
- For live AI, set `AI_PROVIDER=openai` and `OPENAI_API_KEY`, or `AI_PROVIDER=gemini` and `GEMINI_API_KEY` in `app/.env`, then restart the server. API keys are never exposed to the browser.

## Validation & Testing

```bash
cd app
npm run typecheck
npm test
npm run build
```

## Repository Structure

- `app/src/` — React Playground, microphone support/fallback, speech synthesis, and activity inspector.
- `app/server/` — Fastify API, SQLite storage, model adapters, and local tool implementations.
- `app/docs/` — Architecture, test scenarios, and future-integration constraints.
