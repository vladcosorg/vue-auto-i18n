import { unflatten } from 'flat'
import { LocaleMessageObject } from 'vue-i18n'

export type TranslationMap = Map<string, string>
export abstract class GoogleBase {
  protected linkedMessageIndex: string[] = []
  protected placeholderIndex: string[] = []
  protected debug: {
    initial?: string
    sendEncoded?: string
    receivedEncoded?: string
    final?: string
  }[] = []

  protected encode(input: TranslationMap): string {
    let outputXml = ''
    let index = 0
    for (const translationValue of input.values()) {
      this.debug[index] = { initial: translationValue }
      outputXml += this.debug[
        index
      ].sendEncoded = `<b${index}>${this.escapePlaceholders(
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
        ` ${replacement}`,
      )
    })

    let index = 0
    for (const translationKey of translationMap.keys()) {
      const regex = new RegExp(
        `<\\s?b${index}\\s?>([\\s\\S]*?)<\\s?/\\s?b${index}\\s?>`,
        'i',
      )
      const match = input.match(regex)
      if (match) {
        output[translationKey] = match[1].trim()
      }

      index++
    }

    return unflatten(output)
  }
}
