import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import api from '@/lib/api'

interface User {
  id: string
  email: string
  username: string
  role: string
  xp: number
  level: number
  hearts: number
  currentStreak: number
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  isHydrated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
  setHydrated: () => void
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),

      refreshUser: async () => {
        try {
          const res = await api.get('/api/v1/user/me')
          set({ user: res.data.user })
        } catch {}
      },

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/api/v1/auth/login', { email, password })
          const { accessToken, user } = res.data
          localStorage.setItem('accessToken', accessToken)
          set({ user, accessToken, isLoading: false })
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      register: async (email, username, password) => {
        set({ isLoading: true })
        try {
          await api.post('/api/v1/auth/register', { email, username, password })
          set({ isLoading: false })
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      logout: async () => {
        try {
          await api.post('/api/v1/auth/logout')
        } catch {}
        localStorage.removeItem('accessToken')
        set({ user: null, accessToken: null })
      },

      setUser: (user) => set({ user })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          localStorage.setItem('accessToken', state.accessToken)
        }
        state?.setHydrated()
      }
    }
  )
)