import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, '../.env') })
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.userAnswer.deleteMany()
  await prisma.userProgress.deleteMany()
  await prisma.userDailyChallenge.deleteMany()
  await prisma.dailyChallenge.deleteMany()
  await prisma.question.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.userAchievement.deleteMany()
  await prisma.achievement.deleteMany()

  console.log('🧹 Cleared existing data')

  // ─────────────────────────────────────────
  // UNIT 1: BEGINNER — Getting Started
  // ─────────────────────────────────────────

  await prisma.lesson.create({
    data: {
      title: 'Basic Greetings',
      description: 'Learn how to say hello and introduce yourself in English.',
      category: 'VOCABULARY',
      difficulty: 'BEGINNER',
      order: 1,
      xpReward: 20,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'What does "Hello" mean?', options: JSON.stringify(['Selamat tinggal', 'Halo / Hai', 'Terima kasih', 'Maaf']), correctAnswer: 'Halo / Hai', explanation: '"Hello" adalah salam paling umum dalam bahasa Inggris.', order: 1, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'How do you say "Selamat pagi"?', options: JSON.stringify(['Good night', 'Good afternoon', 'Good morning', 'Good evening']), correctAnswer: 'Good morning', explanation: '"Good morning" digunakan untuk menyapa di pagi hari.', order: 2, difficulty: 1 },
          { type: 'FILL_BLANK', prompt: 'Complete: "Nice to ___ you!"', options: JSON.stringify(['meet', 'see', 'know', 'find']), correctAnswer: 'meet', explanation: '"Nice to meet you" diucapkan saat pertama kali bertemu.', order: 3, difficulty: 1 },
          { type: 'TRANSLATE', prompt: 'Translate: "Apa kabar?"', options: JSON.stringify(['How are you?', 'Who are you?', 'Where are you?', 'What are you?']), correctAnswer: 'How are you?', explanation: '"How are you?" menanyakan kabar seseorang.', order: 4, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'What is the correct response to "How are you?"', options: JSON.stringify(["I'm fine, thank you!", 'Yes, please.', 'My name is John.', 'See you later.']), correctAnswer: "I'm fine, thank you!", explanation: 'Jawaban standar untuk "How are you?" adalah "I\'m fine, thank you!"', order: 5, difficulty: 1 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Numbers 1-20',
      description: 'Count and use numbers in everyday English conversation.',
      category: 'VOCABULARY',
      difficulty: 'BEGINNER',
      order: 2,
      xpReward: 20,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'How do you say "5" in English?', options: JSON.stringify(['Four', 'Six', 'Five', 'Three']), correctAnswer: 'Five', explanation: '"Five" adalah angka 5 dalam bahasa Inggris.', order: 1, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'What number is "twelve"?', options: JSON.stringify(['11', '13', '20', '12']), correctAnswer: '12', explanation: '"Twelve" adalah angka 12.', order: 2, difficulty: 1 },
          { type: 'TRANSLATE', prompt: 'Translate: "tujuh belas"', options: JSON.stringify(['Fifteen', 'Seventeen', 'Thirteen', 'Fourteen']), correctAnswer: 'Seventeen', explanation: '"Seventeen" adalah 17 dalam bahasa Inggris.', order: 3, difficulty: 2 },
          { type: 'FILL_BLANK', prompt: 'One, two, three, ___, five', options: JSON.stringify(['six', 'four', 'two', 'seven']), correctAnswer: 'four', explanation: 'Urutan angka: one, two, three, FOUR, five.', order: 4, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'How do you say "20"?', options: JSON.stringify(['Twelve', 'Two', 'Twenty', 'Two hundred']), correctAnswer: 'Twenty', explanation: '"Twenty" adalah angka 20.', order: 5, difficulty: 1 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Colors & Shapes',
      description: 'Learn the names of common colors and basic shapes.',
      category: 'VOCABULARY',
      difficulty: 'BEGINNER',
      order: 3,
      xpReward: 20,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'What color is "merah" in English?', options: JSON.stringify(['Blue', 'Green', 'Red', 'Yellow']), correctAnswer: 'Red', explanation: '"Red" adalah warna merah.', order: 1, difficulty: 1 },
          { type: 'TRANSLATE', prompt: 'Translate: "biru"', options: JSON.stringify(['Black', 'Blue', 'Brown', 'Beige']), correctAnswer: 'Blue', explanation: '"Blue" adalah warna biru.', order: 2, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'What shape is a "lingkaran" in English?', options: JSON.stringify(['Square', 'Triangle', 'Circle', 'Rectangle']), correctAnswer: 'Circle', explanation: '"Circle" adalah bentuk lingkaran.', order: 3, difficulty: 1 },
          { type: 'FILL_BLANK', prompt: 'The sky is ___.', options: JSON.stringify(['red', 'blue', 'green', 'yellow']), correctAnswer: 'blue', explanation: 'Langit berwarna biru, jadi "The sky is BLUE."', order: 4, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'What color is grass?', options: JSON.stringify(['Red', 'Blue', 'Green', 'Purple']), correctAnswer: 'Green', explanation: 'Rumput berwarna hijau / green.', order: 5, difficulty: 1 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Days & Months',
      description: 'Learn the days of the week and months of the year.',
      category: 'VOCABULARY',
      difficulty: 'BEGINNER',
      order: 4,
      xpReward: 25,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'What day comes after "Monday"?', options: JSON.stringify(['Sunday', 'Wednesday', 'Tuesday', 'Friday']), correctAnswer: 'Tuesday', explanation: 'Urutan: Monday → TUESDAY → Wednesday.', order: 1, difficulty: 1 },
          { type: 'TRANSLATE', prompt: 'Translate: "Jumat"', options: JSON.stringify(['Thursday', 'Saturday', 'Friday', 'Wednesday']), correctAnswer: 'Friday', explanation: '"Friday" adalah hari Jumat.', order: 2, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'Which month comes after "January"?', options: JSON.stringify(['March', 'December', 'February', 'April']), correctAnswer: 'February', explanation: 'January → FEBRUARY → March.', order: 3, difficulty: 2 },
          { type: 'FILL_BLANK', prompt: 'There are ___ days in a week.', options: JSON.stringify(['five', 'six', 'seven', 'eight']), correctAnswer: 'seven', explanation: 'Ada 7 (seven) hari dalam seminggu.', order: 4, difficulty: 1 },
          { type: 'TRANSLATE', prompt: 'Translate: "Desember"', options: JSON.stringify(['November', 'October', 'January', 'December']), correctAnswer: 'December', explanation: '"December" adalah bulan Desember, bulan ke-12.', order: 5, difficulty: 1 },
        ]
      }
    }
  })

  // ─────────────────────────────────────────
  // UNIT 2: BEGINNER — Grammar Basics
  // ─────────────────────────────────────────

  await prisma.lesson.create({
    data: {
      title: 'Simple Present Tense',
      description: 'Master the basics of Simple Present Tense for daily routines.',
      category: 'GRAMMAR',
      difficulty: 'BEGINNER',
      order: 5,
      xpReward: 25,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'Which sentence is correct?', options: JSON.stringify(['She go to school.', 'She goes to school.', 'She going to school.', 'She gone to school.']), correctAnswer: 'She goes to school.', explanation: 'Subject orang ketiga tunggal (he/she/it) ditambah -s/-es pada verb.', order: 1, difficulty: 2 },
          { type: 'FILL_BLANK', prompt: 'They ___ football every weekend.', options: JSON.stringify(['plays', 'play', 'playing', 'played']), correctAnswer: 'play', explanation: 'Subject "They" (plural) menggunakan verb tanpa -s.', order: 2, difficulty: 2 },
          { type: 'ERROR_DETECT', prompt: 'Find the error: "He don\'t like coffee."', options: JSON.stringify(['He', "don't", 'like', 'coffee']), correctAnswer: "don't", explanation: 'Untuk he/she/it, gunakan "doesn\'t" bukan "don\'t".', order: 3, difficulty: 2 },
          { type: 'REARRANGE', prompt: 'Rearrange: [every / she / reads / day / books]', options: JSON.stringify(['every', 'she', 'reads', 'day', 'books']), correctAnswer: 'she reads books every day', explanation: 'Struktur: Subject + Verb + Object + Time.', order: 4, difficulty: 3 },
          { type: 'TRANSLATE', prompt: 'Translate: "Dia tidak suka makan sayur."', options: JSON.stringify(["He doesn't like eating vegetables.", "He don't like eating vegetables.", 'He not like eating vegetables.', "He isn't like eating vegetables."]), correctAnswer: "He doesn't like eating vegetables.", explanation: 'Gunakan "doesn\'t" untuk negasi he/she/it.', order: 5, difficulty: 3 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'To Be: Am, Is, Are',
      description: 'Learn how to use "am", "is", and "are" correctly.',
      category: 'GRAMMAR',
      difficulty: 'BEGINNER',
      order: 6,
      xpReward: 25,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'FILL_BLANK', prompt: 'I ___ a student.', options: JSON.stringify(['is', 'are', 'am', 'be']), correctAnswer: 'am', explanation: '"Am" digunakan dengan subject "I".', order: 1, difficulty: 1 },
          { type: 'FILL_BLANK', prompt: 'She ___ very smart.', options: JSON.stringify(['am', 'are', 'is', 'be']), correctAnswer: 'is', explanation: '"Is" digunakan dengan he/she/it.', order: 2, difficulty: 1 },
          { type: 'FILL_BLANK', prompt: 'We ___ from Indonesia.', options: JSON.stringify(['am', 'is', 'are', 'be']), correctAnswer: 'are', explanation: '"Are" digunakan dengan we/you/they.', order: 3, difficulty: 1 },
          { type: 'ERROR_DETECT', prompt: 'Find the error: "They is happy."', options: JSON.stringify(['They', 'is', 'happy']), correctAnswer: 'is', explanation: '"They" membutuhkan "are", bukan "is".', order: 4, difficulty: 2 },
          { type: 'MULTIPLE_CHOICE', prompt: 'Which is correct?', options: JSON.stringify(['He are tall.', 'He am tall.', 'He is tall.', 'He be tall.']), correctAnswer: 'He is tall.', explanation: '"He" + "is" → "He is tall."', order: 5, difficulty: 1 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Articles: A, An, The',
      description: 'Learn when to use "a", "an", and "the" in English sentences.',
      category: 'GRAMMAR',
      difficulty: 'BEGINNER',
      order: 7,
      xpReward: 25,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'FILL_BLANK', prompt: 'I have ___ apple.', options: JSON.stringify(['a', 'an', 'the', '-']), correctAnswer: 'an', explanation: '"An" digunakan sebelum kata yang dimulai dengan vokal (a, e, i, o, u).', order: 1, difficulty: 2 },
          { type: 'FILL_BLANK', prompt: 'She is ___ doctor.', options: JSON.stringify(['an', 'the', 'a', '-']), correctAnswer: 'a', explanation: '"A" digunakan sebelum kata yang dimulai dengan konsonan.', order: 2, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'Which is correct?', options: JSON.stringify(['I saw a elephant.', 'I saw an elephant.', 'I saw the elephant.', 'I saw elephant.']), correctAnswer: 'I saw an elephant.', explanation: '"Elephant" dimulai dengan vokal "e", jadi gunakan "an".', order: 3, difficulty: 2 },
          { type: 'FILL_BLANK', prompt: '___ sun rises in the east.', options: JSON.stringify(['A', 'An', 'The', '-']), correctAnswer: 'The', explanation: '"The" digunakan untuk benda yang sudah spesifik/diketahui — hanya ada satu matahari.', order: 4, difficulty: 2 },
          { type: 'ERROR_DETECT', prompt: 'Find the error: "She has a umbrella."', options: JSON.stringify(['She', 'has', 'a', 'umbrella']), correctAnswer: 'a', explanation: '"Umbrella" dimulai dengan vokal "u", jadi harus "an umbrella".', order: 5, difficulty: 2 },
        ]
      }
    }
  })

  // ─────────────────────────────────────────
  // UNIT 3: BEGINNER — Everyday Life
  // ─────────────────────────────────────────

  await prisma.lesson.create({
    data: {
      title: 'Family Members',
      description: 'Learn vocabulary for family relationships in English.',
      category: 'VOCABULARY',
      difficulty: 'BEGINNER',
      order: 8,
      xpReward: 20,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'TRANSLATE', prompt: 'Translate: "ayah"', options: JSON.stringify(['Mother', 'Brother', 'Father', 'Uncle']), correctAnswer: 'Father', explanation: '"Father" adalah kata untuk ayah dalam bahasa Inggris.', order: 1, difficulty: 1 },
          { type: 'TRANSLATE', prompt: 'Translate: "kakak perempuan"', options: JSON.stringify(['Brother', 'Aunt', 'Sister', 'Cousin']), correctAnswer: 'Sister', explanation: '"Sister" berarti saudara perempuan.', order: 2, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'What is "nenek" in English?', options: JSON.stringify(['Grandfather', 'Aunt', 'Grandmother', 'Mother']), correctAnswer: 'Grandmother', explanation: '"Grandmother" adalah nenek (ibu dari orang tua kita).', order: 3, difficulty: 1 },
          { type: 'FILL_BLANK', prompt: 'My mom\'s brother is my ___.', options: JSON.stringify(['cousin', 'nephew', 'uncle', 'grandfather']), correctAnswer: 'uncle', explanation: 'Saudara laki-laki ibu/ayah kita disebut "uncle" (paman).', order: 4, difficulty: 2 },
          { type: 'TRANSLATE', prompt: 'Translate: "suami"', options: JSON.stringify(['Wife', 'Husband', 'Father', 'Son']), correctAnswer: 'Husband', explanation: '"Husband" adalah suami dalam bahasa Inggris.', order: 5, difficulty: 1 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Food & Drinks',
      description: 'Learn common food and drink vocabulary in English.',
      category: 'VOCABULARY',
      difficulty: 'BEGINNER',
      order: 9,
      xpReward: 20,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'TRANSLATE', prompt: 'Translate: "nasi"', options: JSON.stringify(['Bread', 'Rice', 'Noodle', 'Corn']), correctAnswer: 'Rice', explanation: '"Rice" adalah nasi dalam bahasa Inggris.', order: 1, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'What is "air" in English?', options: JSON.stringify(['Juice', 'Milk', 'Water', 'Tea']), correctAnswer: 'Water', explanation: '"Water" adalah air dalam bahasa Inggris.', order: 2, difficulty: 1 },
          { type: 'TRANSLATE', prompt: 'Translate: "telur"', options: JSON.stringify(['Milk', 'Chicken', 'Egg', 'Cheese']), correctAnswer: 'Egg', explanation: '"Egg" adalah telur dalam bahasa Inggris.', order: 3, difficulty: 1 },
          { type: 'FILL_BLANK', prompt: 'I drink ___ every morning. (susu)', options: JSON.stringify(['juice', 'milk', 'water', 'tea']), correctAnswer: 'milk', explanation: '"Milk" adalah susu dalam bahasa Inggris.', order: 4, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'Which is a fruit?', options: JSON.stringify(['Carrot', 'Chicken', 'Apple', 'Rice']), correctAnswer: 'Apple', explanation: '"Apple" (apel) adalah buah-buahan (fruit).', order: 5, difficulty: 1 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Daily Activities',
      description: 'Talk about what you do every day in English.',
      category: 'VOCABULARY',
      difficulty: 'BEGINNER',
      order: 10,
      xpReward: 25,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'TRANSLATE', prompt: 'Translate: "bangun tidur"', options: JSON.stringify(['Go to sleep', 'Wake up', 'Sit down', 'Stand up']), correctAnswer: 'Wake up', explanation: '"Wake up" berarti bangun tidur.', order: 1, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'What does "brush teeth" mean?', options: JSON.stringify(['Mandi', 'Sikat gigi', 'Sisir rambut', 'Cuci muka']), correctAnswer: 'Sikat gigi', explanation: '"Brush teeth" berarti menggosok/menyikat gigi.', order: 2, difficulty: 1 },
          { type: 'FILL_BLANK', prompt: 'I ___ breakfast at 7 AM. (makan)', options: JSON.stringify(['drink', 'sleep', 'eat', 'cook']), correctAnswer: 'eat', explanation: '"Eat" berarti makan. "I eat breakfast" = Saya makan sarapan.', order: 3, difficulty: 1 },
          { type: 'TRANSLATE', prompt: 'Translate: "pergi ke sekolah"', options: JSON.stringify(['Come home', 'Go to school', 'Study at home', 'Play outside']), correctAnswer: 'Go to school', explanation: '"Go to school" berarti pergi ke sekolah.', order: 4, difficulty: 1 },
          { type: 'REARRANGE', prompt: 'Rearrange: [at / I / wake up / 6 AM]', options: JSON.stringify(['at', 'I', 'wake up', '6 AM']), correctAnswer: 'I wake up at 6 AM', explanation: 'Struktur: Subject + Verb phrase + Time.', order: 5, difficulty: 2 },
        ]
      }
    }
  })

  // ─────────────────────────────────────────
  // UNIT 4: INTERMEDIATE — Grammar
  // ─────────────────────────────────────────

  await prisma.lesson.create({
    data: {
      title: 'Past Tense Basics',
      description: 'Learn how to talk about events that already happened.',
      category: 'GRAMMAR',
      difficulty: 'INTERMEDIATE',
      order: 11,
      xpReward: 30,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'What is the past tense of "go"?', options: JSON.stringify(['Goed', 'Goes', 'Went', 'Gone']), correctAnswer: 'Went', explanation: '"Go" adalah irregular verb. Past tense-nya adalah "went".', order: 1, difficulty: 2 },
          { type: 'FILL_BLANK', prompt: 'She ___ TV last night. (watch)', options: JSON.stringify(['watch', 'watches', 'watched', 'watching']), correctAnswer: 'watched', explanation: 'Regular verb ditambah -ed untuk past tense: watch → watched.', order: 2, difficulty: 2 },
          { type: 'ERROR_DETECT', prompt: 'Find the error: "I goed to the market yesterday."', options: JSON.stringify(['I', 'goed', 'to', 'yesterday']), correctAnswer: 'goed', explanation: '"Go" adalah irregular verb. Past tense yang benar adalah "went", bukan "goed".', order: 3, difficulty: 3 },
          { type: 'TRANSLATE', prompt: 'Translate: "Dia makan nasi tadi pagi."', options: JSON.stringify(['He eats rice this morning.', 'He ate rice this morning.', 'He eating rice this morning.', 'He eat rice this morning.']), correctAnswer: 'He ate rice this morning.', explanation: '"Eat" → past tense "ate". "This morning" menunjukkan waktu lampau.', order: 4, difficulty: 3 },
          { type: 'MULTIPLE_CHOICE', prompt: 'Which sentence is in the PAST tense?', options: JSON.stringify(['She is cooking.', 'She cooks every day.', 'She cooked dinner.', 'She will cook.']), correctAnswer: 'She cooked dinner.', explanation: '"Cooked" adalah past tense dari "cook".', order: 5, difficulty: 2 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Future Tense: Will & Going To',
      description: 'Learn how to talk about plans and predictions.',
      category: 'GRAMMAR',
      difficulty: 'INTERMEDIATE',
      order: 12,
      xpReward: 30,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'Which sentence talks about the FUTURE?', options: JSON.stringify(['She worked yesterday.', 'She works every day.', 'She will work tomorrow.', 'She is working now.']), correctAnswer: 'She will work tomorrow.', explanation: '"Will + verb" digunakan untuk menyatakan masa depan.', order: 1, difficulty: 2 },
          { type: 'FILL_BLANK', prompt: 'I ___ going to study tonight.', options: JSON.stringify(['is', 'am', 'are', 'be']), correctAnswer: 'am', explanation: '"I am going to" digunakan untuk rencana yang sudah diputuskan.', order: 2, difficulty: 2 },
          { type: 'TRANSLATE', prompt: 'Translate: "Dia akan pergi ke Jakarta besok."', options: JSON.stringify(['He went to Jakarta yesterday.', 'He goes to Jakarta every day.', 'He will go to Jakarta tomorrow.', 'He is going to Jakarta now.']), correctAnswer: 'He will go to Jakarta tomorrow.', explanation: '"Will go" untuk menyatakan rencana/prediksi masa depan.', order: 3, difficulty: 3 },
          { type: 'ERROR_DETECT', prompt: 'Find the error: "She will goes to school."', options: JSON.stringify(['She', 'will', 'goes', 'school']), correctAnswer: 'goes', explanation: 'Setelah "will", gunakan base form verb: "will go", bukan "will goes".', order: 4, difficulty: 3 },
          { type: 'MULTIPLE_CHOICE', prompt: '"I am going to eat pizza." — What does this mean?', options: JSON.stringify(['Saya sedang makan pizza.', 'Saya makan pizza kemarin.', 'Saya berencana makan pizza.', 'Saya suka pizza.']), correctAnswer: 'Saya berencana makan pizza.', explanation: '"Be going to" menunjukkan rencana yang sudah diputuskan.', order: 5, difficulty: 2 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Comparatives & Superlatives',
      description: 'Learn how to compare things in English.',
      category: 'GRAMMAR',
      difficulty: 'INTERMEDIATE',
      order: 13,
      xpReward: 35,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'What is the comparative of "big"?', options: JSON.stringify(['More big', 'Biggest', 'Bigger', 'Biger']), correctAnswer: 'Bigger', explanation: 'Kata sifat pendek (1-2 suku kata) + -er untuk comparative: big → bigger.', order: 1, difficulty: 2 },
          { type: 'FILL_BLANK', prompt: 'Mount Everest is the ___ mountain in the world. (high)', options: JSON.stringify(['higher', 'most high', 'highest', 'more high']), correctAnswer: 'highest', explanation: 'Superlative untuk kata sifat pendek: high → highest.', order: 2, difficulty: 3 },
          { type: 'MULTIPLE_CHOICE', prompt: 'Which is the correct comparative of "beautiful"?', options: JSON.stringify(['Beautifuller', 'More beautiful', 'Most beautiful', 'Beautifulest']), correctAnswer: 'More beautiful', explanation: 'Kata sifat panjang (3+ suku kata) menggunakan "more" untuk comparative.', order: 3, difficulty: 3 },
          { type: 'TRANSLATE', prompt: 'Translate: "Dia lebih tinggi dari saya."', options: JSON.stringify(['He is tall than me.', 'He is the tallest than me.', 'He is taller than me.', 'He more tall than me.']), correctAnswer: 'He is taller than me.', explanation: '"Taller than" adalah bentuk comparative dari "tall".', order: 4, difficulty: 3 },
          { type: 'ERROR_DETECT', prompt: 'Find the error: "She is more smarter than him."', options: JSON.stringify(['She', 'is', 'more smarter', 'than him']), correctAnswer: 'more smarter', explanation: '"Smart" adalah kata sifat pendek, jadi gunakan "smarter", bukan "more smarter".', order: 5, difficulty: 3 },
        ]
      }
    }
  })

  // ─────────────────────────────────────────
  // UNIT 5: INTERMEDIATE — Communication
  // ─────────────────────────────────────────

  await prisma.lesson.create({
    data: {
      title: 'At the Restaurant',
      description: 'Learn how to order food and have conversations at a restaurant.',
      category: 'VOCABULARY',
      difficulty: 'INTERMEDIATE',
      order: 14,
      xpReward: 30,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'How do you ask for the menu?', options: JSON.stringify(['Can I have the bill?', 'Can I see the menu, please?', 'Is the food ready?', 'What do you recommend?']), correctAnswer: 'Can I see the menu, please?', explanation: '"Can I see the menu?" adalah cara sopan meminta menu.', order: 1, difficulty: 2 },
          { type: 'TRANSLATE', prompt: 'Translate: "Saya ingin memesan nasi goreng."', options: JSON.stringify(["I want to cook fried rice.", "I'd like to order fried rice.", 'I eat fried rice.', 'Give me fried rice.']), correctAnswer: "I'd like to order fried rice.", explanation: '"I\'d like to order..." adalah cara sopan untuk memesan makanan.', order: 2, difficulty: 2 },
          { type: 'FILL_BLANK', prompt: '"Excuse me, can I have the ___, please?" (tagihan)', options: JSON.stringify(['menu', 'food', 'bill', 'table']), correctAnswer: 'bill', explanation: '"Bill" adalah tagihan/nota di restoran.', order: 3, difficulty: 2 },
          { type: 'MULTIPLE_CHOICE', prompt: 'A waiter asks: "How would you like your steak?" You want it well-done. What do you say?', options: JSON.stringify(['Medium rare, please.', 'Raw, please.', 'Well-done, please.', 'Bloody, please.']), correctAnswer: 'Well-done, please.', explanation: '"Well-done" berarti daging dimasak matang sempurna.', order: 4, difficulty: 3 },
          { type: 'TRANSLATE', prompt: 'Translate: "Apakah ada meja untuk dua orang?"', options: JSON.stringify(['Do you have food for two?', 'Is there a table for two?', 'Can we sit together?', 'Where is the table?']), correctAnswer: 'Is there a table for two?', explanation: '"Is there a table for two?" adalah cara meminta meja untuk 2 orang.', order: 5, difficulty: 3 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Asking for Directions',
      description: 'Learn how to ask and give directions in English.',
      category: 'VOCABULARY',
      difficulty: 'INTERMEDIATE',
      order: 15,
      xpReward: 30,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'How do you ask for directions politely?', options: JSON.stringify(['Where is it?', 'Excuse me, could you tell me how to get to the station?', 'Go there!', 'I need the station.']), correctAnswer: 'Excuse me, could you tell me how to get to the station?', explanation: 'Menggunakan "Excuse me" dan "could you" membuat permintaan lebih sopan.', order: 1, difficulty: 2 },
          { type: 'TRANSLATE', prompt: 'Translate: "Belok kiri di lampu merah."', options: JSON.stringify(['Turn right at the traffic light.', 'Go straight at the traffic light.', 'Turn left at the traffic light.', 'Stop at the traffic light.']), correctAnswer: 'Turn left at the traffic light.', explanation: '"Turn left" = belok kiri, "traffic light" = lampu merah/lalu lintas.', order: 2, difficulty: 2 },
          { type: 'FILL_BLANK', prompt: 'Go ___ and then turn right. (lurus)', options: JSON.stringify(['left', 'right', 'straight', 'back']), correctAnswer: 'straight', explanation: '"Go straight" berarti jalan lurus.', order: 3, difficulty: 2 },
          { type: 'MULTIPLE_CHOICE', prompt: '"It\'s next to the bank." — What does "next to" mean?', options: JSON.stringify(['Di dalam', 'Di sebelah', 'Di belakang', 'Di atas']), correctAnswer: 'Di sebelah', explanation: '"Next to" berarti di sebelah/berdekatan dengan.', order: 4, difficulty: 2 },
          { type: 'TRANSLATE', prompt: 'Translate: "Jalan kaki sekitar 5 menit."', options: JSON.stringify(["It's a 5-minute drive.", "It's about a 5-minute walk.", "Walk for 50 minutes.", "It takes 5 hours."]), correctAnswer: "It's about a 5-minute walk.", explanation: '"A 5-minute walk" berarti perjalanan jalan kaki 5 menit.', order: 5, difficulty: 3 },
        ]
      }
    }
  })

  // ─────────────────────────────────────────
  // UNIT 6: INTERMEDIATE — Reading
  // ─────────────────────────────────────────

  await prisma.lesson.create({
    data: {
      title: 'Short Story: The Lost Dog',
      description: 'Read a short story and answer comprehension questions.',
      category: 'READING',
      difficulty: 'INTERMEDIATE',
      order: 16,
      xpReward: 35,
      unlockLevel: 1,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'Story: "Tom had a dog named Max. One day, Max ran away. Tom looked everywhere. Finally, he found Max in the park." — Where did Tom find Max?', options: JSON.stringify(['At home', 'In the park', 'At school', 'In the store']), correctAnswer: 'In the park', explanation: 'Dari cerita: "he found Max in the park" — Tom menemukan Max di taman.', order: 1, difficulty: 2 },
          { type: 'MULTIPLE_CHOICE', prompt: 'Based on the story, what is the name of Tom\'s dog?', options: JSON.stringify(['Tom', 'Rex', 'Max', 'Bob']), correctAnswer: 'Max', explanation: 'Dari cerita: "Tom had a dog named Max."', order: 2, difficulty: 1 },
          { type: 'MULTIPLE_CHOICE', prompt: 'What does "ran away" mean in the story?', options: JSON.stringify(['Berlari lebih cepat', 'Pergi/kabur', 'Berlari kembali', 'Berlari bersama']), correctAnswer: 'Pergi/kabur', explanation: '"Ran away" berarti kabur atau pergi tanpa pamit.', order: 3, difficulty: 2 },
          { type: 'FILL_BLANK', prompt: 'Tom "looked ___" for Max. This means he searched in many places.', options: JSON.stringify(['sometimes', 'nowhere', 'everywhere', 'somewhere']), correctAnswer: 'everywhere', explanation: '"Looked everywhere" = mencari ke mana-mana / di semua tempat.', order: 4, difficulty: 2 },
          { type: 'MULTIPLE_CHOICE', prompt: 'What is the main emotion Tom probably felt when he found Max?', options: JSON.stringify(['Sad', 'Angry', 'Relieved and happy', 'Surprised and scared']), correctAnswer: 'Relieved and happy', explanation: 'Tom tentu merasa lega (relieved) dan senang (happy) menemukan anjingnya.', order: 5, difficulty: 3 },
        ]
      }
    }
  })

  // ─────────────────────────────────────────
  // UNIT 7: ADVANCED — Grammar
  // ─────────────────────────────────────────

  await prisma.lesson.create({
    data: {
      title: 'Present Perfect Tense',
      description: 'Master the Present Perfect for experiences and recent events.',
      category: 'GRAMMAR',
      difficulty: 'ADVANCED',
      order: 17,
      xpReward: 40,
      unlockLevel: 3,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'Which sentence uses Present Perfect correctly?', options: JSON.stringify(['I see that movie yesterday.', 'I have seen that movie.', 'I was seen that movie.', 'I seeing that movie.']), correctAnswer: 'I have seen that movie.', explanation: 'Present Perfect = have/has + past participle. "See" → "seen".', order: 1, difficulty: 3 },
          { type: 'FILL_BLANK', prompt: 'She ___ never been to Japan. (has/have)', options: JSON.stringify(['have', 'has', 'is', 'was']), correctAnswer: 'has', explanation: '"She" adalah orang ketiga tunggal, gunakan "has" bukan "have".', order: 2, difficulty: 3 },
          { type: 'ERROR_DETECT', prompt: 'Find the error: "They have went to Paris."', options: JSON.stringify(['They', 'have', 'went', 'Paris']), correctAnswer: 'went', explanation: 'Setelah "have/has", gunakan past participle: "gone", bukan "went".', order: 3, difficulty: 4 },
          { type: 'TRANSLATE', prompt: 'Translate: "Saya sudah makan siang."', options: JSON.stringify(['I eat lunch.', 'I ate lunch.', 'I have eaten lunch.', 'I had lunch yesterday.']), correctAnswer: 'I have eaten lunch.', explanation: '"Have eaten" adalah Present Perfect dari "eat". "Sudah" menunjukkan pengalaman/hasil yang relevan sekarang.', order: 4, difficulty: 4 },
          { type: 'MULTIPLE_CHOICE', prompt: 'When do we use Present Perfect?', options: JSON.stringify(['Untuk kejadian di masa lalu yang jelas waktunya', 'Untuk pengalaman hidup atau kejadian yang masih relevan sekarang', 'Untuk rencana masa depan', 'Untuk kebiasaan sehari-hari']), correctAnswer: 'Untuk pengalaman hidup atau kejadian yang masih relevan sekarang', explanation: 'Present Perfect digunakan untuk pengalaman (pernah/belum pernah) atau kejadian masa lalu yang hasilnya masih terasa sekarang.', order: 5, difficulty: 4 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Passive Voice',
      description: 'Learn how to use passive voice in English sentences.',
      category: 'GRAMMAR',
      difficulty: 'ADVANCED',
      order: 18,
      xpReward: 40,
      unlockLevel: 3,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'Which sentence is in PASSIVE voice?', options: JSON.stringify(['The cat chased the mouse.', 'The mouse was chased by the cat.', 'The cat is chasing the mouse.', 'The cat will chase the mouse.']), correctAnswer: 'The mouse was chased by the cat.', explanation: 'Passive voice: object + to be + past participle + (by + subject).', order: 1, difficulty: 3 },
          { type: 'TRANSLATE', prompt: 'Translate to passive: "Mereka membangun gedung itu tahun lalu."', options: JSON.stringify(['The building was built last year.', 'They built the building last year.', 'The building is built.', 'They are building the building.']), correctAnswer: 'The building was built last year.', explanation: 'Passive: "The building was built" — objek menjadi subjek kalimat pasif.', order: 2, difficulty: 4 },
          { type: 'FILL_BLANK', prompt: 'The letter ___ written by Maria. (was/were)', options: JSON.stringify(['were', 'was', 'are', 'is']), correctAnswer: 'was', explanation: '"The letter" adalah singular, jadi gunakan "was".', order: 3, difficulty: 3 },
          { type: 'ERROR_DETECT', prompt: 'Find the error: "The cake was ate by the children."', options: JSON.stringify(['The cake', 'was', 'ate', 'the children']), correctAnswer: 'ate', explanation: 'Setelah "was/were" gunakan past participle: "eaten", bukan "ate".', order: 4, difficulty: 4 },
          { type: 'MULTIPLE_CHOICE', prompt: 'Convert to passive: "Someone stole my wallet."', options: JSON.stringify(['My wallet stole.', 'My wallet was stolen.', 'My wallet is stolen.', 'My wallet has stolen.']), correctAnswer: 'My wallet was stolen.', explanation: '"Steal" → past participle "stolen". Passive: "My wallet was stolen."', order: 5, difficulty: 4 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Conditional Sentences',
      description: 'Learn how to use if-clauses to talk about conditions and results.',
      category: 'GRAMMAR',
      difficulty: 'ADVANCED',
      order: 19,
      xpReward: 45,
      unlockLevel: 3,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'Which is a correct Type 1 Conditional?', options: JSON.stringify(['If it rains, I stayed home.', 'If it rains, I will stay home.', 'If it rained, I would stay home.', 'If it had rained, I would have stayed home.']), correctAnswer: 'If it rains, I will stay home.', explanation: 'Type 1 Conditional: If + Simple Present, will + base verb. Untuk kondisi nyata/mungkin terjadi.', order: 1, difficulty: 4 },
          { type: 'FILL_BLANK', prompt: 'If I ___ rich, I would travel the world. (was/were)', options: JSON.stringify(['was', 'were', 'am', 'be']), correctAnswer: 'were', explanation: 'Type 2 Conditional (unreal present): If + were/past simple, would + base verb.', order: 2, difficulty: 4 },
          { type: 'TRANSLATE', prompt: 'Translate: "Kalau kamu belajar keras, kamu akan lulus."', options: JSON.stringify(['If you study hard, you would pass.', 'If you study hard, you will pass.', 'If you studied hard, you pass.', 'You will pass if you studied hard.']), correctAnswer: 'If you study hard, you will pass.', explanation: 'Type 1 Conditional: kondisi yang realistis dan mungkin terjadi.', order: 3, difficulty: 4 },
          { type: 'ERROR_DETECT', prompt: 'Find the error: "If she will come, I will be happy."', options: JSON.stringify(['If', 'she will come', 'I will', 'be happy']), correctAnswer: 'she will come', explanation: 'Dalam conditional clause (If...), gunakan Simple Present, bukan "will": "If she comes..."', order: 4, difficulty: 5 },
          { type: 'MULTIPLE_CHOICE', prompt: '"If I had studied harder, I would have passed the exam." — This means:', options: JSON.stringify(['Saya belajar keras dan lulus.', 'Saya tidak belajar keras dan tidak lulus.', 'Saya berencana belajar keras.', 'Saya harus belajar lebih keras.']), correctAnswer: 'Saya tidak belajar keras dan tidak lulus.', explanation: 'Type 3 Conditional menggambarkan kondisi yang TIDAK terjadi di masa lalu beserta akibatnya.', order: 5, difficulty: 5 },
        ]
      }
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Advanced Vocabulary: Business English',
      description: 'Master professional vocabulary for workplace communication.',
      category: 'VOCABULARY',
      difficulty: 'ADVANCED',
      order: 20,
      xpReward: 50,
      unlockLevel: 3,
      isPublished: true,
      questions: {
        create: [
          { type: 'MULTIPLE_CHOICE', prompt: 'What does "deadline" mean?', options: JSON.stringify(['Garis mati dalam gambar', 'Batas waktu pengumpulan', 'Rapat penting', 'Kontrak kerja']), correctAnswer: 'Batas waktu pengumpulan', explanation: '"Deadline" adalah batas waktu (terakhir) untuk menyelesaikan/mengumpulkan sesuatu.', order: 1, difficulty: 3 },
          { type: 'TRANSLATE', prompt: 'Translate: "Kami perlu menjadwalkan rapat."', options: JSON.stringify(['We need to cancel the meeting.', 'We need to schedule a meeting.', 'We had a meeting.', 'The meeting is scheduled.']), correctAnswer: 'We need to schedule a meeting.', explanation: '"Schedule a meeting" = menjadwalkan rapat.', order: 2, difficulty: 3 },
          { type: 'MULTIPLE_CHOICE', prompt: 'In a professional email, how do you start formally?', options: JSON.stringify(['Hey!', 'Sup?', 'Dear Mr./Ms. [Name],', 'Yo,']), correctAnswer: 'Dear Mr./Ms. [Name],', explanation: '"Dear Mr./Ms." adalah pembuka email formal yang tepat dan profesional.', order: 3, difficulty: 3 },
          { type: 'FILL_BLANK', prompt: 'Please find the report ___ to this email. (terlampir)', options: JSON.stringify(['included', 'attached', 'added', 'connected']), correctAnswer: 'attached', explanation: '"Attached" = terlampir. "Please find the report attached" adalah frasa profesional standar.', order: 4, difficulty: 4 },
          { type: 'TRANSLATE', prompt: 'Translate: "Mohon balas email ini secepatnya."', options: JSON.stringify(['Please write an email soon.', 'Please reply to this email at your earliest convenience.', 'Send me an email please.', 'Email me when you are free.']), correctAnswer: 'Please reply to this email at your earliest convenience.', explanation: '"At your earliest convenience" adalah ungkapan profesional untuk "secepatnya/sesegera mungkin".', order: 5, difficulty: 4 },
        ]
      }
    }
  })

  // ─────────────────────────────────────────
  // ACHIEVEMENTS
  // ─────────────────────────────────────────

  await prisma.achievement.createMany({
    data: [
      { code: 'FIRST_LESSON', title: 'First Step! 🎯', description: 'Complete your very first lesson.', xpReward: 50, isHidden: false, condition: JSON.stringify({ type: 'lesson_complete', value: 1 }) },
      { code: 'LESSON_5', title: 'Getting Warmed Up! 🔥', description: 'Complete 5 lessons.', xpReward: 75, isHidden: false, condition: JSON.stringify({ type: 'lesson_complete', value: 5 }) },
      { code: 'LESSON_10', title: 'On a Roll! ⚡', description: 'Complete 10 lessons.', xpReward: 100, isHidden: false, condition: JSON.stringify({ type: 'lesson_complete', value: 10 }) },
      { code: 'LESSON_20', title: 'Dedicated Learner! 📚', description: 'Complete all 20 lessons.', xpReward: 250, isHidden: false, condition: JSON.stringify({ type: 'lesson_complete', value: 20 }) },
      { code: 'STREAK_3', title: 'Hat Trick! 🎩', description: 'Maintain a 3-day streak.', xpReward: 50, isHidden: false, condition: JSON.stringify({ type: 'streak', value: 3 }) },
      { code: 'STREAK_7', title: 'Week Warrior! 🗓️', description: 'Maintain a 7-day streak.', xpReward: 150, isHidden: false, condition: JSON.stringify({ type: 'streak', value: 7 }) },
      { code: 'STREAK_30', title: 'Monthly Master! 🏅', description: 'Maintain a 30-day streak.', xpReward: 500, isHidden: false, condition: JSON.stringify({ type: 'streak', value: 30 }) },
      { code: 'PERFECT_SCORE', title: 'Perfectionist! ✨', description: 'Get a perfect score on any lesson.', xpReward: 75, isHidden: false, condition: JSON.stringify({ type: 'perfect_score', value: 1 }) },
      { code: 'PERFECT_5', title: 'Flawless! 💎', description: 'Get perfect scores on 5 lessons.', xpReward: 200, isHidden: false, condition: JSON.stringify({ type: 'perfect_score', value: 5 }) },
      { code: 'XP_100', title: 'Century! 💯', description: 'Earn 100 XP total.', xpReward: 50, isHidden: false, condition: JSON.stringify({ type: 'total_xp', value: 100 }) },
      { code: 'XP_500', title: 'XP Hunter! 🎮', description: 'Earn 500 XP total.', xpReward: 100, isHidden: false, condition: JSON.stringify({ type: 'total_xp', value: 500 }) },
      { code: 'XP_1000', title: 'XP Legend! 👑', description: 'Earn 1000 XP total.', xpReward: 250, isHidden: false, condition: JSON.stringify({ type: 'total_xp', value: 1000 }) },
      { code: 'NIGHT_OWL', title: 'Night Owl! 🦉', description: '???', xpReward: 50, isHidden: true, condition: JSON.stringify({ type: 'study_hour', value: 23 }) },
      { code: 'EARLY_BIRD', title: 'Early Bird! 🐦', description: '???', xpReward: 50, isHidden: true, condition: JSON.stringify({ type: 'study_hour', value: 5 }) },
      { code: 'GRAMMAR_NERD', title: 'Grammar Nerd! 📝', description: 'Complete all grammar lessons.', xpReward: 150, isHidden: false, condition: JSON.stringify({ type: 'category_complete', value: 'GRAMMAR' }) },
    ]
  })

  console.log('✅ Seed complete!')
  console.log('   Lessons: 20')
  console.log('   Achievements: 15')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())