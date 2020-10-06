import { TranslationApi } from '@/translation-api'
import { mocked } from 'ts-jest/utils'
import VueI18n, { IVueI18n, Locale, LocaleMessageObject } from 'vue-i18n'
import Vue from 'vue'
import vueAutoI18n from '../src/index'

jest.mock('@/translation-api')
const mockedTranslationAPI = mocked(TranslationApi)

test('That vue-i18n properly integrates with this plugin', () => {
  return new Promise((done) => {
    Vue.use(VueI18n)
    const i18n = (new VueI18n({
      locale: 'en',
      messages: {
        en: {
          test: 'foo',
        },
      },
    }) as unknown) as IVueI18n
    Vue.use(vueAutoI18n, {
      i18nPluginInstance: i18n,
      sourceLanguage: 'en',
    })
    const instance = mockedTranslationAPI.mock.instances[0]
    instance['translate'] = (
      targetLanguage: Locale,
      messages: LocaleMessageObject,
    ): Promise<LocaleMessageObject> => {
      return new Promise<LocaleMessageObject>((resolve) => resolve(messages))
    }

    i18n.locale = 'ru'

    i18n.vm.$watch('messages', () => {
      expect(i18n.messages.ru).toEqual({
        test: 'foo',
      })
      done()
    })
  })
})
