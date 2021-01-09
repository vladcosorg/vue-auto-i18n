import { CacheKey } from '../cache-key'
import { CacheType } from '../cache-type'

export class InMemoryCache implements CacheType {
  protected cache = new Map()

  public has(key: CacheKey): boolean {
    return this.cache.has(key.getKey())
  }

  public get<T>(key: CacheKey): T | undefined {
    return this.cache.get(key.getKey())
  }

  public set(key: CacheKey, value: unknown): void {
    this.cache.set(key.getKey(), value)
  }
}
