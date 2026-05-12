import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Lesson 1 — Vocabulary Beginner
  const lesson1 = await prisma.lesson.create({
    data: {
      title: 'Basic Greetings',
      description: 'Learn common English greetings and introductions.',
      category: 'VOCABULARY',
      difficulty: 'BEGINNER',
      order: 1,
      xpReward: 20,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'What does "Hello" mean in Indonesian?',
            options: JSON.stringify(['Selamat tinggal', 'Halo / Hai', 'Terima kasih', 'Maaf']),
            correctAnswer: 'Halo / Hai',
            explanation: '"Hello" adalah salam yang paling umum dalam bahasa Inggris.',
            order: 1,
            difficulty: 1
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'How do you say "Selamat pagi" in English?',
            options: JSON.stringify(['Good night', 'Good afternoon', 'Good morning', 'Good evening']),
            correctAnswer: 'Good morning',
            explanation: '"Good morning" digunakan untuk menyapa di pagi hari.',
            order: 2,
            difficulty: 1
          },
          {
            type: 'FILL_BLANK',
            prompt: 'Complete: "Nice to ___ you!" (Senang bertemu denganmu)',
            options: JSON.stringify(['meet', 'see', 'know', 'find']),
            correctAnswer: 'meet',
            explanation: '"Nice to meet you" adalah ungkapan saat pertama kali bertemu seseorang.',
            order: 3,
            difficulty: 1
          },
          {
            type: 'TRANSLATE',
            prompt: 'Translate to English: "Apa kabar?"',
            options: JSON.stringify(['How are you?', 'Who are you?', 'Where are you?', 'What are you?']),
            correctAnswer: 'How are you?',
            explanation: '"How are you?" digunakan untuk menanyakan kabar seseorang.',
            order: 4,
            difficulty: 1
          },
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'What is the correct response to "How are you?"',
            options: JSON.stringify(["I'm fine, thank you!", 'Yes, please.', 'My name is John.', 'See you later.']),
            correctAnswer: "I'm fine, thank you!",
            explanation: '"I\'m fine, thank you!" adalah jawaban standar untuk "How are you?"',
            order: 5,
            difficulty: 1
          }
        ]
      }
    }
  })

  // Lesson 2 — Grammar Beginner
  const lesson2 = await prisma.lesson.create({
    data: {
      title: 'Simple Present Tense',
      description: 'Master the basics of Simple Present Tense.',
      category: 'GRAMMAR',
      difficulty: 'BEGINNER',
      order: 2,
      xpReward: 25,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          {
            type: 'MULTIPLE_CHOICE',
            prompt: 'Which sentence is correct?',
            options: JSON.stringify(['She go to school.', 'She goes to school.', 'She going to school.', 'She gone to school.']),
            correctAnswer: 'She goes to school.',
            explanation: 'Subject orang ketiga tunggal (he/she/it) ditambah -s/-es pada verb.',
            order: 1,
            difficulty: 2
          },
          {
            type: 'FILL_BLANK',
            prompt: 'They ___ football every weekend. (main)',
            options: JSON.stringify(['plays', 'play', 'playing', 'played']),
            correctAnswer: 'play',
            explanation: 'Subject "They" (plural) menggunakan verb tanpa -s.',
            order: 2,
            difficulty: 2
          },
          {
            type: 'ERROR_DETECT',
            prompt: 'Find the error: "He don\'t like coffee."',
            options: JSON.stringify(['He', "don't", 'like', 'coffee']),
            correctAnswer: "don't",
            explanation: 'Untuk he/she/it, gunakan "doesn\'t" bukan "don\'t".',
            order: 3,
            difficulty: 2
          },
          {
            type: 'REARRANGE',
            prompt: 'Rearrange: [every / she / reads / day / books]',
            options: JSON.stringify(['every', 'she', 'reads', 'day', 'books']),
            correctAnswer: 'she reads books every day',
            explanation: 'Struktur: Subject + Verb + Object + Time',
            order: 4,
            difficulty: 3
          },
          {
            type: 'TRANSLATE',
            prompt: 'Translate: "Dia tidak suka makan sayur."',
            options: JSON.stringify([
              'He doesn\'t like eating vegetables.',
              'He don\'t like eating vegetables.',
              'He not like eating vegetables.',
              'He isn\'t like eating vegetables.'
            ]),
            correctAnswer: 'He doesn\'t like eating vegetables.',
            explanation: 'Gunakan "doesn\'t" untuk negasi he/she/it dalam Simple Present.',
            order: 5,
            difficulty: 3
          }
        ]
      }
    }
  })

  // Achievements
  await prisma.achievement.createMany({
    data: [
      {
        code: 'FIRST_LESSON',
        title: 'First Step!',
        description: 'Complete your first lesson.',
        xpReward: 50,
        isHidden: false,
        condition: JSON.stringify({ type: 'lesson_complete', value: 1 })
      },
      {
        code: 'LESSON_10',
        title: 'On a Roll!',
        description: 'Complete 10 lessons.',
        xpReward: 100,
        isHidden: false,
        condition: JSON.stringify({ type: 'lesson_complete', value: 10 })
      },
      {
        code: 'STREAK_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak.',
        xpReward: 150,
        isHidden: false,
        condition: JSON.stringify({ type: 'streak', value: 7 })
      },
      {
        code: 'STREAK_30',
        title: 'Monthly Master',
        description: 'Maintain a 30-day streak.',
        xpReward: 500,
        isHidden: false,
        condition: JSON.stringify({ type: 'streak', value: 30 })
      },
      {
        code: 'PERFECT_SCORE',
        title: 'Perfectionist',
        description: 'Get a perfect score on any lesson.',
        xpReward: 75,
        isHidden: false,
        condition: JSON.stringify({ type: 'perfect_score', value: 1 })
      },
      {
        code: 'HIDDEN_NIGHT_OWL',
        title: 'Night Owl',
        description: '???',
        xpReward: 50,
        isHidden: true,
        condition: JSON.stringify({ type: 'study_hour', value: 23 })
      }
    ]
  })

  console.log('✅ Seed complete!')
  console.log(`   Lessons: 2`)
  console.log(`   Achievements: 6`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())