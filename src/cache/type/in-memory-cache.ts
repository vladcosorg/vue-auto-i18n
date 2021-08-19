import { CacheType } from '../cache-type'

export class InMemoryCache implements CacheType {
  protected cache = new Map()

  public async has(key: string): Promise<boolean> {
    return this.cache.has(key)
  }

  public get<T>(key: string): T | undefined {
    return this.cache.get(key)
  }

  public set(key: string, value: unknown): void {
    this.cache.set(key, value)
  }
}
