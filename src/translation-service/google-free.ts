import translate from '@vitalets/google-translate-api'
import { Messages } from '../types'
import { splitStringIntoChunks } from '../util'
import { GoogleBase, TranslationMap } from './google-base'
import { TranslationService } from './translation-service'

import flatten from 'flat'
import { Locale } from 'vue-i18n'

export class GoogleFree extends GoogleBase implements TranslationService {
  protected linkedMessageIndex: string[] = []
  protected placeholderIndex: string[] = []
  protected debug: {
    initial?: string
    sendEncoded?: string
    receivedEncoded?: string
    final?: string
  }[] = []

  async translate(
    targetLanguage: Locale,
    messages: Messages,
  ): Promise<Messages> {
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
    const splitPayloads = []
    if (encodedPayload.length > 5000) {
      splitPayloads.push(...splitStringIntoChunks(encodedPayload, 4000))
    } else {
      splitPayloads.push(encodedPayload)
    }
    const result = []
    for (const payload of splitPayloads) {
      const response = await translate(payload, {
        to: targetLanguage,
      })
      result.push(response.text)
    }
    return result.join('')
  }
}
