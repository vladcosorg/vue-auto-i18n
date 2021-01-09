import { Locale, LocaleMessageObject } from 'vue-i18n'

export interface TranslationService {
  translate(
    targetLanguage: Locale,
    messages: LocaleMessageObject,
  ): Promise<LocaleMessageObject>
}
