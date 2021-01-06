import { GoogleFree } from './service/google-free'
import { TranslationService } from './translation-service'
import isPlainObject from 'lodash/isPlainObject'
import merge from 'lodash/merge'
import reduce from 'lodash/reduce'
import { IVueI18n, Locale, LocaleMessageObject } from 'vue-i18n'

export interface Options {
  i18nPluginInstance: IVueI18n
  sourceLanguage: Locale
  apiProxyURL?: string
  automatic?: boolean
  blacklistedPaths?: string[]
  onReady?: () => void
  translationService?: TranslationService
}

export function extendWithAutoI18n(
  options: Options,
): (newLocale: string) => void {
  const instance = options.i18nPluginInstance

  function runOnReadyCallback(): void {
    if (!options.onReady) {
      return
    }

    options.onReady()
  }

  async function translate(newLocale: string): Promise<void> {
    const instance = options.i18nPluginInstance
    const newLocaleMessages = instance.getLocaleMessage(newLocale)
    const newLocaleHasMessages = Object.keys(newLocaleMessages).length
    if (newLocaleHasMessages) {
      runOnReadyCallback()
      return
    }

    const sourceMessages = instance.messages[options.sourceLanguage]
    let messagesForTranslation = sourceMessages

    messagesForTranslation = excludeKeys(
      messagesForTranslation,
      options.blacklistedPaths ?? [],
    )

    let translatedMessages = await (
      options.translationService ?? new GoogleFree()
    ).translate(newLocale, messagesForTranslation)

    translatedMessages = merge(sourceMessages, translatedMessages)

    instance.setLocaleMessage(newLocale, translatedMessages)
    runOnReadyCallback()
  }

  if (options.automatic === undefined || options.automatic) {
    instance.vm.$watch('locale', translate)
  }

  return translate
}

function excludeKeys(
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

export { TranslationService }
