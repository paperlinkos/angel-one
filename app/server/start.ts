import { buildServer } from './index.js'
buildServer().listen({ port: Number(process.env.PORT || 8787), host: '127.0.0.1' })
