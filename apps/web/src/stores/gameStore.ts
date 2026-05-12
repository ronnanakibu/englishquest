import { create } from 'zustand'

interface GameState {
  currentLesson: {
    id: string
    title: string
    questions: Question[]
    progressId: string
  } | null
  currentQuestionIndex: number
  answers: Answer[]
  hearts: number
  setLesson: (lesson: GameState['currentLesson']) => void
  nextQuestion: () => void
  addAnswer: (answer: Answer) => void
  resetGame: () => void
  decrementHeart: () => void
}

interface Question {
  id: string
  type: string
  prompt: string
  options: string[] | null
  order: number
}

interface Answer {
  questionId: string
  isCorrect: boolean
  userAnswer: string
}

export const useGameStore = create<GameState>((set) => ({
  currentLesson: null,
  currentQuestionIndex: 0,
  answers: [],
  hearts: 5,

  setLesson: (lesson) => set({ currentLesson: lesson, currentQuestionIndex: 0, answers: [] }),
  nextQuestion: () => set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),
  addAnswer: (answer) => set((state) => ({ answers: [...state.answers, answer] })),
  resetGame: () => set({ currentLesson: null, currentQuestionIndex: 0, answers: [], hearts: 5 }),
  decrementHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) }))
}))