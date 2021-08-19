export interface CacheType {
  has(key: string): Promise<boolean>
  get<T>(key: string): Promise<T | undefined> | T | undefined
  set(key: string, value: unknown): void
}
