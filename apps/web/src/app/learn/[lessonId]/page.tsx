'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { useGameStore } from '@/stores/gameStore'
import { useLangStore } from '@/stores/langStore'
import { t } from '@/lib/i18n'
import api from '@/lib/api'

interface Question {
  id: string
  type: string
  prompt: string
  options: string[] | null
  order: number
}

type AnswerState = 'idle' | 'correct' | 'wrong'

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = params.lessonId as string
  const { user, setUser } = useAuthStore()
  const { lang } = useLangStore()
  const { setLesson, nextQuestion, addAnswer, resetGame, decrementHeart, currentQuestionIndex } = useGameStore()

  const [lesson, setLessonData] = useState<any>(null)
  const [progressId, setProgressId] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [explanation, setExplanation] = useState<string | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [noHeartsWarning, setNoHeartsWarning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [startTime, setStartTime] = useState(Date.now())
  const [currentHearts, setCurrentHearts] = useState(user?.hearts || 5)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    setCurrentHearts(user.hearts)
    initLesson()
  }, [lessonId])

  const initLesson = async () => {
    try {
      const lessonRes = await api.get(`/api/v1/lessons/${lessonId}`)
      const lessonData = lessonRes.data.lesson
      setLessonData(lessonData)

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
      router.push('/learn')
    } finally {
      setIsLoading(false)
    }
  }

  const completeLesson = async (pId: string) => {
    try {
      const res = await api.post(`/api/v1/lessons/${lessonId}/complete`, { progressId: pId })
      setResult(res.data)
      setIsFinished(true)
      if (user) setUser({ ...user, xp: user.xp + res.data.xpEarned })
    } catch (err) {
      resetGame()
      router.push('/learn')
    }
  }

  const currentQuestion = lesson?.questions[currentQuestionIndex]
  const totalQuestions = lesson?.questions.length || 0
  const progress = totalQuestions > 0 ? (currentQuestionIndex / totalQuestions) * 100 : 0

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
        const newHearts = currentHearts - 1
        setCurrentHearts(newHearts)
        decrementHeart()
        if (user) setUser({ ...user, hearts: newHearts })

        if (newHearts <= 0) {
          // Show warning dulu, baru complete
          setNoHeartsWarning(true)
          setTimeout(async () => {
            await completeLesson(progressId)
          }, 2500)
          return
        }
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
      await completeLesson(progressId!)
    } else {
      nextQuestion()
    }
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ fontSize: '56px' }}>
          📚
        </motion.div>
      </div>
    )
  }

  // No hearts warning overlay
  if (noHeartsWarning && !isFinished) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--red)',
            borderRadius: '24px',
            padding: '48px 40px',
            textAlign: 'center',
            maxWidth: '380px',
            width: '100%',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
          }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '64px', marginBottom: '20px' }}
          >
            💔
          </motion.div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--red)',
            marginBottom: '8px',
          }}>
            {t(lang, 'noHearts')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
            {t(lang, 'noHeartsDesc')}
          </p>
          <div style={{
            marginTop: '20px',
            fontSize: '13px',
            color: 'var(--text-subtle)',
            fontWeight: 600,
          }}>
            {lang === 'id' ? 'Menghitung hasil...' : 'Calculating results...'}
          </div>
        </motion.div>
      </div>
    )
  }

  // Result screen
  if (isFinished && result) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: '24px',
            padding: '48px 40px',
            textAlign: 'center',
            maxWidth: '380px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <motion.div
            animate={{ rotate: result.isPerfect ? [0, -10, 10, -5, 5, 0] : 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: '64px', marginBottom: '20px' }}
          >
            {result.isPerfect ? '🏆' : '🎉'}
          </motion.div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '6px',
            letterSpacing: '-0.5px',
          }}>
            {result.isPerfect ? t(lang, 'perfect') : t(lang, 'lessonDone')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '28px' }}>
            {result.correctAnswers} {lang === 'id' ? 'dari' : 'of'} {result.totalQuestions} {t(lang, 'correctAnswers')}
          </p>

          {/* Score */}
          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: 800,
              color: result.score >= 70 ? 'var(--green)' : result.score >= 50 ? 'var(--yellow)' : 'var(--red)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-2px',
            }}>
              {result.score}%
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
              {t(lang, 'score')}
            </div>
          </div>

          {/* XP */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            style={{
              background: 'var(--yellow-light)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '28px',
            }}
          >
            <div style={{
              fontSize: '28px',
              fontWeight: 800,
              color: 'var(--yellow)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.5px',
            }}>
              +{result.xpEarned} XP
            </div>
            {result.isPerfect && (
              <div style={{ fontSize: '12px', color: 'var(--yellow)', fontWeight: 700, marginTop: '2px' }}>
                {t(lang, 'perfectBonus')}
              </div>
            )}
          </motion.div>

          <motion.button
            onClick={() => { resetGame(); router.push('/learn') }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--green)',
              color: 'white',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              boxShadow: 'var(--shadow-green)',
              letterSpacing: '-0.2px',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {t(lang, 'backToDashboard')}
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={() => { resetGame(); router.push('/learn') }}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1.5px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Progress bar */}
        <div style={{
          flex: 1,
          background: 'var(--bg-subtle)',
          borderRadius: '99px',
          height: '8px',
          overflow: 'hidden',
        }}>
          <motion.div
            style={{ height: '100%', background: 'var(--green)', borderRadius: '99px' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Hearts */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'var(--red-light)',
          padding: '5px 10px',
          borderRadius: '8px',
        }}>
          <span>❤️</span>
          <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
            {currentHearts}
          </span>
        </div>
      </div>

      {/* Question area */}
      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
        padding: '40px 24px 120px',
      }}>
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <p style={{
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--text-subtle)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '16px',
                fontFamily: 'var(--font-display)',
              }}>
                {t(lang, 'question')} {currentQuestionIndex + 1} {t(lang, 'of')} {totalQuestions}
              </p>

              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--text)',
                lineHeight: 1.4,
                marginBottom: '32px',
                letterSpacing: '-0.3px',
              }}>
                {currentQuestion.prompt}
              </h2>

              {/* Options */}
              {currentQuestion.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(JSON.parse(currentQuestion.options as any) as string[]).map((option, i) => {
                    const isSelected = selectedAnswer === option
                    const isCorrectOption = answerState === 'wrong' && option === correctAnswer

                    let borderColor = 'var(--border)'
                    let bg = 'var(--bg-card)'
                    let color = 'var(--text)'

                    if (answerState !== 'idle') {
                      if (isSelected && answerState === 'correct') {
                        borderColor = 'var(--green)'
                        bg = 'var(--green-light)'
                        color = 'var(--green-dark)'
                      } else if (isSelected && answerState === 'wrong') {
                        borderColor = 'var(--red)'
                        bg = 'var(--red-light)'
                        color = 'var(--red)'
                      } else if (isCorrectOption) {
                        borderColor = 'var(--green)'
                        bg = 'var(--green-light)'
                        color = 'var(--green-dark)'
                      } else {
                        borderColor = 'var(--border)'
                        bg = 'var(--bg-subtle)'
                        color = 'var(--text-subtle)'
                      }
                    }

                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleAnswer(option)}
                        disabled={answerState !== 'idle'}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '16px 20px',
                          borderRadius: '14px',
                          border: `2px solid ${borderColor}`,
                          background: bg,
                          color: color,
                          fontSize: '15px',
                          fontWeight: 700,
                          cursor: answerState === 'idle' ? 'pointer' : 'default',
                          fontFamily: 'var(--font-body)',
                          transition: 'all 0.15s',
                        }}
                        whileTap={answerState === 'idle' ? { scale: 0.99 } : {}}
                        whileHover={answerState === 'idle' ? { borderColor: 'var(--green)', y: -1 } : {}}
                      >
                        {option}
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {/* Text input */}
              {!currentQuestion.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    id="text-answer"
                    type="text"
                    placeholder={t(lang, 'typeAnswer')}
                    disabled={answerState !== 'idle'}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      border: '2px solid var(--border)',
                      background: 'var(--bg-card)',
                      color: 'var(--text)',
                      fontSize: '15px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--green)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && answerState === 'idle') {
                        handleAnswer((e.target as HTMLInputElement).value)
                      }
                    }}
                  />
                  {answerState === 'idle' && (
                    <motion.button
                      onClick={() => {
                        const input = document.getElementById('text-answer') as HTMLInputElement
                        if (input?.value) handleAnswer(input.value)
                      }}
                      style={{
                        padding: '14px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'var(--green)',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '15px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-display)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t(lang, 'submit')}
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback bar */}
      <AnimatePresence>
        {answerState !== 'idle' && !noHeartsWarning && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px 24px',
              background: answerState === 'correct' ? 'var(--green-light)' : 'var(--red-light)',
              borderTop: `2px solid ${answerState === 'correct' ? 'var(--green-muted)' : 'var(--red)'}`,
            }}
          >
            <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '17px',
                  color: answerState === 'correct' ? 'var(--green-dark)' : 'var(--red)',
                  marginBottom: '2px',
                }}>
                  {answerState === 'correct' ? t(lang, 'correct') : t(lang, 'wrong')}
                </p>
                {explanation && (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{explanation}</p>
                )}
                {correctAnswer && (
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginTop: '2px' }}>
                    {t(lang, 'answer')}: {correctAnswer}
                  </p>
                )}
              </div>

              <motion.button
                onClick={handleNext}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: answerState === 'correct' ? 'var(--green)' : 'var(--red)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
                whileTap={{ scale: 0.97 }}
              >
                {currentQuestionIndex + 1 >= totalQuestions ? t(lang, 'finish') : t(lang, 'next')}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}