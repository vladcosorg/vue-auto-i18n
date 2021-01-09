import isPlainObject from 'lodash/isPlainObject'
import reduce from 'lodash/reduce'
import { LocaleMessageObject } from 'vue-i18n'

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
  input: LocaleMessageObject,
  blacklistedPaths: string[],
  path?: string,
): LocaleMessageObject {
  return reduce(
    input,
    (result, value, key) => {
      const currentPath = path ? `${path}.${key}` : key
      if (isPlainObject(value)) {
        result[key] = excludeKeys(
          value as LocaleMessageObject,
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
    {} as LocaleMessageObject,
  )
}
