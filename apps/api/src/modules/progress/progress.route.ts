import { FastifyPluginAsync } from 'fastify'
import { ProgressService } from './progress.service'
import { ProgressRepository } from './progress.repository'
import { authenticate } from '../../shared/middleware/auth.middleware'
import { AppError } from '../../shared/errors/AppError'

const progressRoutes: FastifyPluginAsync = async (fastify) => {
  const progressRepo = new ProgressRepository(fastify.prisma)
  const progressService = new ProgressService(progressRepo, fastify.prisma)

  // 1. POST /api/v1/lessons/:id/start
  fastify.post('/:id/start', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string }
    const { id } = request.params as { id: string }

    try {
      const result = await progressService.startLesson(user.id, id)
      return reply.status(201).send(result)
    } catch (err: any) {
      request.log.error(err)
      return reply.status(500).send({ error: 'Gagal di rute /start', message: err.message })
    }
  })

  // 2. POST /api/v1/lessons/:id/answer
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
    } catch (err: any) {
      request.log.error(err)
      return reply.status(500).send({ error: 'Crash di rute /answer', message: err.message })
    }
  })

  // 3. POST /api/v1/lessons/:id/complete — Penutupan Kuis + Multiplier
  fastify.post('/:id/complete', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    const user = request.user as { id: string }
    const { id } = request.params as { id: string }
    const { progressId, maxCombo } = request.body as { progressId: string; maxCombo?: number }

    try {
      // Ambil data dari service kuis bawaan asli kamu
      const originalResult = await progressService.completeLesson(
        user.id,
        id,
        progressId,
        maxCombo || 0
      ) as any

      // Petakan field secara eksplisit agar aman dari enkapsulasi objek
      const result = {
        success: originalResult?.success,
        score: originalResult?.score,
        correctAnswers: originalResult?.correctAnswers,
        totalQuestions: originalResult?.totalQuestions,
        xpEarned: originalResult?.xpEarned,
        isPerfect: originalResult?.isPerfect,
        leveledUp: originalResult?.leveledUp,
        newLevel: originalResult?.newLevel,
        newAchievements: originalResult?.newAchievements, // 🔥 AMANKAN INI CUY!
      } as any

      // ─── 🔥 PROSES HITUNG BONUS STREAK MULTIPLIER ───
      try {
        const dbUser = await fastify.prisma.user.findUnique({
          where: { id: user.id },
          select: { currentStreak: true, xp: true, level: true }
        })

        const userStreak = dbUser?.currentStreak || 0
        let multiplier = 1.0
        if (userStreak >= 7) multiplier = 1.5
        else if (userStreak >= 3) multiplier = 1.2

        if (multiplier > 1.0 && result && result.xpEarned) {
          const baseXp = result.xpEarned
          const totalXpWithBonus = Math.floor(baseXp * multiplier)
          const bonusXp = totalXpWithBonus - baseXp

          if (bonusXp > 0 && dbUser) {
            const finalXpAmount = dbUser.xp + bonusXp
            const nextLevelThreshold = dbUser.level * 100

            let finalLevel = dbUser.level
            let bonusLeveledUp = false

            if (finalXpAmount >= nextLevelThreshold) {
              bonusLeveledUp = true
              finalLevel += 1
            }

            // Eksekusi injeksi bonus ke database
            await fastify.prisma.$transaction([
              fastify.prisma.user.update({
                where: { id: user.id },
                data: { xp: finalXpAmount, level: finalLevel }
              })
            ])

            result.xpEarned = totalXpWithBonus
            if (bonusLeveledUp || result.leveledUp) {
              result.leveledUp = true
              result.newLevel = finalLevel
            }
          }
        }
      } catch (streakErr: any) {
        fastify.log.error(streakErr, 'Gagal menghitung streak multiplier secara internal')
      }

      return reply.send(result)
    } catch (err: any) {
      request.log.error(err)
      // 🌟 KUNCI UTAMA: Tembakkan pesan eror sistem asli ke log browser!
      return reply.status(500).send({
        error: 'Crash kritis di rute /complete',
        message: err.message,
        stack: err.stack
      })
    }
  })
}

export default progressRoutes