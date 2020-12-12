import axios from 'axios'
import flatten, { unflatten } from 'flat'
import { Locale, LocaleMessageObject } from 'vue-i18n'

import { InformativeError } from './error'

type TranslationAPIResponse = {
  data: { translations: { translatedText: string }[] }
}

export class TranslationApi {
  constructor(
    private readonly apiKey: string,
    private readonly apiProxyURL?: string,
  ) {}
  async translate(
    targetLanguage: Locale,
    messages: LocaleMessageObject,
  ): Promise<LocaleMessageObject> {
    const params = new URLSearchParams({
      q: this.encode(messages),
      target: targetLanguage,
      format: 'html',
      key: this.apiKey,
    })
    const flatMessageKeys = Object.keys(flatten(messages))

    let response
    try {
      response = await axios.post<TranslationAPIResponse>(
        this.apiProxyURL ??
          'https://translation.googleapis.com/language/translate/v2',
        params,
      )
    } catch (error) {
      if (error.response) {
        throw new Error(
          `${error.response.data.error.message} [${error.response.data.error.code} ${error.response.data.error.status}]`,
        )
      }

      throw error
    }

    const translatedText = response?.data?.data?.translations[0]?.translatedText
    if (!translatedText) {
      throw new InformativeError('Unexpected response structure', {
        response,
      })
    }

    return this.decode(translatedText, flatMessageKeys)
  }

  private encode(input: LocaleMessageObject): string {
    let outputXml = ''
    for (const [translationKey, translationValue] of Object.entries(
      flatten(input),
    )) {
      outputXml += `<${translationKey}>${translationValue}</${translationKey}>`
    }

    return outputXml
  }

  private decode(input: string, keys: string[]): LocaleMessageObject {
    const output: Record<string, string> = {}
    for (const translationKey of keys) {
      const regex = new RegExp(`<${translationKey}>(.*?)</${translationKey}>`)
      const match = input.match(regex)
      if (!match) {
        continue
      }

      output[translationKey] = match[1].trim()
    }

    return unflatten(output)
  }
}
