import { CacheKey } from './cache-key'

export interface CacheType {
  has(key: CacheKey): Promise<boolean>
  get<T>(key: CacheKey): Promise<T | undefined> | T | undefined
  set(key: CacheKey, value: unknown): Promise<void> | void
}
