import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lang } from '@/lib/i18n'

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: 'id',
      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === 'id' ? 'en' : 'id' })
    }),
    { name: 'lang-storage' }
  )
)