import { FastifyPluginAsync } from 'fastify'
import { LessonService } from './lesson.service'
import { LessonRepository } from './lesson.repository'
import { authenticate } from '../../shared/middleware/auth.middleware'
import { AppError } from '../../shared/errors/AppError'

const lessonRoutes: FastifyPluginAsync = async (fastify) => {
  const lessonRepo = new LessonRepository(fastify.prisma)
  const lessonService = new LessonService(lessonRepo)

  // 1. GET /api/v1/lessons — List semua lesson
  fastify.get('/', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string; role: string }

    const dbUser = await fastify.prisma.user.findUnique({
      where: { id: user.id },
      select: { level: true }
    })

    if (!dbUser) return reply.status(404).send({ error: 'User tidak ditemukan' })

    const lessons = await lessonService.getLessons(user.id, dbUser.level)
    return reply.send({ lessons })
  })

  // 🌟 2. GET /api/v1/lessons/my/mistakes — AMANKAN DI SINI (DI ATAS WILDCARD :id)
  fastify.get('/my/mistakes', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string }
    try {
      const userMistakes = await fastify.prisma.userMistake.findMany({
        where: { userId: user.id },
        include: {
          question: {
            select: {
              id: true,
              type: true,
              prompt: true,
              correctAnswer: true,
              explanation: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      const formattedMistakes = userMistakes.map((m) => m.question)
      return reply.send({ success: true, data: formattedMistakes })
    } catch (err: any) {
      request.log.error(err)
      return reply.status(500).send({ error: 'Gagal memuat lab kesalahan', message: err.message })
    }
  })

  // 3. GET /api/v1/lessons/:id — Detail lesson + questions (Sekarang aman dari tabrakan)
  fastify.get('/:id', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const lesson = await lessonService.getLessonDetail(id)
      return reply.send({ lesson })
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ error: err.message })
      }
      throw err
    }
  })
}

export default lessonRoutes