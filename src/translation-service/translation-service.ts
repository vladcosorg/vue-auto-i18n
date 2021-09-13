import { Locale } from 'vue-i18n'
import { Messages } from '../types'

export interface TranslationService {
  translate(targetLanguage: Locale, messages: Messages): Promise<Messages>
}
