import { CacheKey } from './cache-key'

export interface CacheType {
  has(key: CacheKey): boolean
  get<T>(key: CacheKey): T | undefined
  set(key: CacheKey, value: unknown): void
}
