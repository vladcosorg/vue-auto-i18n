import { hashString } from '../util'

export class CacheKey {
  protected cacheElements: unknown[]
  protected generatedKey?: number
  constructor(...elements: unknown[]) {
    this.cacheElements = elements
  }

  getKey(): number {
    if (!this.generatedKey) {
      this.generatedKey = hashString(JSON.stringify(this.cacheElements))
    }

    return this.generatedKey
  }
}
