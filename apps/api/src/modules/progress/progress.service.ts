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

    if (lesson.unlockLevel > user.level) {
      throw new AppError(`Lesson ini unlock di level ${lesson.unlockLevel}`, 403)
    }

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
    // Verifikasi progress milik user ini
    const progress = await this.prisma.userProgress.findFirst({
      where: { id: data.progressId, userId: data.userId }
    })
    if (!progress) throw new AppError('Progress tidak ditemukan', 404)

    // Ambil jawaban benar
    const question = await this.prisma.question.findUnique({
      where: { id: data.questionId }
    })
    if (!question) throw new AppError('Question tidak ditemukan', 404)

    const isCorrect = data.userAnswer.trim().toLowerCase() ===
      question.correctAnswer.trim().toLowerCase()

    // Kurangi heart kalau salah
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
      timeSpent: data.timeSpent
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

  // Cari progress langsung dari userId + lessonId (lebih aman)
  const progress = await this.prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } }
  })
  if (!progress) throw new AppError('Progress tidak ditemukan', 404)

  // Hitung score dari jawaban
  const answers = await this.prisma.userAnswer.findMany({
    where: { progressId: progress.id }
  })

  const totalQuestions = answers.length
  const correctAnswers = answers.filter(a => a.isCorrect).length
  const score = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0

  // Hitung XP
  let xpEarned = lesson.xpReward
  if (score === 100) xpEarned = Math.round(lesson.xpReward * 1.5)

  // Update progress
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

  // Award XP ke user
  await this.prisma.user.update({
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

  // Update streak
  await this.updateStreak(userId)

  return {
    score,
    xpEarned,
    correctAnswers,
    totalQuestions,
    isPerfect: score === 100
  }
}

  private async updateStreak(userId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) return

    const lastActive = user.lastActiveDate
      ? new Date(user.lastActiveDate)
      : null

    if (lastActive) lastActive.setHours(0, 0, 0, 0)

    const isToday = lastActive?.getTime() === today.getTime()
    if (isToday) return // Sudah aktif hari ini

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = lastActive?.getTime() === yesterday.getTime()

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: isYesterday ? { increment: 1 } : 1,
        longestStreak: isYesterday
          ? { set: Math.max(user.longestStreak, user.currentStreak + 1) }
          : undefined,
        lastActiveDate: today
      }
    })
  }
}