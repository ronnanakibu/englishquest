const store = new Map<string, { data: any; time: number }>()

const TTL_MAP: Record<string, number> = {
    lessons: 60_000,      // 1 menit
    achievements: 120_000, // 2 menit
    leaderboard: 30_000,  // 30 detik
    profile: 15_000,      // 15 detik
    quest: 60_000,        // 1 menit
}

export const apiCache = {
    get: (key: string) => {
        const cached = store.get(key)
        if (!cached) return null
        const ttl = TTL_MAP[key] || 30_000
        if (Date.now() - cached.time > ttl) {
            store.delete(key)
            return null
        }
        return cached.data
    },
    set: (key: string, data: any) => {
        store.set(key, { data, time: Date.now() })
    },
    clear: (...keys: string[]) => {
        if (keys.length === 0) store.clear()
        else keys.forEach(k => store.delete(k))
    }
}