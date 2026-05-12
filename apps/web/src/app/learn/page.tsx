'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'

interface Lesson {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  xpReward: number
  questionCount: number
  progress: { status: string; score: number } | null
}

export default function LearnPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    fetchLessons()
  }, [user])

  const fetchLessons = async () => {
    try {
      const res = await api.get('/api/v1/lessons')
      setLessons(res.data.lessons)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const getCategoryEmoji = (cat: string) => ({ VOCABULARY: '📚', GRAMMAR: '✏️', LISTENING: '🎧', READING: '📖', SPEAKING: '🎤' }[cat] || '📚')
  const getDifficultyStyle = (d: string) => ({ BEGINNER: 'text-green-600 bg-green-100', INTERMEDIATE: 'text-yellow-600 bg-yellow-100', ADVANCED: 'text-red-600 bg-red-100' }[d] || 'text-gray-600 bg-gray-100')

  const xpForNextLevel = (level: number) => Math.floor(100 * Math.pow(level, 2))
  const xpProgress = user ? Math.min(((user.xp % xpForNextLevel(user.level)) / xpForNextLevel(user.level)) * 100, 100) : 0

  const completedCount = lessons.filter(l => l.progress?.status === 'COMPLETED').length

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-6xl">🌍</motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b-2 border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <span className="font-black text-green-600 text-lg">EnglishQuest</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
              <span>🔥</span>
              <span className="font-black text-sm text-orange-600">{user?.currentStreak}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full">
              <span>⚡</span>
              <span className="font-black text-sm text-yellow-600">{user?.xp} XP</span>
            </div>
            <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-full">
              <span>❤️</span>
              <span className="font-black text-sm text-red-500">{user?.hearts}</span>
            </div>
            <button onClick={handleLogout} className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Welcome + Level */}
        <motion.div
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-green-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black">Halo, {user?.username}! 👋</h1>
              <p className="text-green-100 text-sm mt-0.5">Level {user?.level} · {completedCount} lesson selesai</p>
            </div>
            <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
              <div className="text-2xl font-black">{user?.level}</div>
              <div className="text-xs text-green-100">Level</div>
            </div>
          </div>
          {/* XP Bar */}
          <div>
            <div className="flex justify-between text-xs text-green-100 mb-1.5 font-semibold">
              <span>{user?.xp} XP</span>
              <span>Next: {xpForNextLevel(user?.level || 1)} XP</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5">
              <motion.div
                className="bg-white h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Lessons */}
        <div>
          <h2 className="text-lg font-black text-gray-800 mb-4">Lessons tersedia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map((lesson, i) => (
              <motion.div
                key={lesson.id}
                className="bg-white rounded-3xl p-5 border-2 border-gray-100 cursor-pointer hover:border-green-300 hover:shadow-lg hover:shadow-green-50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => router.push(`/learn/${lesson.id}`)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl bg-gray-50 p-2 rounded-2xl">{getCategoryEmoji(lesson.category)}</div>
                    <div>
                      <h3 className="font-black text-gray-800 text-sm">{lesson.title}</h3>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full mt-0.5 inline-block ${getDifficultyStyle(lesson.difficulty)}`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                  {lesson.progress?.status === 'COMPLETED' && (
                    <span className="text-xl">✅</span>
                  )}
                  {lesson.progress?.status === 'IN_PROGRESS' && (
                    <span className="text-xl">⏳</span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed line-clamp-2">{lesson.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-semibold">📝 {lesson.questionCount} soal</span>
                  <span className="text-xs font-black text-green-500 bg-green-50 px-2.5 py-1 rounded-full">+{lesson.xpReward} XP</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}