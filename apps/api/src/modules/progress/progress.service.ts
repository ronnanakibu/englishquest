import { PrismaClient } from '@prisma/client'
import { AppError } from '../../shared/errors/AppError'
import { ProgressRepository } from './progress.repository'

export class ProgressService {
  constructor(
    private progressRepo: ProgressRepository,
    private prisma: PrismaClient
  ) {}

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

    return {
      isCorrect,
      correctAnswer: isCorrect ? undefined : question.correctAnswer,
      explanation: question.explanation
    }
  }

  async completeLesson(userId: string, lessonId: string, progressId: string) {
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
    const score = totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0

    let xpEarned = lesson.xpReward
    if (score === 100) xpEarned = Math.round(lesson.xpReward * 1.5)

    await this.prisma.userProgress.update({
      where: { userId_lessonId: { userId, lessonId } },
      data: {
        status: 'COMPLETED',
        score,
        xpEarned,
        completedAt: new Date(),
        bestScore: score > progress.bestScore ? score : progress.bestScore
      }
    })

    // Award XP
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: xpEarned } }
    })

    // Log XP
    await this.prisma.xPLog.create({
      data: {
        userId,
        amount: xpEarned,
        source: score === 100 ? 'PERFECT_SCORE' : 'LESSON_COMPLETE',
        metadata: { lessonId, score }
      }
    })

    // Calculate new level
    const newLevel = this.calculateLevel(updatedUser.xp)
    if (newLevel > updatedUser.level) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { level: newLevel }
      })
    }

    // Update streak
    await this.updateStreak(userId)

    // Check achievements (async, non-blocking)
    const finalUser = await this.prisma.user.findUnique({ where: { id: userId } })
    setImmediate(() => this.checkAchievements(userId, finalUser!))

    return {
      score,
      xpEarned,
      correctAnswers,
      totalQuestions,
      isPerfect: score === 100,
      newLevel: newLevel > updatedUser.level ? newLevel : null,
      leveledUp: newLevel > updatedUser.level
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

  private async checkAchievements(userId: string, user: any) {
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
          }
        }
      }
    } catch (err) {
      console.error('Achievement check error:', err)
    }
  }
}