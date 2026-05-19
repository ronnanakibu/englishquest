// apps/api/src/modules/ai/ai.route.ts
import { FastifyInstance } from 'fastify'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { authenticate } from '../../shared/middleware/auth.middleware'

// Inisialisasi Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function aiRoutes(fastify: FastifyInstance) {
  fastify.post('/explain', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const { prompt, correctAnswer, userAnswer } = request.body as any
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      let aiPrompt = ''
      
      if (userAnswer) {
        // Mode Evaluasi (User jawab salah)
        aiPrompt = `
          Kamu adalah guru bahasa Inggris yang asyik. Muridmu salah menjawab soal.
          Soal: "${prompt}"
          Jawaban Benar: "${correctAnswer}"
          Jawaban Murid: "${userAnswer}"
          Tugas: Jelaskan dengan singkat (maksimal 3 kalimat) kenapa jawaban murid salah dan alasan jawaban yang benar. Gunakan bahasa Indonesia yang santai.
        `
      } else {
        // Mode Hint (User minta petunjuk sebelum menjawab)
        aiPrompt = `
          Kamu adalah guru bahasa Inggris yang asyik. Muridmu kebingungan menjawab soal ini:
          Soal: "${prompt}"
          Tugas: Berikan petunjuk (hint) singkat untuk membantu murid menjawab, tapi DILARANG KERAS memberikan jawaban langsungnya. Gunakan bahasa Indonesia yang santai.
        `
      }

      const result = await model.generateContent(aiPrompt)
      const response = await result.response
      const explanation = response.text()

      return reply.send({ success: true, explanation })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ error: 'Gagal mendapatkan penjelasan dari AI Tutor' })
    }
  })
}