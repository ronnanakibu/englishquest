import { FastifyPluginAsync } from 'fastify'
import { authenticate } from '../../shared/middleware/auth.middleware'

const leaderboardRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string }

    const top = await fastify.prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 50,
      select: {
        id: true,
        username: true,
        xp: true,
        level: true,
        currentStreak: true,
      }
    })

    const currentUserRank = top.findIndex(u => u.id === user.id) + 1

    return reply.send({
      leaderboard: top.map((u, i) => ({ ...u, rank: i + 1 })),
      currentUserRank: currentUserRank || null,
    })
  })
}

export default leaderboardRoutes