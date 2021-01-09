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

export function integrateWithVueI18n(
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
