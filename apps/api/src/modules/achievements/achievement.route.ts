import { FastifyPluginAsync } from 'fastify'
import { authenticate } from '../../shared/middleware/auth.middleware'

const achievementRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string }

    const [all, userAchievements] = await Promise.all([
      fastify.prisma.achievement.findMany({
        orderBy: { xpReward: 'asc' }
      }),
      fastify.prisma.userAchievement.findMany({
        where: { userId: user.id },
        include: { achievement: true }
      })
    ])

    const earned = userAchievements.map(ua => ({
      ...ua.achievement,
      earnedAt: ua.earnedAt
    }))

    return reply.send({ all, earned })
  })
}

export default achievementRoutes