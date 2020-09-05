import axios from 'axios'
import { Locale, LocaleMessageObject } from 'vue-i18n'
import flatten, { unflatten } from 'flat'

export type TranslationAPIResponse = {
  data: { translations: { translatedText: string }[] }
}

export class TranslationApi {
  constructor(private readonly apiKey: string) {}
  async translate(
    targetLanguage: Locale,
    messages: LocaleMessageObject,
  ): Promise<LocaleMessageObject> {
    const params = new URLSearchParams({
      q: this.encode(messages),
      target: targetLanguage,
      format: 'text',
      key: this.apiKey,
    })

    const flatMessageKeys = Object.keys(flatten(messages))
    const response = await axios.post<TranslationAPIResponse>(
      'https://translation.googleapis.com/language/translate/v2',
      params,
    )
    return this.decode(
      response.data.data.translations[0].translatedText,
      flatMessageKeys,
    )
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

      output[translationKey] = match[1]
    }

    return unflatten(output)
  }
}
