import { PrismaClient } from '@prisma/client'
import { AppError } from '../../shared/errors/AppError'
import { ProgressRepository } from './progress.repository'

// Kamus metadata lencana lokal untuk memastikan tampilan emoji & teks deskripsi super solid di frontend
const ACHIEVEMENT_MAPPER: Record<string, { emoji: string; title: string; desc: string }> = {
  FIRST_LESSON: { emoji: '🦉', title: 'First Milestone', desc: 'Selesaikan unit kuis pertama kamu!' },
  LESSON_5: { emoji: '📜', title: 'Knowledge Seeker', desc: 'Selesaikan 5 unit kuis bahasa Inggris!' },
  LESSON_10: { emoji: '📚', title: 'Diligent Scholar', desc: 'Selesaikan 10 unit kuis bahasa Inggris!' },
  LESSON_20: { emoji: '🧠', title: 'Polyglot Mastery', desc: 'Selesaikan 20 unit kuis bahasa Inggris!' },
  STREAK_3: { emoji: '⚡', title: 'Getting Warm', desc: 'Pertahankan konsistensi streak belajar selama 3 hari!' },
  STREAK_7: { emoji: '🔥', title: 'Unstoppable Streak', desc: 'Pertahankan konsistensi streak belajar selama 7 hari!' },
  STREAK_30: { emoji: '👑', title: 'English Overlord', desc: 'Pertahankan konsistensi streak belajar selama 30 hari!' },
  PERFECT_SCORE: { emoji: '💯', title: 'Flawless Victory', desc: 'Raih akurasi skor sempurna 100% pada kelas kuis!' },
  PERFECT_5: { emoji: '🎯', title: 'Sniper Precision', desc: 'Sukses meraih 5 kali skor sempurna 100%!' },
  XP_100: { emoji: '⭐', title: 'Bronze Learner', desc: 'Kumpulkan akumulasi tabungan hingga 100 XP!' },
  XP_500: { emoji: '🔮', title: 'Silver Learner', desc: 'Kumpulkan akumulasi tabungan hingga 500 XP!' },
  XP_1000: { emoji: '💎', title: 'Gold Titan', desc: 'Kumpulkan akumulasi tabungan hingga 1000 XP!' },
}

export class ProgressService {
  constructor(
    private progressRepo: ProgressRepository,
    private prisma: PrismaClient
  ) { }

  async startLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, isPublished: true }
    })
    if (!lesson) throw new AppError('Lesson tidak ditemukan', 404)

    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new AppError('User tidak ditemukan', 404)

    const progress = await this.progressRepo.findOrCreate(userId, lessonId)
    return { progressId: progress.id, message: 'Lesson dimulai' }
  }

  async submitAnswer(data: {
    userId: string
    progressId: string
    questionId: string
    userAnswer: string
    timeSpent: number
  }) {
    const progress = await this.prisma.userProgress.findFirst({
      where: { id: data.progressId, userId: data.userId }
    })
    if (!progress) throw new AppError('Progress tidak ditemukan', 404)

    const question = await this.prisma.question.findUnique({
      where: { id: data.questionId }
    })
    if (!question) throw new AppError('Question tidak ditemukan', 404)

    const isCorrect = data.userAnswer.trim().toLowerCase() ===
      question.correctAnswer.trim().toLowerCase()

    if (!isCorrect) {
      await this.prisma.user.update({
        where: { id: data.userId },
        data: { hearts: { decrement: 1 } }
      })
    }

    await this.progressRepo.saveAnswer({
      progressId: data.progressId,
      questionId: data.questionId,
      userAnswer: data.userAnswer,
      isCorrect,
      timeSpent: data.timeSpent || 0
    })

    try {
      if (isCorrect) {
        await this.prisma.userMistake.deleteMany({
          where: { userId: data.userId, questionId: data.questionId }
        })
      } else {
        await this.prisma.userMistake.upsert({
          where: { userId_questionId: { userId: data.userId, questionId: data.questionId } },
          create: { userId: data.userId, questionId: data.questionId },
          update: {}
        })
      }
    } catch (mistakeErr) {
      console.error('Gagal memproses mutasi UserMistake di Service:', mistakeErr)
    }

    return {
      isCorrect,
      correctAnswer: isCorrect ? undefined : question.correctAnswer,
      explanation: question.explanation
    }
  }

  async completeLesson(userId: string, lessonId: string, progressId: string, maxCombo: number = 0) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson) throw new AppError('Lesson tidak ditemukan', 404)

    const progress = await this.prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    })
    if (!progress) throw new AppError('Progress tidak ditemukan', 404)

    const answers = await this.prisma.userAnswer.findMany({
      where: { progressId: progress.id }
    })

    const totalQuestions = answers.length
    const correctAnswers = answers.filter(a => a.isCorrect).length
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

    let baseXpEarned = lesson.xpReward
    if (score === 100) baseXpEarned = Math.round(lesson.xpReward * 1.5)

    let comboBonus = 0
    if (maxCombo >= 5) comboBonus = 15
    else if (maxCombo >= 3) comboBonus = 5

    let questBonus = 0
    const dailyChallenge = await this.prisma.dailyChallenge.findFirst({
      where: { type: 'COMPLETE_LESSON' }
    })

    if (dailyChallenge && score >= 70) {
      const alreadyCompleted = await this.prisma.userDailyChallenge.findUnique({
        where: { userId_challengeId: { userId, challengeId: dailyChallenge.id } }
      })

      if (!alreadyCompleted) {
        questBonus = dailyChallenge.xpBonus
        await this.prisma.userDailyChallenge.create({
          data: { userId, challengeId: dailyChallenge.id }
        })
      }
    }

    const totalXpEarned = baseXpEarned + comboBonus + questBonus

    await this.prisma.userProgress.update({
      where: { userId_lessonId: { userId, lessonId } },
      data: {
        status: 'COMPLETED',
        score,
        xpEarned: totalXpEarned,
        completedAt: new Date(),
        bestScore: score > progress.bestScore ? score : progress.bestScore
      }
    })

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: totalXpEarned } }
    })

    await this.prisma.xPLog.create({
      data: {
        userId,
        amount: baseXpEarned,
        source: score === 100 ? 'PERFECT_SCORE' : 'LESSON_COMPLETE',
        metadata: { lessonId, score }
      }
    })

    if (comboBonus > 0) {
      await this.prisma.xPLog.create({
        data: { userId, amount: comboBonus, source: 'COMBO_BONUS', metadata: { maxCombo } }
      })
    }

    if (questBonus > 0 && dailyChallenge) {
      await this.prisma.xPLog.create({
        data: { userId, amount: questBonus, source: 'DAILY_CHALLENGE', metadata: { challengeId: dailyChallenge.id } }
      })
    }

    const newLevel = this.calculateLevel(updatedUser.xp)
    if (newLevel > updatedUser.level) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { level: newLevel }
      })
    }

    await this.updateStreak(userId)

    const finalUser = await this.prisma.user.findUnique({ where: { id: userId } })

    // ✅ FIX REALTIME: Kita ganti dari async background 'setImmediate' ke await langsung biar datanya masuk payload response
    const newAchievements = await this.checkAchievements(userId, finalUser!)

    return {
      success: true,
      score,
      xpEarned: totalXpEarned,
      correctAnswers,
      totalQuestions,
      isPerfect: score === 100,
      newLevel: newLevel > updatedUser.level ? newLevel : null,
      leveledUp: newLevel > updatedUser.level,
      comboBonus,
      questBonus,
      newAchievements // 🔥 Orbitkan array lencana baru ke router controller
    }
  }

  private calculateLevel(xp: number): number {
    let level = 1
    while (level < 100) {
      const xpNeeded = Math.floor(100 * Math.pow(level + 1, 2))
      if (xp < xpNeeded) break
      level++
    }
    return level
  }

  private async updateStreak(userId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) return

    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null
    if (lastActive) lastActive.setHours(0, 0, 0, 0)

    const isToday = lastActive?.getTime() === today.getTime()
    if (isToday) return

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = lastActive?.getTime() === yesterday.getTime()

    const newStreak = isYesterday ? user.currentStreak + 1 : 1
    const newLongest = Math.max(user.longestStreak, newStreak)

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: today
      }
    })
  }

  private async checkAchievements(userId: string, user: any): Promise<any[]> {
    const newlyUnlocked: any[] = []
    try {
      const completedCount = await this.prisma.userProgress.count({
        where: { userId, status: 'COMPLETED' }
      })

      const perfectCount = await this.prisma.userProgress.count({
        where: { userId, score: 100 }
      })

      const earned = await this.prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: { select: { code: true } } }
      })
      const earnedCodes = new Set(earned.map(e => e.achievement.code))

      const checks = [
        { code: 'FIRST_LESSON', condition: completedCount >= 1 },
        { code: 'LESSON_5', condition: completedCount >= 5 },
        { code: 'LESSON_10', condition: completedCount >= 10 },
        { code: 'LESSON_20', condition: completedCount >= 20 },
        { code: 'STREAK_3', condition: user.currentStreak >= 3 },
        { code: 'STREAK_7', condition: user.currentStreak >= 7 },
        { code: 'STREAK_30', condition: user.currentStreak >= 30 },
        { code: 'PERFECT_SCORE', condition: perfectCount >= 1 },
        { code: 'PERFECT_5', condition: perfectCount >= 5 },
        { code: 'XP_100', condition: user.xp >= 100 },
        { code: 'XP_500', condition: user.xp >= 500 },
        { code: 'XP_1000', condition: user.xp >= 1000 },
      ]

      for (const check of checks) {
        if (!earnedCodes.has(check.code) && check.condition) {
          const achievement = await this.prisma.achievement.findUnique({
            where: { code: check.code }
          })
          if (achievement) {
            await this.prisma.userAchievement.create({
              data: { userId, achievementId: achievement.id }
            })
            await this.prisma.user.update({
              where: { id: userId },
              data: { xp: { increment: achievement.xpReward } }
            })

            // Ambil visual kosmetik lencana dari mapper lokal
            const visual = ACHIEVEMENT_MAPPER[check.code] || { emoji: '🏆', title: check.code, desc: 'Pencapaian Baru!' }
            newlyUnlocked.push({
              code: check.code,
              title: visual.title,
              description: visual.desc,
              emoji: visual.emoji,
              xpReward: achievement.xpReward
            })
          }
        }
      }
    } catch (err) {
      console.error('Achievement check error:', err)
    }
    return newlyUnlocked // Balikkan list medali baru yang lolos kualifikasi
  }
}