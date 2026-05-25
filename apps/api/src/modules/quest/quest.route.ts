// apps/api/src/modules/quest/quest.route.ts
import { FastifyPluginAsync } from 'fastify'
import { authenticate } from '../../shared/middleware/auth.middleware'

const questRoutes: FastifyPluginAsync = async (fastify) => {

  // Helper internal cerdas untuk menghitung progres aktivitas harian sesuai tipe misi
  async function calculateProgress(userId: string, type: string, start: Date, end: Date): Promise<number> {
    if (type === 'COMPLETE_LESSONS') {
      return await fastify.prisma.xPLog.count({
        where: {
          userId,
          source: 'LESSON_COMPLETE',
          createdAt: { gte: start, lte: end }
        }
      })
    }

    if (type === 'EARN_XP') {
      const xpAggregate = await fastify.prisma.xPLog.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          source: { in: ['LESSON_COMPLETE', 'PERFECT_SCORE', 'COMBO_BONUS'] },
          createdAt: { gte: start, lte: end }
        }
      })
      return xpAggregate._sum.amount || 0
    }

    if (type === 'PERFECT_SCORE') {
      return await fastify.prisma.xPLog.count({
        where: {
          userId,
          source: 'PERFECT_SCORE',
          createdAt: { gte: start, lte: end }
        }
      })
    }

    if (type === 'ANSWER_QUESTIONS') {
      // PERBAIKAN 1: Tembus userId lewat relasi progress / userProgress
      try {
        return await fastify.prisma.userAnswer.count({
          where: {
            progress: { userId: userId }, // Mengikuti jalur relasi kuis Anda
            isCorrect: true,
            createdAt: { gte: start, lte: end }
          }
        })
      } catch {
        return 0
      }
    }

    if (type === 'VOCAB_REVIEW') {
      // PERBAIKAN 2: Sesuaikan nama field waktu atau lepas filter tanggal jika tidak memakai timestamp
      try {
        return await fastify.prisma.vocabProgress.count({
          where: {
            userId: userId,
            // Jika model VocabProgress Anda ternyata memiliki kolom 'createdAt', ganti 'updatedAt' menjadi 'createdAt'.
            // Jika tidak ada kolom waktu sama sekali, hapus baris filter tanggal di bawah ini:
            updatedAt: { gte: start, lte: end }
          }
        })
      } catch {
        return 0
      }
    }

    return 0
  }

  // 1. GET /api/v1/quests/today -> Mengambil atau mengacak otomatis 1 dari 5 variasi misi
  fastify.get('/today', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string }

    // Normalisasi waktu global UTC 00:00:00 untuk sistem reset harian anti-cheat
    const now = new Date()
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

    try {
      let challenge = await fastify.prisma.dailyChallenge.findFirst({
        where: { date: today }
      })

      // JIKA MEMASUKI HARI BARU, ACAK SECARA ADIL 1 DARI 5 KOLAM MISI DI BAWAH INI:
      if (!challenge) {
        const questPool = [
          { type: "COMPLETE_LESSONS", targetCount: 2, xpBonus: 50 },
          { type: "EARN_XP", targetCount: 80, xpBonus: 60 },
          { type: "PERFECT_SCORE", targetCount: 1, xpBonus: 50 },
          { type: "ANSWER_QUESTIONS", targetCount: 15, xpBonus: 40 },
          { type: "VOCAB_REVIEW", targetCount: 5, xpBonus: 45 }
        ]

        // Pilih misi secara acak menggunakan index Math.random
        const randomQuest = questPool[Math.floor(Math.random() * questPool.length)]

        try {
          challenge = await fastify.prisma.dailyChallenge.create({
            data: {
              date: today,
              type: randomQuest.type,
              targetCount: randomQuest.targetCount,
              xpBonus: randomQuest.xpBonus
            }
          })
          console.log(`▲ [System] Berhasil generate misi harian acak baru: ${randomQuest.type}`);
        } catch (createErr: any) {
          if (createErr.code === 'P2002') {
            challenge = await fastify.prisma.dailyChallenge.findFirst({
              where: { date: today }
            })
          } else {
            throw createErr
          }
        }
      }

      if (!challenge) throw new Error('Gagal mengolah data tantangan harian.')

      const startOfDay = new Date(today)
      const endOfDay = new Date(today)
      endOfDay.setUTCHours(23, 59, 59, 999)

      // Ambil progres real-time user saat ini berdasarkan tipe misi yang terpilih
      const currentCount = await calculateProgress(user.id, challenge.type, startOfDay, endOfDay)

      // Validasi apakah user sudah mengklaim hadiahnya hari ini
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
        type: challenge.type,
        targetCount: challenge.targetCount,
        currentCount: currentCount,
        xpBonus: challenge.xpBonus,
        isCompleted: !!userCompleted
      })
    } catch (err) {
      request.log.error(err)
      return reply.status(500).send({ error: 'Gagal memproses detail misi harian' })
    }
  })

  // 2. POST /api/v1/quests/claim -> Validasi progres akhir dan pencairan hadiah XP
  fastify.post('/claim', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string }
    const { challengeId } = request.body as { challengeId: string }

    try {
      const challenge = await fastify.prisma.dailyChallenge.findUnique({
        where: { id: challengeId }
      })
      if (!challenge) return reply.status(404).send({ error: 'Misi harian tidak ditemukan!' })

      const existingClaim = await fastify.prisma.userDailyChallenge.findUnique({
        where: {
          userId_challengeId: { userId: user.id, challengeId: challengeId }
        }
      })
      if (existingClaim) return reply.status(400).send({ error: 'Kamu sudah mengambil hadiah hari ini!' })

      const now = new Date()
      const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
      const startOfDay = new Date(today)
      const endOfDay = new Date(today)
      endOfDay.setUTCHours(23, 59, 59, 999)

      const currentCount = await calculateProgress(user.id, challenge.type, startOfDay, endOfDay)

      if (currentCount < challenge.targetCount) {
        return reply.status(400).send({ error: `Progres kamu belum mencukupi target! (${currentCount}/${challenge.targetCount})` })
      }

      const [claimRecord, updatedUser] = await fastify.prisma.$transaction([
        fastify.prisma.userDailyChallenge.create({
          data: { userId: user.id, challengeId: challengeId }
        }),
        fastify.prisma.user.update({
          where: { id: user.id },
          data: { xp: { increment: challenge.xpBonus } }
        }),
        fastify.prisma.xPLog.create({
          data: {
            userId: user.id,
            amount: challenge.xpBonus,
            source: 'DAILY_CHALLENGE',
            metadata: { challengeId }
          }
        })
      ])

      return reply.send({
        success: true,
        message: 'Congratulations! Reward successfully claimed!',
        xpBonus: challenge.xpBonus,
        currentTotalXp: updatedUser.xp
      })

    } catch (err) {
      request.log.error(err)
      return reply.status(500).send({ error: 'Gagal mengklaim hadiah misi harian' })
    }
  })
}

export default questRoutes