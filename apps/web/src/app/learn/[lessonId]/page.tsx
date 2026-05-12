'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { useGameStore } from '@/stores/gameStore'
import api from '@/lib/api'

interface Question {
  id: string
  type: string
  prompt: string
  options: string[] | null
  order: number
  difficulty: number
}

interface Lesson {
  id: string
  title: string
  category: string
  xpReward: number
  questions: Question[]
}

type AnswerState = 'idle' | 'correct' | 'wrong'

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = params.lessonId as string
  const { user, setUser } = useAuthStore()

  const {
    currentLesson, currentQuestionIndex,
    setLesson, nextQuestion, addAnswer,
    resetGame, decrementHeart
  } = useGameStore()

  const [lesson, setLessonData] = useState<Lesson | null>(null)
  const [progressId, setProgressId] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [explanation, setExplanation] = useState<string | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [startTime, setStartTime] = useState(Date.now())

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    initLesson()
  }, [lessonId])

  const initLesson = async () => {
    try {
      // Load lesson detail
      const lessonRes = await api.get(`/api/v1/lessons/${lessonId}`)
      const lessonData = lessonRes.data.lesson
      setLessonData(lessonData)

      // Start progress
      const startRes = await api.post(`/api/v1/lessons/${lessonId}/start`, {})
      setProgressId(startRes.data.progressId)

      setLesson({
        id: lessonData.id,
        title: lessonData.title,
        questions: lessonData.questions,
        progressId: startRes.data.progressId
      })

      setStartTime(Date.now())
    } catch (err) {
      console.error(err)
      router.push('/learn')
    } finally {
      setIsLoading(false)
    }
  }

  const currentQuestion = lesson?.questions[currentQuestionIndex]
  const totalQuestions = lesson?.questions.length || 0
  const progress = totalQuestions > 0 ? ((currentQuestionIndex) / totalQuestions) * 100 : 0

  const handleAnswer = async (answer: string) => {
    if (answerState !== 'idle' || !currentQuestion || !progressId) return

    setSelectedAnswer(answer)
    const timeSpent = Date.now() - startTime

    try {
      const res = await api.post(`/api/v1/lessons/${lessonId}/answer`, {
        progressId,
        questionId: currentQuestion.id,
        userAnswer: answer,
        timeSpent
      })

      const { isCorrect, explanation: exp, correctAnswer: correct } = res.data

      setAnswerState(isCorrect ? 'correct' : 'wrong')
      setExplanation(exp || null)
      setCorrectAnswer(correct || null)

      addAnswer({ questionId: currentQuestion.id, isCorrect, userAnswer: answer })

      if (!isCorrect) {
        decrementHeart()
        if (user) setUser({ ...user, hearts: Math.max(0, user.hearts - 1) })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleNext = async () => {
    setSelectedAnswer(null)
    setAnswerState('idle')
    setExplanation(null)
    setCorrectAnswer(null)
    setStartTime(Date.now())

    if (currentQuestionIndex + 1 >= totalQuestions) {
      // Complete lesson
      try {
        const res = await api.post(`/api/v1/lessons/${lessonId}/complete`, { progressId })
        setResult(res.data)
        setIsFinished(true)
        if (user) setUser({ ...user, xp: user.xp + res.data.xpEarned })
      } catch (err) {
        console.error(err)
      }
    } else {
      nextQuestion()
    }
  }

  const handleFinish = () => {
    resetGame()
    router.push('/learn')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-5xl animate-bounce">📚</div>
      </div>
    )
  }

  // Result screen
  if (isFinished && result) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">{result.isPerfect ? '🏆' : '🎉'}</div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">
            {result.isPerfect ? 'Sempurna!' : 'Lesson Selesai!'}
          </h1>
          <p className="text-gray-500 mb-6">
            {result.correctAnswers} dari {result.totalQuestions} jawaban benar
          </p>

          {/* Score */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="text-4xl font-black text-green-500 mb-1">{result.score}%</div>
            <div className="text-sm text-gray-500">Score</div>
          </div>

          {/* XP */}
          <motion.div
            className="bg-yellow-50 rounded-2xl p-4 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <div className="text-3xl font-black text-yellow-500">+{result.xpEarned} XP</div>
            {result.isPerfect && (
              <div className="text-xs text-yellow-600 mt-1">🌟 Perfect Score Bonus!</div>
            )}
          </motion.div>

          <motion.button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-colors"
            onClick={handleFinish}
            whileTap={{ scale: 0.97 }}
          >
            Kembali ke Dashboard
          </motion.button>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => { resetGame(); router.push('/learn') }}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>

          {/* Progress bar */}
          <div className="flex-1 bg-gray-100 rounded-full h-3">
            <motion.div
              className="bg-green-500 h-3 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1">
            <span>❤️</span>
            <span className="font-bold text-sm">{user?.hearts}</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              {/* Question number */}
              <p className="text-sm text-gray-400 font-semibold mb-4">
                Soal {currentQuestionIndex + 1} dari {totalQuestions}
              </p>

              {/* Prompt */}
              <h2 className="text-xl font-black text-gray-800 mb-8 leading-relaxed">
                {currentQuestion.prompt}
              </h2>

              {/* Options */}
              {currentQuestion.options && (
                <div className="space-y-3">
                  {(JSON.parse(currentQuestion.options as any) as string[]).map((option, i) => {
                    let optionStyle = 'border-2 border-gray-200 bg-white text-gray-700 hover:border-green-400'

                    if (answerState !== 'idle' && selectedAnswer === option) {
                      optionStyle = answerState === 'correct'
                        ? 'border-2 border-green-500 bg-green-50 text-green-700'
                        : 'border-2 border-red-400 bg-red-50 text-red-700'
                    } else if (answerState === 'wrong' && option === correctAnswer) {
                      optionStyle = 'border-2 border-green-500 bg-green-50 text-green-700'
                    } else if (answerState !== 'idle') {
                      optionStyle = 'border-2 border-gray-100 bg-gray-50 text-gray-400'
                    }

                    return (
                      <motion.button
                        key={i}
                        className={`w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all ${optionStyle}`}
                        onClick={() => handleAnswer(option)}
                        disabled={answerState !== 'idle'}
                        whileTap={answerState === 'idle' ? { scale: 0.98 } : {}}
                      >
                        {option}
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {/* Fill blank / Translate input */}
              {!currentQuestion.options && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Ketik jawabanmu..."
                    className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 font-semibold focus:outline-none focus:border-green-400 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && answerState === 'idle') {
                        handleAnswer((e.target as HTMLInputElement).value)
                      }
                    }}
                    disabled={answerState !== 'idle'}
                  />
                  {answerState === 'idle' && (
                    <button
                      className="w-full bg-green-500 text-white font-bold py-3 rounded-2xl"
                      onClick={(e) => {
                        const input = (e.currentTarget.previousElementSibling as HTMLInputElement)
                        handleAnswer(input.value)
                      }}
                    >
                      Jawab
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback bar */}
        <AnimatePresence>
          {answerState !== 'idle' && (
            <motion.div
              className={`fixed bottom-0 left-0 right-0 p-6 ${
                answerState === 'correct' ? 'bg-green-50 border-t-2 border-green-200' : 'bg-red-50 border-t-2 border-red-200'
              }`}
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
            >
              <div className="max-w-2xl mx-auto">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`font-black text-lg ${answerState === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                      {answerState === 'correct' ? '✓ Benar!' : '✗ Salah!'}
                    </p>
                    {explanation && (
                      <p className="text-sm text-gray-600 mt-1">{explanation}</p>
                    )}
                    {correctAnswer && (
                      <p className="text-sm font-semibold text-gray-700 mt-1">
                        Jawaban: {correctAnswer}
                      </p>
                    )}
                  </div>
                  <motion.button
                    className={`font-bold py-3 px-8 rounded-2xl text-white ${
                      answerState === 'correct' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-400 hover:bg-red-500'
                    }`}
                    onClick={handleNext}
                    whileTap={{ scale: 0.97 }}
                  >
                    {currentQuestionIndex + 1 >= totalQuestions ? 'Selesai' : 'Lanjut'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}