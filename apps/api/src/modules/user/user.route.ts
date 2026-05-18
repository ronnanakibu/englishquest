import { FastifyPluginAsync } from 'fastify'
import { authenticate } from '../../shared/middleware/auth.middleware'

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/me', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string }
    
    const dbUser = await fastify.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        xp: true,
        level: true,
        hearts: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
      }
    })

    if (!dbUser) return reply.status(404).send({ error: 'User tidak ditemukan' })
    return reply.send({ user: dbUser })
  })
}

export default userRoutes