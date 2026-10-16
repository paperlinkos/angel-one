import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { randomUUID } from 'node:crypto'
import { createDb } from './db.js'
import { getLocalReply, localConfig, ollamaStatus } from './providers.js'
import type { ChatMessage } from './types.js'

export function buildServer() {
  const app = Fastify({ logger: true }), db = createDb()
  app.register(cors, { origin: true })
  app.get('/api/health', async () => ({ ok: true, localOnly: true, ollama: await ollamaStatus() }))
  app.get('/api/config', async () => ({ model: localConfig.get(), localOnly: true }))
  app.post<{ Body: { model: string } }>('/api/config', async (request, reply) => {
    const model = request.body.model?.trim()
    if (!model) return reply.code(400).send({ error: 'A local Ollama model name is required.' })
    localConfig.set(model); return { model, localOnly: true }
  })
  app.post('/api/reset', async () => ({ sessionId: randomUUID() }))
  app.post<{ Body: { sessionId?: string; message: string } }>('/api/chat', async (request, reply) => {
    const sessionId = request.body.sessionId || randomUUID(), started = Date.now(), id = randomUUID()
    db.prepare('INSERT OR IGNORE INTO sessions (id) VALUES (?)').run(sessionId)
    db.prepare('INSERT INTO messages (id,session_id,role,content) VALUES (?,?,?,?)').run(id, sessionId, 'user', request.body.message)
    const history = db.prepare('SELECT role,content,created_at as createdAt FROM messages WHERE session_id=? ORDER BY created_at,id').all(sessionId) as ChatMessage[]
    try {
      const local = await getLocalReply(history)
      const message = { id: randomUUID(), role: 'assistant' as const, content: local.content }
      db.prepare('INSERT INTO messages (id,session_id,role,content) VALUES (?,?,?,?)').run(message.id, sessionId, 'assistant', message.content)
      return { sessionId, message, activity: [{ provider: local.name, latencyMs: Date.now() - started, result: { localOnly: true, model: localConfig.get(), contextMessages: history.length } }] }
    } catch (error: any) {
      return reply.code(503).send({ sessionId, error: error.message, activity: [{ provider: `ollama:${localConfig.get()}`, latencyMs: Date.now() - started, error: error.message }] })
    }
  })
  return app
}
