export type Role = 'user' | 'assistant' | 'tool'
export type ChatMessage = { id?: string; role: Role; content: string; createdAt?: string }
export type Activity = { tool?: string; result?: unknown; latencyMs?: number; error?: string; provider: string }
export type ChatResponse = { sessionId: string; message: ChatMessage; activity: Activity[] }
