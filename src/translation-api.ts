import flatten, { unflatten } from 'flat'
import fetch from 'node-fetch'
import { Locale, LocaleMessageObject } from 'vue-i18n'

import { InformativeError } from './error'

type TranslationAPIResponse = {
  data: { translations: { translatedText: string }[] }
}

type TranslationMap = Map<string, string>

export class TranslationApi {
  constructor(
    private readonly apiKey: string,
    private readonly apiProxyURL?: string,
  ) {}
  async translate(
    targetLanguage: Locale,
    messages: LocaleMessageObject,
  ): Promise<LocaleMessageObject> {
    const translationMap: TranslationMap = new Map(
      Object.entries(flatten(messages)),
    )
    const params = new URLSearchParams({
      q: this.encode(translationMap),
      target: targetLanguage,
      format: 'html',
      key: this.apiKey,
    })
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
    return this.decode(translatedText, translationMap)
  }

  private encode(input: TranslationMap): string {
    let outputXml = ''
    let index = 0
    for (const translationValue of input.values()) {
      outputXml += `<t${index}>${translationValue}</t${index}>`
      index++
    }

    return outputXml
  }

  private decode(
    input: string,
    translationMap: TranslationMap,
  ): LocaleMessageObject {
    const output: Record<string, string> = {}
    let index = 0
    for (const translationKey of translationMap.keys()) {
      const regex = new RegExp(`<t${index}>(.*?)</t${index}>`)
      const match = input.match(regex)
      if (!match) {
        continue
      }

      output[translationKey] = match[1].trim()
      index++
    }
    return unflatten(output)
  }
}
