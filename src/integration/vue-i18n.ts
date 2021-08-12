import { IVueI18n, Locale } from 'vue-i18n'
import { TranslationService } from '../translation-service/translation-service'
import { translateMessageObject, TranslatorOptions } from '../translator'
import merge from 'lodash/merge'
import isEmpty from 'lodash/isEmpty'

export interface Options extends TranslatorOptions {
  i18nPluginInstance: IVueI18n
  sourceLanguage: Locale
  automatic?: boolean
  blacklistedPaths?: string[]
  onReady?: () => void
  translationService: TranslationService
}

export type ManualTranslator = (newLocale: string) => Promise<void>

export function integrateWithVueI18n(options: Options): ManualTranslator {
  const instance = options.i18nPluginInstance
  const translatedLocales: Set<string> = new Set()

  function runOnReadyCallback(): void {
    if (!options.onReady) {
      return
    }

    options.onReady()
  }

  const translate: ManualTranslator = async (newLocale: string) => {
    // TODO: Check structuraly if the keys differ and bail if they are the same
    if (translatedLocales.has(newLocale)) {
      runOnReadyCallback()
      return
    }

    const instance = options.i18nPluginInstance
    const existingTranslationsForTheLocale = instance.getLocaleMessage(
      newLocale,
    )

    let translatedMessages = await translateMessageObject(
      instance.messages[options.sourceLanguage],
      newLocale,
      options,
    )

    if (!isEmpty(existingTranslationsForTheLocale)) {
      translatedMessages = merge(
        translatedMessages,
        existingTranslationsForTheLocale,
      )
    }

    instance.setLocaleMessage(newLocale, translatedMessages)
    translatedLocales.add(newLocale)

    runOnReadyCallback()
  }

  if (options.automatic === undefined || options.automatic) {
    instance.vm.$watch('locale', translate)
  }

  return translate
}
