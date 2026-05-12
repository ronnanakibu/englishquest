'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌍</span>
          <span className="text-xl font-black text-green-600 tracking-tight">EnglishQuest</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <button className="font-bold text-sm py-2.5 px-5 rounded-2xl border-2 border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-600 transition-all">
              Log In
            </button>
          </Link>
          <Link href="/register">
            <button className="font-bold text-sm py-2.5 px-5 rounded-2xl bg-green-500 text-white hover:bg-green-600 transition-all shadow-md shadow-green-200">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-16 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-8xl mb-6 inline-block"
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            🎯
          </motion.div>
          <h1 className="text-5xl font-black text-gray-800 mb-4 leading-tight">
            Belajar Bahasa Inggris<br />
            <span className="text-green-500">Sambil Bermain</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Kuasai bahasa Inggris dengan cara yang menyenangkan.<br/>
            Streak, XP, dan achievement menanti!
          </p>
          <Link href="/register">
            <motion.button
              className="bg-green-500 hover:bg-green-600 text-white font-black text-lg py-4 px-12 rounded-3xl shadow-lg shadow-green-200 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Mulai Gratis →
            </motion.button>
          </Link>
          <p className="text-sm text-gray-400 mt-4">Gratis selamanya · Tanpa kartu kredit</p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: '🔥', title: 'Daily Streak', desc: 'Belajar setiap hari dan pertahankan streak-mu! Semakin panjang streak, semakin besar bonus XP.', color: 'from-orange-50 to-red-50', border: 'border-orange-100' },
            { icon: '⚡', title: 'XP & Level', desc: 'Kumpulkan XP dan naik level dengan setiap lesson yang kamu selesaikan.', color: 'from-yellow-50 to-amber-50', border: 'border-yellow-100' },
            { icon: '🏆', title: 'Achievement', desc: 'Raih berbagai achievement tersembunyi dan tunjukkan kemampuanmu!', color: 'from-purple-50 to-indigo-50', border: 'border-purple-100' },
          ].map((f, i) => (
            <motion.div
              key={i}
              className={`bg-gradient-to-br ${f.color} border ${f.border} rounded-3xl p-6 text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="font-black text-lg text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="text-center pb-20 px-6">
        <div className="bg-green-500 max-w-2xl mx-auto rounded-3xl p-10 shadow-xl shadow-green-200">
          <h2 className="text-3xl font-black text-white mb-3">Siap mulai belajar?</h2>
          <p className="text-green-100 mb-6">Bergabung dengan ribuan pelajar yang sudah merasakan manfaatnya.</p>
          <Link href="/register">
            <button className="bg-white text-green-600 font-black py-3 px-10 rounded-2xl hover:bg-green-50 transition-all">
              Daftar Sekarang
            </button>
          </Link>
        </div>
      </section>
    </main>
  )
}