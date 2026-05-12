import { FastifyPluginAsync } from 'fastify'
import { ProgressService } from './progress.service'
import { ProgressRepository } from './progress.repository'
import { authenticate } from '../../shared/middleware/auth.middleware'
import { AppError } from '../../shared/errors/AppError'

const progressRoutes: FastifyPluginAsync = async (fastify) => {
  const progressRepo = new ProgressRepository(fastify.prisma)
  const progressService = new ProgressService(progressRepo, fastify.prisma)

  // POST /api/v1/lessons/:id/start
  fastify.post('/:id/start', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string }
    const { id } = request.params as { id: string }

    try {
      const result = await progressService.startLesson(user.id, id)
      return reply.status(201).send(result)
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ error: err.message })
      }
      throw err
    }
  })

  // POST /api/v1/lessons/:id/answer
  fastify.post('/:id/answer', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string }
    const { progressId, questionId, userAnswer, timeSpent } = request.body as {
      progressId: string
      questionId: string
      userAnswer: string
      timeSpent: number
    }

    try {
      const result = await progressService.submitAnswer({
        userId: user.id,
        progressId,
        questionId,
        userAnswer,
        timeSpent: timeSpent || 0
      })
      return reply.send(result)
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ error: err.message })
      }
      throw err
    }
  })

  // POST /api/v1/lessons/:id/complete
  fastify.post('/:id/complete', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string }
    const { id } = request.params as { id: string }
    const { progressId } = request.body as { progressId: string }

    try {
      const result = await progressService.completeLesson(user.id, id, progressId)
      return reply.send(result)
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({ error: err.message })
      }
      throw err
    }
  })
}

export default progressRoutes