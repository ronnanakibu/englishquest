// apps/api/src/modules/quest/quest.route.ts
import { FastifyPluginAsync } from 'fastify'
import { authenticate } from '../../shared/middleware/auth.middleware'

const questRoutes: FastifyPluginAsync = async (fastify) => {
  
  // GET /api/v1/quests/today
  fastify.get('/today', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string }
    
    // Normalisasi tanggal hari ini (00:00:00)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    try {
      // 1. Cari apakah misi harian untuk hari ini sudah di-generate
      let challenge = await fastify.prisma.dailyChallenge.findFirst({
        where: { date: today },
        include: { lesson: { select: { title: true, id: true } } }
      })

      // 2. Jika belum ada misi untuk hari ini, generate otomatis secara acak
      if (!challenge) {
        const publishedLessons = await fastify.prisma.lesson.findMany({
          where: { isPublished: true },
          select: { id: true }
        })

        if (publishedLessons.length === 0) {
          return reply.status(404).send({ error: 'Belum ada lesson yang dipublikasikan' })
        }

        // Ambil satu lesson secara acak
        const randomLesson = publishedLessons[Math.floor(Math.random() * publishedLessons.length)]

        challenge = await fastify.prisma.dailyChallenge.create({
          data: {
            date: today,
            lessonId: randomLesson.id,
            xpBonus: 50 // Sesuai default di schema
          },
          include: { lesson: { select: { title: true, id: true } } }
        })
      }

      // 3. Cek apakah user saat ini sudah menyelesaikan misi harian ini
      const userCompleted = await fastify.prisma.userDailyChallenge.findUnique({
        where: {
          userId_challengeId: {
            userId: user.id,
            challengeId: challenge.id
          }
        }
      })

      return reply.send({
        id: challenge.id,
        xpBonus: challenge.xpBonus,
        lessonId: challenge.lessonId,
        lessonTitle: challenge.lesson.title,
        isCompleted: !!userCompleted
      })
    } catch (err) {
      request.log.error(err)
      return reply.status(500).send({ error: 'Gagal memproses misi harian' })
    }
  })
}

export default questRoutes