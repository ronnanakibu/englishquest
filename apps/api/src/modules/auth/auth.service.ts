import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { AppError } from '../../shared/errors/AppError'
import { AuthRepository } from './auth.repository'
import { RegisterInput, LoginInput } from './auth.schema'

export class AuthService {
  constructor(private authRepo: AuthRepository) {}

  async register(input: RegisterInput) {
    const existingEmail = await this.authRepo.findByEmail(input.email)
    if (existingEmail) throw new AppError('Email sudah digunakan', 409)

    const existingUsername = await this.authRepo.findByUsername(input.username)
    if (existingUsername) throw new AppError('Username sudah digunakan', 409)

    const passwordHash = await bcrypt.hash(input.password, 12)
    const verifyToken = crypto.randomBytes(32).toString('hex')

    const user = await this.authRepo.create({
      email: input.email,
      username: input.username,
      passwordHash,
      verifyToken
    })

    return {
      id: user.id,
      email: user.email,
      username: user.username
    }
  }

  async login(input: LoginInput) {
    const user = await this.authRepo.findByEmail(input.email)
    if (!user) throw new AppError('Email atau password salah', 401)

    const isValid = await bcrypt.compare(input.password, user.passwordHash)
    if (!isValid) throw new AppError('Email atau password salah', 401)

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      xp: user.xp,
      level: user.level,
      hearts: user.hearts,
      currentStreak: user.currentStreak
    }
  }
}