// Simple sound system menggunakan Web Audio API
// Tidak butuh file audio eksternal

class SoundSystem {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.ctx
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
    if (!this.enabled || typeof window === 'undefined') return
    try {
      const ctx = this.getCtx()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
      oscillator.type = type
      gainNode.gain.setValueAtTime(volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch (e) {}
  }

  correct() {
    this.playTone(523, 0.1)
    setTimeout(() => this.playTone(659, 0.1), 100)
    setTimeout(() => this.playTone(784, 0.15), 200)
  }

  wrong() {
    this.playTone(300, 0.1, 'sawtooth', 0.2)
    setTimeout(() => this.playTone(250, 0.15, 'sawtooth', 0.2), 100)
  }

  levelUp() {
    const notes = [523, 659, 784, 1047]
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, 'sine', 0.4), i * 120)
    })
  }

  achievement() {
    const notes = [784, 880, 988, 1047]
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.15, 'sine', 0.35), i * 80)
    })
  }

  click() {
    this.playTone(800, 0.05, 'sine', 0.15)
  }
}

export const sounds = new SoundSystem()