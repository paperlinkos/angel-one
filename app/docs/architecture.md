# Architecture

`src/` is the browser-only React Playground. It accesses `/api` only; keys never enter Vite variables. `server/` is Fastify with SQLite-backed sessions, messages, demo devotionals, teachings, media, queues and reminders. `providers.ts` selects `demo`, `openai`, or `gemini`; `tools.ts` implements the eight requested local tools.
