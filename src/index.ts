import isPlainObject from 'lodash/isPlainObject'
import merge from 'lodash/merge'
import reduce from 'lodash/reduce'
import { IVueI18n, Locale, LocaleMessageObject } from 'vue-i18n'

import { TranslationApi } from './translation-api'

export interface Options {
  i18nPluginInstance: IVueI18n
  apiKey: string
  sourceLanguage: Locale
  apiProxyURL?: string
  automatic?: boolean
  blacklistedPaths?: string[]
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

export function extendWithAutoI18n(
  options: Options,
): (newLocale: string) => void {
  const instance = options.i18nPluginInstance
  const translator = new TranslationApi(options.apiKey, options.apiProxyURL)

  async function translate(newLocale: string): Promise<void> {
    const instance = options.i18nPluginInstance
    const newLocaleMessages = instance.getLocaleMessage(newLocale)
    const newLocaleHasMessages = Object.keys(newLocaleMessages).length
    if (newLocaleHasMessages) {
      return
    }

    const sourceMessages = instance.messages[options.sourceLanguage]
    let messagesForTranslation = sourceMessages

    messagesForTranslation = excludeKeys(
      messagesForTranslation,
      options.blacklistedPaths ?? [],
    )

    let translatedMessages = await translator.translate(
      newLocale,
      messagesForTranslation,
    )

    translatedMessages = merge(sourceMessages, translatedMessages)

    instance.setLocaleMessage(newLocale, translatedMessages)
  }

  if (options.automatic === undefined || options.automatic) {
    instance.vm.$watch('locale', translate)
  }

  return translate
}
