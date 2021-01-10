import { integrateWithVueI18n, ManualTranslator } from './integration/vue-i18n'
import { translateMessageObject } from './translator'
import { TranslationService } from './translation-service/translation-service'
import { CacheType } from './cache/cache-type'
import { InMemoryCache } from './cache/type/in-memory-cache'

export {
  integrateWithVueI18n,
  translateMessageObject,
  TranslationService,
  CacheType,
  ManualTranslator,
  InMemoryCache,
}
