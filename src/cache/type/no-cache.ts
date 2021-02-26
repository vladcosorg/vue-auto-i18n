import { CacheType } from '../cache-type'

export class NoCache implements CacheType {
  public async has(): Promise<boolean> {
    return false
  }

  public get<T>(): T | undefined {
    return
  }

  public set(): void {
    return
  }
}
