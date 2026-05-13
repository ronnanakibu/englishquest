export type Lang = 'id' | 'en'

export const translations = {
  id: {
    // Landing
    tagline: 'Belajar Bahasa Inggris',
    taglineAccent: 'Sambil Bermain',
    taglineDesc: 'Kuasai bahasa Inggris dengan cara yang menyenangkan. Streak, XP, dan achievement menanti!',
    startFree: 'Mulai Gratis →',
    freeForever: 'Gratis selamanya · Tanpa kartu kredit',
    login: 'Masuk',
    getStarted: 'Mulai',
    readyToLearn: 'Siap mulai belajar?',
    joinDesc: 'Bergabung dengan ribuan pelajar yang sudah merasakan manfaatnya.',
    registerNow: 'Daftar Sekarang',
    
    // Features
    dailyStreak: 'Daily Streak',
    dailyStreakDesc: 'Belajar setiap hari dan pertahankan streak-mu! Semakin panjang streak, semakin besar bonus XP.',
    xpLevel: 'XP & Level',
    xpLevelDesc: 'Kumpulkan XP dan naik level dengan setiap lesson yang kamu selesaikan.',
    achievement: 'Achievement',
    achievementDesc: 'Raih berbagai achievement tersembunyi dan tunjukkan kemampuanmu!',

    // Auth
    welcomeBack: 'Selamat Datang!',
    loginSubtitle: 'Masuk untuk lanjut belajar',
    createAccount: 'Buat Akun',
    registerSubtitle: 'Mulai perjalanan belajarmu!',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    loginBtn: 'Masuk',
    registerBtn: 'Daftar Sekarang',
    noAccount: 'Belum punya akun?',
    hasAccount: 'Sudah punya akun?',
    registerLink: 'Daftar Gratis',
    loginLink: 'Masuk',
    loginFailed: 'Email atau password salah',
    registerFailed: 'Registrasi gagal',

    // Dashboard
    greeting: 'Halo',
    levelInfo: 'lesson selesai',
    lessonsAvailable: 'Lessons Tersedia',
    questions: 'soal',
    logout: 'Keluar',
    nextLevel: 'Level berikutnya',

    // Lesson
    question: 'Soal',
    of: 'dari',
    correct: '✓ Benar!',
    wrong: '✗ Salah!',
    answer: 'Jawaban',
    next: 'Lanjut',
    finish: 'Selesai',
    typeAnswer: 'Ketik jawabanmu...',
    submit: 'Jawab',

    // Result
    lessonDone: 'Lesson Selesai!',
    perfect: 'Sempurna!',
    correctAnswers: 'jawaban benar',
    score: 'Score',
    perfectBonus: '🌟 Perfect Score Bonus!',
    backToDashboard: 'Kembali ke Dashboard',

    // Heart warning
    noHearts: 'Nyawa Habis!',
    noHeartsDesc: 'Kamu kehabisan nyawa. Lesson selesai lebih awal.',
  },
  en: {
    // Landing
    tagline: 'Learn English',
    taglineAccent: 'While Having Fun',
    taglineDesc: 'Master English the fun way. Streaks, XP, and achievements await!',
    startFree: 'Start Free →',
    freeForever: 'Free forever · No credit card',
    login: 'Log In',
    getStarted: 'Get Started',
    readyToLearn: 'Ready to start learning?',
    joinDesc: 'Join thousands of learners who are already seeing results.',
    registerNow: 'Sign Up Now',

    // Features
    dailyStreak: 'Daily Streak',
    dailyStreakDesc: 'Learn every day and keep your streak alive! Longer streaks mean bigger XP bonuses.',
    xpLevel: 'XP & Level',
    xpLevelDesc: 'Earn XP and level up with every lesson you complete.',
    achievement: 'Achievements',
    achievementDesc: 'Unlock hidden achievements and show off your skills!',

    // Auth
    welcomeBack: 'Welcome Back!',
    loginSubtitle: 'Log in to continue learning',
    createAccount: 'Create Account',
    registerSubtitle: 'Start your learning journey!',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    loginBtn: 'Log In',
    registerBtn: 'Create Account',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    registerLink: 'Sign Up Free',
    loginLink: 'Log In',
    loginFailed: 'Invalid email or password',
    registerFailed: 'Registration failed',

    // Dashboard
    greeting: 'Hello',
    levelInfo: 'lessons done',
    lessonsAvailable: 'Available Lessons',
    questions: 'questions',
    logout: 'Log Out',
    nextLevel: 'Next level',

    // Lesson
    question: 'Question',
    of: 'of',
    correct: '✓ Correct!',
    wrong: '✗ Wrong!',
    answer: 'Answer',
    next: 'Continue',
    finish: 'Finish',
    typeAnswer: 'Type your answer...',
    submit: 'Submit',

    // Result
    lessonDone: 'Lesson Complete!',
    perfect: 'Perfect!',
    correctAnswers: 'correct answers',
    score: 'Score',
    perfectBonus: '🌟 Perfect Score Bonus!',
    backToDashboard: 'Back to Dashboard',

    // Heart warning
    noHearts: 'Out of Hearts!',
    noHeartsDesc: "You've run out of hearts. Lesson ended early.",
  }
}

export function t(lang: Lang, key: keyof typeof translations['id']): string {
  return translations[lang][key] || translations['id'][key]
}