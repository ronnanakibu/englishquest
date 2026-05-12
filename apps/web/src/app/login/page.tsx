'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(form.email, form.password)
      router.push('/learn')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login gagal')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <span className="text-3xl">🌍</span>
            <span className="text-xl font-black text-green-600">EnglishQuest</span>
          </Link>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-7">
            <div className="text-5xl mb-3">👋</div>
            <h1 className="text-2xl font-black text-gray-800">Selamat Datang!</h1>
            <p className="text-gray-400 text-sm mt-1">Login untuk lanjut belajar</p>
          </div>

          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm mb-5 text-center font-semibold"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-green-400 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-green-400 focus:bg-white transition-all"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3.5 rounded-2xl transition-all shadow-md shadow-green-100 mt-2"
              whileTap={{ scale: 0.97 }}
            >
              {isLoading ? '⏳ Loading...' : 'Log In'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Belum punya akun?{' '}
            <Link href="/register" className="text-green-500 font-black hover:underline">
              Daftar Gratis
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}