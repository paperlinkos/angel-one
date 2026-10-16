import { ANGEL_ONE_SYSTEM } from './system.js'
import type { ChatMessage } from './types.js'

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434'
let selectedModel = process.env.OLLAMA_MODEL || 'qwen2.5:3b'
export const localConfig = { get: () => selectedModel, set: (model: string) => { selectedModel = model } }

export async function ollamaStatus() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(1500) })
    if (!response.ok) return { running: false, error: `Ollama returned ${response.status}`, models: [] as string[] }
    const data = await response.json() as { models?: { name: string }[] }
    return { running: true, models: (data.models || []).map(model => model.name), selectedModel }
  } catch {
    return { running: false, error: 'Ollama is not reachable at localhost:11434.', models: [] as string[], selectedModel }
  }
}

export async function getLocalReply(history: ChatMessage[]) {
  const status = await ollamaStatus()
  if (!status.running) throw new Error('Local AI unavailable: start Ollama, then start or download the selected model. No cloud fallback is used.')
  if (!status.models.includes(selectedModel)) throw new Error(`Model “${selectedModel}” is not installed. Run: ollama pull ${selectedModel}`)
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: selectedModel, stream: false, messages: [{ role: 'system', content: ANGEL_ONE_SYSTEM }, ...history.filter(message => message.role !== 'tool').map(message => ({ role: message.role, content: message.content }))] }),
  })
  if (!response.ok) throw new Error(`Ollama model error ${response.status}: ${await response.text()}`)
  const data = await response.json() as { message?: { content?: string } }
  const content = data.message?.content?.trim()
  if (!content) throw new Error('Invalid local model response: missing assistant text.')
  return { name: `ollama:${selectedModel}`, content }
}
