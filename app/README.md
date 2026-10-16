# ANGEL ONE Playground

Local conversational devotional-companion prototype. Sample devotionals, teaching metadata and media are explicitly labelled **ORIGINAL DEMO content**. This project is not an official Loveworld, Rhapsody of Realities or PCDL service, and does not claim endorsement or official API connectivity.

## macOS setup

```bash
cd app
npm install
cp .env.example .env
npm run dev:server
```

In another Terminal:

```bash
cd app
npm run dev
```

Open `http://127.0.0.1:5173/playground`. The default `AI_PROVIDER=demo` requires no key and exercises deterministic, database-backed tool flows. For live AI, set `AI_PROVIDER=openai` and `OPENAI_API_KEY`, or `AI_PROVIDER=gemini` and `GEMINI_API_KEY` in `.env`, then restart the server. API keys are never exposed to the browser.

## Validate

```bash
npm run typecheck
npm test
npm run build
```

## Structure

- `src/` — React Playground, microphone support/fallback, speech synthesis and activity inspector.
- `server/` — Fastify API, SQLite storage, model adapters and local tool implementations.
- `docs/` — architecture, test scenarios and future-integration constraints.
