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
    <>
      {/* Mobile-only styles */}
      <style>{`
        @media (max-width: 640px) {
          .navbar-logout { display: none !important; }
          .navbar-theme { display: none !important; }
          .navbar-xp { display: none !important; }
          .navbar-stat { padding: 4px 7px !important; font-size: 12px !important; }
          .navbar-stat span:first-child { font-size: 14px !important; }
          .navbar-brand-text { display: none !important; }
        }
      `}</style>

      <nav style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 16px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '22px' }}>🌍</span>
            <span className="navbar-brand-text" style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '17px',
              color: 'var(--green)',
              letterSpacing: '-0.5px',
            }}>EnglishQuest</span>
          </Link>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>

            {/* Stats (app mode) */}
            {variant === 'app' && stats && (
              <>
                <StatBadge className="navbar-stat" icon="🔥" value={stats.streak} color="var(--orange)" bg="var(--orange-light)" />
                <StatBadge className="navbar-stat navbar-xp" icon="⚡" value={`${stats.xp} XP`} color="var(--yellow)" bg="var(--yellow-light)" />
                <StatBadge className="navbar-stat" icon="❤️" value={stats.hearts} color="var(--red)" bg="var(--red-light)" />
              </>
            )}

            {/* Lang toggle */}
            <button
              onClick={toggleLang}
              style={{
                padding: '5px 9px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.5px',
                flexShrink: 0,
              }}
            >
              {lang === 'id' ? 'EN' : 'ID'}
            </button>

            {/* Theme toggle — hidden on mobile */}
            <button
              className="navbar-theme"
              onClick={cycleTheme}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg-subtle)',
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {themeIcon}
            </button>

            {/* Landing nav buttons */}
            {variant === 'landing' && (
              <>
                <Link href="/login">
                  <button style={{
                    padding: '7px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text)',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    whiteSpace: 'nowrap',
                  }}>
                    {lang === 'id' ? 'Masuk' : 'Log In'}
                  </button>
                </Link>
                <Link href="/register">
                  <button style={{
                    padding: '7px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--green)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    boxShadow: 'var(--shadow-green)',
                    whiteSpace: 'nowrap',
                  }}>
                    {lang === 'id' ? 'Mulai' : 'Get Started'}
                  </button>
                </Link>
              </>
            )}

            {/* Logout — hidden on mobile (ada di profile page) */}
            {variant === 'app' && onLogout && (
              <button
                className="navbar-logout"
                onClick={onLogout}
                style={{
                  padding: '5px 11px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {lang === 'id' ? 'Keluar' : 'Log Out'}
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

function StatBadge({ icon, value, color, bg, className }: {
  icon: string
  value: any
  color: string
  bg: string
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 9px',
        borderRadius: '8px',
        background: bg,
        color: color,
        fontWeight: 800,
        fontSize: '13px',
        fontFamily: 'var(--font-display)',
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: '15px' }}>{icon}</span>
      <span>{value}</span>
    </div>
  )
}
