const store = new Map<string, { data: any; time: number }>()
const TTL = 30_000 // 30 detik

export const apiCache = {
    get: (key: string) => {
        const cached = store.get(key)
        if (cached && Date.now() - cached.time < TTL) return cached.data
        return null
    },
    set: (key: string, data: any) => {
        store.set(key, { data, time: Date.now() })
    },
    clear: (key: string) => store.delete(key)
}