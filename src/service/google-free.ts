import translate from '@vitalets/google-translate-api'
import { TranslationService } from '../translation-service'

import flatten, { unflatten } from 'flat'
import { Locale, LocaleMessageObject } from 'vue-i18n'

type TranslationMap = Map<string, string>

export class GoogleFree implements TranslationService {
  protected linkedMessageIndex: string[] = []
  protected placeholderIndex: string[] = []

  async translate(
    targetLanguage: Locale,
    messages: LocaleMessageObject,
  ): Promise<LocaleMessageObject> {
    const translationMap: TranslationMap = new Map(
      Object.entries(flatten(messages)),
    )
    const encodedPayload = this.encode(translationMap)

    const translatedText = await this.sendRequestAndGetResponse(
      encodedPayload,
      targetLanguage,
    )
    return this.decode(translatedText, translationMap)
  }

  protected async sendRequestAndGetResponse(
    encodedPayload: string,
    targetLanguage: string,
  ): Promise<string> {
    const response = await translate(encodedPayload, { to: targetLanguage })
    return response.text
  }

  protected encode(input: TranslationMap): string {
    let outputXml = ''
    let index = 0
    for (const translationValue of input.values()) {
      outputXml += `<b${index}>${this.escapePlaceholders(
        this.escapeLinkedMessages(translationValue),
      )}</b${index}>`
      index++
    }
    return outputXml
  }

  protected escapePlaceholders<T extends string | number>(
    unescapedMessage: T,
  ): T {
    if (typeof unescapedMessage == 'string' && unescapedMessage.includes('{')) {
      return unescapedMessage.replace(/({.*?})/g, (...matches) => {
        const length = this.placeholderIndex.push(matches[1])
        return `<p${length - 1}/>`
      }) as T
    }

    return unescapedMessage
  }

  protected escapeLinkedMessages<T extends string | number>(
    unescapedMessage: T,
  ): T {
    if (typeof unescapedMessage == 'string' && unescapedMessage.includes('@')) {
      return unescapedMessage.replace(/(@([.:])[^\s)]+\)?)/g, (...matches) => {
        const length = this.linkedMessageIndex.push(matches[1])
        return `<l${length - 1}/>`
      }) as T
    }

    return unescapedMessage
  }

  protected decode(
    input: string,
    translationMap: TranslationMap,
  ): LocaleMessageObject {
    const output: Record<string, string> = {}

    this.linkedMessageIndex.forEach((replacement, index) => {
      input = input.replace(
        new RegExp(`<\\s?l\\s?${index}\\s?/\\s?>`, 'i'),
        replacement,
      )
    })

    this.placeholderIndex.forEach((replacement, index) => {
      input = input.replace(
        new RegExp(`<\\s?p\\s?${index}\\s?/\\s?>`, 'i'),
        replacement,
      )
    })

    let index = 0
    for (const translationKey of translationMap.keys()) {
      const regex = new RegExp(
        `<\\s?b${index}\\s?>(.*?)<\\s?/\\s?b${index}\\s?>`,
        'i',
      )
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
