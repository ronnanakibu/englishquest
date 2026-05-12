import { FastifyPluginAsync } from 'fastify'
import { LessonService } from './lesson.service'
import { LessonRepository } from './lesson.repository'
import { authenticate } from '../../shared/middleware/auth.middleware'
import { AppError } from '../../shared/errors/AppError'

const lessonRoutes: FastifyPluginAsync = async (fastify) => {
  const lessonRepo = new LessonRepository(fastify.prisma)
  const lessonService = new LessonService(lessonRepo)

  // GET /api/v1/lessons — list semua lesson
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

  // GET /api/v1/lessons/:id — detail lesson + questions
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