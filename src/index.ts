import { VueConstructor } from 'vue/types/vue'
import { TranslationApi } from './translation-api'
import { IVueI18n, Locale } from 'vue-i18n'

interface Options {
  i18nPluginInstance: IVueI18n
  apiKey: string
  sourceLanguage: Locale
  apiProxyURL?: string
}

export default {
  // install(vue: VueConstructor, options: Options): void {},
}

export function extend(options: Options) {
  const instance = options.i18nPluginInstance
  const translator = new TranslationApi(options.apiKey, options.apiProxyURL)
  instance.vm.$watch(
    'locale',
    async (newLocale: string) => {
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
      instance.setLocaleMessage(newLocale, translatedMessages)
    },
    { immediate: true },
  )
}
