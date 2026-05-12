import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito'
})

export const metadata: Metadata = {
  title: 'EnglishQuest — Belajar Bahasa Inggris',
  description: 'Platform gamifikasi belajar bahasa Inggris interaktif',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-nunito`}>
        {children}
      </body>
    </html>
  )
}