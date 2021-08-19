import { CacheType } from '../cache-type'

export class ChainedCache implements CacheType {
  protected cacheChain: CacheType[] = []
  constructor(...caches: CacheType[]) {
    this.cacheChain = caches
  }
  async get<T>(key: string): Promise<T | undefined> {
    const failedCaches: CacheType[] = []
    for (const cache of this.cacheChain) {
      const result = cache.get<T>(key)

      if (result !== undefined) {
        if (failedCaches.length > 0) {
          failedCaches.map((cache) => cache.set(key, result))
        }
        return result
      }

      failedCaches.push(cache)
    }

    return
  }
  async has(key: string): Promise<boolean> {
    for (const cache of this.cacheChain) {
      const result = await cache.has(key)

      if (result) {
        return result
      }
    }

    return false
  }

  set(key: string, value: unknown): void {
    for (const cache of this.cacheChain) {
      cache.set(key, value)
    }
  }
}
