import isPlainObject from 'lodash/isPlainObject'
import reduce from 'lodash/reduce'
import { Messages } from './types'

export function hashString(str: string, seed = 0): number {
  let h1 = 0xde_ad_be_ef ^ seed,
    h2 = 0x41_c6_ce_57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2_654_435_761)
    h2 = Math.imul(h2 ^ ch, 1_597_334_677)
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2_246_822_507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3_266_489_909)
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2_246_822_507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3_266_489_909)
  return 4_294_967_296 * (2_097_151 & h2) + (h1 >>> 0)
}

export function excludeKeys(
  input: Messages,
  blacklistedPaths: string[],
  path?: string,
): Messages {
  return reduce(
    input,
    (result, value, key) => {
      const currentPath = path ? `${path}.${key}` : key
      if (isPlainObject(value)) {
        result[key] = excludeKeys(
          value as Messages,
          blacklistedPaths,
          path ? `${path}.${key}` : key,
        )
      } else {
        if (!blacklistedPaths.includes(currentPath)) {
          result[key] = value
        }
      }

      return result
    },
    {} as Messages,
  )
}

export function splitStringIntoChunks(
  input: string,
  maxLength: number,
): string[] {
  const inputLength = input.length
  if (inputLength <= maxLength) {
    return [input]
  }

  const chunks = []
  let beginIndex = 0
  while (beginIndex < inputLength) {
    let endIndex = beginIndex + maxLength
    let newChunk = input.slice(beginIndex, endIndex)
    // Find possible invalid tags inside a chunk
    // It will also find the tags that don't need the closing pair
    const matches = []
    for (const a of newChunk.matchAll(/<([^/]*?\d+)>/g)) {
      matches.push(a[1])
    }
    if (matches.length > 0) {
      const found = matches
        .map((item) => {
          const needle = `</${item}>`
          const index = input.indexOf(needle, beginIndex)
          if (!index) {
            return
          }

          return index + needle.length
        })
        .filter((item) => item)

      // This may evaluate to false if the found tags don't required the closing pair
      // Or the input contains invalid tags
      if (found.length > 0) {
        endIndex = Math.max(...(found as number[]))
        newChunk = input.slice(beginIndex, endIndex)
      }
    }

    // No invalid tags found
    chunks.push(newChunk)
    beginIndex = endIndex
  }
  return chunks
}
