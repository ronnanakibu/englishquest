import { FastifyInstance } from 'fastify'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'
import { authenticate } from '../../shared/middleware/auth.middleware'

export async function aiRoutes(fastify: FastifyInstance) {
  fastify.post('/explain', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const { prompt, correctAnswer, userAnswer } = request.body as any

      // Ambil API key secara dinamis dari env saat request masuk
      const groqKey = process.env.GROQ_API_KEY
      const geminiKey = process.env.GEMINI_API_KEY

      // Validasi darurat jika kedua key terlupa di-input di cloud env
      if (!groqKey && !geminiKey) {
        request.log.error('API Keys untuk AI tidak ditemukan di environment variables!')
        return reply.status(500).send({ error: 'Konfigurasi server AI belum lengkap.' })
      }

      let aiPrompt = ''

      if (userAnswer) {
        // Mode Evaluasi (User jawab salah)
        aiPrompt = `
          You are an encouraging and fun English teacher. Your student answered a question incorrectly.
          Question: "${prompt}"
          Correct Answer: "${correctAnswer}"
          Student's Answer: "${userAnswer}"
          Task: Explain briefly (maximum 3 sentences) why the student's answer is incorrect and why the correct answer is right. You MUST respond completely in English using a friendly, supportive tone.
        `
      } else {
        // Mode Hint (User minta petunjuk sebelum menjawab)
        aiPrompt = `
          You are an encouraging and fun English teacher. Your student is confused about how to answer this question:
          Question: "${prompt}"
          Task: Provide a brief hint (maximum 3 sentences) to guide the student toward the right answer. Do NOT give away the direct answer under any circumstances. You MUST respond completely in English using a friendly, casual tone.
        `
      }

      let explanation = '';

      // 1. UTAMAKAN GROQ DULU (Jika key tersedia)
      if (groqKey) {
        try {
          console.log("=== MEMULAI MENEMBAK GROQ LOKAL ===");
          const groq = new Groq({ apiKey: groqKey })

          const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: aiPrompt }],
            model: 'llama-3.1-8b-instant',
          });

          explanation = chatCompletion.choices[0]?.message?.content || '';

          console.log("=== RESPONS DARI GROQ SUKSES ===");
          console.log("Isi penjelasan AI:", explanation);

          request.log.info('Berhasil mendapatkan respons dari Groq API');
          return reply.send({ success: true, explanation })
        } catch (groqError: any) {
          console.error("=== GROQ ERROR DI SINI ===");
          console.error(groqError?.message || groqError);
          request.log.warn({ err: groqError }, 'Groq API gagal, mencoba fallback ke Gemini API...');
        }
      }

      // 2. FALLBACK KE GEMINI JIKA GROQ GAGAL ATAU KEY TIDAK ADA
      if (geminiKey) {
        try {
          console.log("=== MEMULAI MENEMBAK GEMINI LOKAL ===");
          console.log("Prompt yang dikirim ke AI:", aiPrompt);

          const genAI = new GoogleGenerativeAI(geminiKey)
          const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
          const result = await model.generateContent(aiPrompt);

          // Membaca dengan cara yang lebih aman
          const response = await result.response;
          explanation = response.text();

          console.log("=== RESPONS DARI GEMINI SUKSES ===");
          console.log("Isi penjelasan AI:", explanation);

          return reply.send({ success: true, explanation })
        } catch (geminiError: any) {
          console.error("=== GEMINI ERROR DI SINI ===");
          console.error(geminiError);
          request.log.error({ err: geminiError }, 'Gemini API Fallback gagal');
        }
      }

      // Jika sampai baris ini tapi explanation masih kosong, berarti kedua AI gagal merespon
      throw new Error('Seluruh penyedia layanan AI (Groq & Gemini) gagal memproses permintaan.')

    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ error: 'Gagal mendapatkan penjelasan dari AI Tutor (Semua API Error)' })
    }
  })
}