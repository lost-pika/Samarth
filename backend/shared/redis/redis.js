import Redis from "ioredis"

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
        // Reconnect after delay, cap at 5 seconds
        return Math.min(times * 1000, 5000)
    },
    enableOfflineQueue: false
})

let hasLoggedError = false

redis.on("connect", () => {
    hasLoggedError = false
    console.log("redis connected")
})

redis.on("error", (err) => {
    if (!hasLoggedError) {
        console.warn(`[Redis Notice] Connection to ${redisUrl} failed: ${err.message || 'ECONNREFUSED'}. Redis features may be unavailable until Redis is started.`)
        hasLoggedError = true
    }
})

export default redis