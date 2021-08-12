import merge from 'lodash/merge'
import { Locale, LocaleMessageObject } from 'vue-i18n'
import { CacheKey } from './cache/cache-key'
import { CacheType } from './cache/cache-type'
import { ChainedCache } from './cache/type/chained-cache'
import { InMemoryCache } from './cache/type/in-memory-cache'
import { TranslationService } from './translation-service/translation-service'
import { excludeKeys } from './util'

const defaultCache = new InMemoryCache()

export interface TranslatorOptions {
  blacklistedPaths?: string[]
  translationService: TranslationService
  sourceLanguage?: Locale
  cache?: CacheType | CacheType[]
}

function getCache(options: TranslatorOptions): CacheType {
  let cache: CacheType = defaultCache
  if (options.cache) {
    cache = Array.isArray(options.cache)
      ? new ChainedCache(...options.cache)
      : options.cache
  }
  return cache
}

export async function translateMessageObject(
  sourceMessages: LocaleMessageObject,
  newLocale: string,
  options: TranslatorOptions,
): Promise<LocaleMessageObject> {
  let messagesForTranslation = sourceMessages
  messagesForTranslation = excludeKeys(
    messagesForTranslation,
    options.blacklistedPaths ?? [],
  )

  const cache = getCache(options)
  const cacheKey = new CacheKey(newLocale, messagesForTranslation)

  let outputMessages: LocaleMessageObject
  if (await cache.has(cacheKey)) {
    outputMessages = (await cache.get<LocaleMessageObject>(
      cacheKey,
    )) as LocaleMessageObject
  } else {
    outputMessages = await options.translationService.translate(
      newLocale,
      messagesForTranslation,
    )

    cache.set(cacheKey, outputMessages)
  }

  return merge({}, sourceMessages, outputMessages)
}
