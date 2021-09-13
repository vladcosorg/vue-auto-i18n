import merge from 'lodash/merge'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { getDiff } from 'recursive-diff'
import { Locale, LocaleMessageObject } from 'vue-i18n'
import { CacheType } from './cache/cache-type'
import { ChainedCache } from './cache/type/chained-cache'
import { InMemoryCache } from './cache/type/in-memory-cache'
import {
  createFingerprintedEnvelope,
  FingerprintedPayload,
  wrapIntoFingerprintedEnvelope,
} from './fingerprinted-payload'
import { TranslationService } from './translation-service/translation-service'
import { Messages } from './types'
import { excludeKeys } from './util'

const defaultCache = new InMemoryCache()

export interface TranslatorOptions {
  blacklistedPaths?: string[]
  translationService: TranslationService
  sourceLanguage: Locale
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
  sourceMessages: Messages,
  newLocale: string,
  options: TranslatorOptions,
): Promise<Messages> {
  if (newLocale === options.sourceLanguage) {
    return sourceMessages
  }

  const cache = getCache(options)

  const fingerprintedCurrentMessages = wrapIntoFingerprintedEnvelope(
    sourceMessages,
  )
  const masterFingerprint = fingerprintedCurrentMessages.fingerprint

  let messagesForTranslation = sourceMessages
  messagesForTranslation = excludeKeys(
    messagesForTranslation,
    options.blacklistedPaths ?? [],
  )

  const cacheKey = newLocale

  if (await cache.has(cacheKey)) {
    const payloadEnvelope = (await cache.get(
      cacheKey,
    )) as FingerprintedPayload<{
      source: LocaleMessageObject
      translated: LocaleMessageObject
    }>

    if (payloadEnvelope.fingerprint === masterFingerprint) {
      return merge({}, sourceMessages, payloadEnvelope.payload.translated)
    }

    const diff = getDiff(payloadEnvelope.payload.source, sourceMessages)
    const updatedTranslations = payloadEnvelope.payload.translated
    const newMessages = {}
    for (const diffItem of diff) {
      if (diffItem.op === 'delete') {
        unset(updatedTranslations, diffItem.path)
      } else {
        set(newMessages, diffItem.path, diffItem.val)
      }
    }
    const partialMessages = await options.translationService.translate(
      newLocale,
      newMessages,
    )

    const merged = merge(
      {},
      sourceMessages,
      updatedTranslations,
      partialMessages,
    )

    cache.set(
      cacheKey,
      createFingerprintedEnvelope(masterFingerprint, {
        source: sourceMessages,
        translated: merged,
      }),
    )

    return merged
  } else {
    const outputMessages = await options.translationService.translate(
      newLocale,
      messagesForTranslation,
    )

    cache.set(
      cacheKey,
      createFingerprintedEnvelope(masterFingerprint, {
        source: messagesForTranslation,
        translated: outputMessages,
      }),
    )

    return merge({}, sourceMessages, outputMessages)
  }
}
