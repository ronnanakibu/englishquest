// apps/api/src/modules/ai/ai.route.ts
import { FastifyInstance } from 'fastify'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'
import { authenticate } from '../../shared/middleware/auth.middleware'

// Inisialisasi API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' }) // <-- Inisialisasi Groq

export async function aiRoutes(fastify: FastifyInstance) {
  fastify.post('/explain', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const { prompt, correctAnswer, userAnswer } = request.body as any
      
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

      let explanation = '';

      try {
        // 1. UTAMAKAN GROQ DULU
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: aiPrompt }],
          model: 'llama3-8b-8192', // Kamu bisa ganti sesuai kebutuhan (misal: llama3-70b-8192 atau mixtral-8x7b-32768)
        });
        
        explanation = chatCompletion.choices[0]?.message?.content || '';
        request.log.info('Berhasil mendapatkan respons dari Groq API');
        
      } catch (groqError) {
        request.log.warn({ err: groqError }, 'Groq API gagal, mencoba fallback ke Gemini API...');
        
        // 2. FALLBACK KE GEMINI JIKA GROQ GAGAL
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(aiPrompt);
        explanation = result.response.text();
        request.log.info('Berhasil mendapatkan respons dari Gemini API (Fallback)');
      }

      return reply.send({ success: true, explanation })
    } catch (error) {
      // Masuk ke sini HANYA JIKA Groq gagal DAN Gemini juga gagal
      request.log.error(error)
      return reply.status(500).send({ error: 'Gagal mendapatkan penjelasan dari AI Tutor (Semua API Error)' })
    }
  })
}