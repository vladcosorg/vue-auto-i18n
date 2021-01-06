import { TranslationService } from '@/translation-service'
import { Locale, LocaleMessageObject } from 'vue-i18n'
import fetch, { RequestInfo, RequestInit } from 'node-fetch'

class Proxy implements TranslationService {
  constructor(protected url: RequestInfo, protected init?: RequestInit) {}
  async translate(
    targetLanguage: Locale,
    messages: LocaleMessageObject,
  ): Promise<LocaleMessageObject> {
    const response = await fetch(
      this.url,
      Object.assign({}, this.init, {
        body: new URLSearchParams({
          targetLanguage,
        }),
      }),
    )
    const jsonReponse = await response.json()
    return jsonReponse
  }
}
