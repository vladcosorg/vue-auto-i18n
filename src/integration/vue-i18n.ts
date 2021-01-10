import { IVueI18n, Locale } from 'vue-i18n'
import { TranslationService } from '../translation-service/translation-service'
import { translateMessageObject, TranslatorOptions } from '../translator'

export interface Options extends TranslatorOptions {
  i18nPluginInstance: IVueI18n
  sourceLanguage: Locale
  automatic?: boolean
  blacklistedPaths?: string[]
  onReady?: () => void
  translationService?: TranslationService
}

export type ManualTranslator = (newLocale: string) => Promise<void>

export function integrateWithVueI18n(options: Options): ManualTranslator {
  const instance = options.i18nPluginInstance

  function runOnReadyCallback(): void {
    if (!options.onReady) {
      return
    }

    options.onReady()
  }

  const translate: ManualTranslator = async (newLocale: string) => {
    const instance = options.i18nPluginInstance
    const newLocaleMessages = instance.getLocaleMessage(newLocale)
    const newLocaleHasMessages = Object.keys(newLocaleMessages).length
    if (newLocaleHasMessages) {
      runOnReadyCallback()
      return
    }

    const translatedMessages = await translateMessageObject(
      instance.messages[options.sourceLanguage],
      newLocale,
      options,
    )

    instance.setLocaleMessage(newLocale, translatedMessages)
    runOnReadyCallback()
  }

  if (options.automatic === undefined || options.automatic) {
    instance.vm.$watch('locale', translate)
  }

  return translate
}
