import { hashString } from '../util'

export class CacheKey {
  protected cacheElements: unknown[]
  protected generatedKey?: string

  constructor(...elements: unknown[]) {
    this.cacheElements = elements
  }

  getKey(): string {
    if (!this.generatedKey) {
      this.generatedKey = `${this.cacheElements[0]}-${hashString(
        JSON.stringify(this.cacheElements),
      )}`
    }

    return this.generatedKey
  }
}
