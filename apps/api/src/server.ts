import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import prismaPlugin from './plugins/prisma.plugin'
import authRoutes from './modules/auth/auth.route'
import lessonRoutes from './modules/lesson/lesson.route'
import progressRoutes from './modules/progress/progress.route'

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason)
  process.exit(1)
})

// Load .env hanya di development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = Fastify({
  logger: process.env.NODE_ENV !== 'production'
})

app.register(cors, {
  origin: (origin, cb) => {
    if (!origin || origin.endsWith('.railway.app') || origin.includes('localhost')) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'), false)
    }
  },
  credentials: true
})
app.register(prismaPlugin)
app.register(cookie)
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'dev-secret-change-in-production'
})

app.register(authRoutes, { prefix: '/api/v1/auth' })
app.register(lessonRoutes, { prefix: '/api/v1/lessons' })
app.register(progressRoutes, { prefix: '/api/v1/lessons' })

app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

const start = async () => {
  try {
    console.log('Starting server...')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
    const port = Number(process.env.API_PORT) || 3001
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 API running at http://localhost:${port}`)
  } catch (err: any) {
    console.error('STARTUP ERROR:', err.message)
    console.error(err.stack)
    process.exit(1)
  }
}

start()
