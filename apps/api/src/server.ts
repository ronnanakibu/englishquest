import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { config } from 'dotenv'
import prismaPlugin from './plugins/prisma.plugin'
import authRoutes from './modules/auth/auth.route'
import lessonRoutes from './modules/lesson/lesson.route'
import progressRoutes from './modules/progress/progress.route'
import userRoutes from './modules/user/user.route'
import leaderboardRoutes from './modules/leaderboard/leaderboard.route'
import achievementRoutes from './modules/achievements/achievement.route'
import checkinRoutes from './modules/checkin/checkin.route'


config()

const app = Fastify({
  logger: process.env.NODE_ENV !== 'production'
})

app.register(userRoutes, { prefix: '/api/v1/user' })
app.register(leaderboardRoutes, { prefix: '/api/v1/leaderboard' })
app.register(achievementRoutes, { prefix: '/api/v1/achievements' })
app.register(checkinRoutes, { prefix: '/api/v1/checkin' })

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
    const port = Number(process.env.API_PORT) || 3001
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 API running at http://localhost:${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
