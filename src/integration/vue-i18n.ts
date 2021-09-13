import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'
import { Locale } from 'vue-i18n'
import { TranslationService } from '../translation-service/translation-service'
import { translateMessageObject, TranslatorOptions } from '../translator'
import { VueI18nReturn } from '../types'

export interface Options extends TranslatorOptions {
  i18nPluginInstance: VueI18nReturn
  sourceLanguage: Locale
  automatic?: boolean
  blacklistedPaths?: string[]
  onReady?: () => void
  translationService: TranslationService
}

export type ManualTranslator = (newLocale: string) => Promise<void>

export function integrateWithVueI18n(options: Options): ManualTranslator {
  // const instance = options.i18nPluginInstance
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
    const existingTranslationsForTheLocale = instance.global.getLocaleMessage(
      newLocale,
    )

    let translatedMessages = await translateMessageObject(
      instance.global.getLocaleMessage(options.sourceLanguage),
      newLocale,
      options,
    )

    if (!isEmpty(existingTranslationsForTheLocale)) {
      translatedMessages = merge(
        translatedMessages,
        existingTranslationsForTheLocale,
      )
    }

    instance.global.setLocaleMessage(newLocale, translatedMessages)
    translatedLocales.add(newLocale)

    runOnReadyCallback()
  }

  if (options.automatic === undefined || options.automatic) {
    // instance.vm.$watch('locale', translate)
  }

  return translate
}
