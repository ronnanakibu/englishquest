import { AppError } from '../../shared/errors/AppError'
import { LessonRepository } from './lesson.repository'

export class LessonService {
  constructor(private lessonRepo: LessonRepository) {}

  async getLessons(userId: string, userLevel: number) {
    return this.lessonRepo.findAll(userId, userLevel)
  }

  async getLessonDetail(id: string) {
    const lesson = await this.lessonRepo.findByIdPublished(id)
    if (!lesson) throw new AppError('Lesson tidak ditemukan', 404)

    // Jangan kirim correctAnswer ke frontend
    const questions = lesson.questions.map(q => ({
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      audioUrl: q.audioUrl,
      imageUrl: q.imageUrl,
      options: q.options,
      order: q.order,
      difficulty: q.difficulty
    }))

    return { ...lesson, questions }
  }
}