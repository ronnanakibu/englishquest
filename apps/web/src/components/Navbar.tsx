'use client'

import Link from 'next/link'
import { useThemeStore } from '@/stores/themeStore'
import { useLangStore } from '@/stores/langStore'

interface NavbarProps {
  variant?: 'landing' | 'app'
  stats?: {
    streak: number
    xp: number
    hearts: number
  }
  onLogout?: () => void
}

export default function Navbar({ variant = 'landing', stats, onLogout }: NavbarProps) {
  const { theme, setTheme } = useThemeStore()
  const { lang, toggleLang } = useLangStore()

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('system')
  }

  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🖥️'

  return (
    <nav style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🌍</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '18px',
            color: 'var(--green)',
            letterSpacing: '-0.5px'
          }}>EnglishQuest</span>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* Stats (app mode) */}
          {variant === 'app' && stats && (
            <>
              <StatBadge icon="🔥" value={stats.streak} color="var(--orange)" bg="var(--orange-light)" />
              <StatBadge icon="⚡" value={`${stats.xp} XP`} color="var(--yellow)" bg="var(--yellow-light)" />
              <StatBadge icon="❤️" value={stats.hearts} color="var(--red)" bg="var(--red-light)" />
            </>
          )}

          {/* Lang toggle */}
          <button
            onClick={toggleLang}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg-subtle)',
              color: 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.5px'
            }}
          >
            {lang === 'id' ? 'EN' : 'ID'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg-subtle)',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {themeIcon}
          </button>

          {/* Landing nav buttons */}
          {variant === 'landing' && (
            <>
              <Link href="/login">
                <button style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}>
                  {lang === 'id' ? 'Masuk' : 'Log In'}
                </button>
              </Link>
              <Link href="/register">
                <button style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--green)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  boxShadow: 'var(--shadow-green)',
                }}>
                  {lang === 'id' ? 'Mulai' : 'Get Started'}
                </button>
              </Link>
            </>
          )}

          {/* App logout */}
          {variant === 'app' && onLogout && (
            <button
              onClick={onLogout}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              {lang === 'id' ? 'Keluar' : 'Log Out'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

function StatBadge({ icon, value, color, bg }: { icon: string; value: any; color: string; bg: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '5px 10px',
      borderRadius: '8px',
      background: bg,
      color: color,
      fontWeight: 800,
      fontSize: '13px',
      fontFamily: 'var(--font-display)',
    }}>
      <span>{icon}</span>
      <span>{value}</span>
    </div>
  )
}