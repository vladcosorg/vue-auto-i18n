import { TranslationApi } from './translation-api'
import { IVueI18n, Locale } from 'vue-i18n'
import get from 'lodash/get'
import set from 'lodash/set'

interface Options {
  i18nPluginInstance: IVueI18n
  apiKey: string
  sourceLanguage: Locale
  apiProxyURL?: string
  automatic?: boolean
  blacklistedPaths?: string[]
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
    const sourceMessages = instance.getLocaleMessage(options.sourceLanguage)
    const translatedMessages = await translator.translate(
      newLocale,
      sourceMessages,
    )

    if (options.blacklistedPaths) {
      for (const path of options.blacklistedPaths) {
        set(translatedMessages, path, get(sourceMessages, path))
      }
    }

    instance.setLocaleMessage(newLocale, translatedMessages)
  }

  if (options.automatic === undefined || options.automatic) {
    instance.vm.$watch('locale', translate)
  }

  return translate
}
