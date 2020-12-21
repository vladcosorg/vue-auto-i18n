import flatten, { unflatten } from 'flat'
import fetch from 'node-fetch'
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
    const response = await fetch(
      this.apiProxyURL ??
        'https://translation.googleapis.com/language/translate/v2',
      { method: 'POST', body: params as never },
    )
    const jsonReponse = await response.json()

    if (!response.ok) {
      if (jsonReponse.error) {
        throw new Error(
          `${jsonReponse.error.message} [${jsonReponse.error.code} ${jsonReponse.error.status}]`,
        )
      }

      throw new InformativeError('The API return an error response', {
        data: jsonReponse,
      })
    }

    const translatedText = (jsonReponse as TranslationAPIResponse)?.data
      ?.translations[0]?.translatedText
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
