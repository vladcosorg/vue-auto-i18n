import { VueConstructor } from 'vue/types/vue'
import { TranslationApi } from './translation-api'
import { IVueI18n, Locale } from 'vue-i18n'

interface Options {
  i18nPluginInstance: IVueI18n
  apiKey: string
  sourceLanguage: Locale
}

export default {
  // install(vue: VueConstructor, options: Options): void {},
}

export function extend(options: Options) {
  const instance = options.i18nPluginInstance
  const translator = new TranslationApi(options.apiKey)
  instance.vm.$watch(
    'locale',
    async (newLocale: string) => {
      // console.log(newLocale)
      const newLocaleMessages = instance.getLocaleMessage(newLocale)
      // console.log(newLocaleMessages)
      const newLocaleHasMessages = Object.keys(newLocaleMessages).length
      // console.log(newLocaleHasMessages)
      if (newLocaleHasMessages) {
        return
      }
      const sourceMessages = instance.getLocaleMessage(options.sourceLanguage)
      // console.log(sourceMessages)
      const translatedMessages = await translator.translate(
        newLocale,
        sourceMessages,
      )
      instance.setLocaleMessage(newLocale, translatedMessages)
    },
    { immediate: true },
  )
}
