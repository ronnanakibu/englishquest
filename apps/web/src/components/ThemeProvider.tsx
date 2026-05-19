'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from '@/stores/themeStore'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement

    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.setAttribute('data-theme', isDark ? 'dark' : 'light')

      const listener = (e: MediaQueryListEvent) => {
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light')
      }
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', listener)
      return () => mq.removeEventListener('change', listener)
    } else {
      root.setAttribute('data-theme', theme)
    }
  }, [theme, mounted])

  // Inject script di head untuk set theme sebelum hydration (prevent flash)
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var stored = localStorage.getItem('theme-storage');
                var theme = stored ? JSON.parse(stored).state?.theme : 'system';
                if (theme === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else if (theme === 'light') {
                  document.documentElement.setAttribute('data-theme', 'light');
                } else {
                  var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                }
              } catch(e) {}
            })();
          `
        }}
      />
      {children}
    </>
  )
}