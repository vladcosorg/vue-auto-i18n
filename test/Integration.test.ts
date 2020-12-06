import { TranslationApi } from '@/translation-api'
import { mocked } from 'ts-jest/utils'
import VueI18n, { IVueI18n, Locale, LocaleMessageObject } from 'vue-i18n'
import { createLocalVue } from '@vue/test-utils'
import { extendWithAutoI18n } from '@/index'

jest.mock('@/translation-api')
const mockedTranslationAPI = mocked(TranslationApi)

test('That vue-i18n properly integrates with this plugin', () => {
  return new Promise((done) => {
    const Vue = createLocalVue()
    Vue.use(VueI18n)
    const i18n = (new VueI18n({
      locale: 'en',
      messages: {
        en: {
          test: 'foo',
        },
      },
    }) as unknown) as IVueI18n
    extendWithAutoI18n({
      i18nPluginInstance: i18n,
      sourceLanguage: 'en',
      apiKey: 'test',
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

test('That that blacklistedPaths ignores the received translations', () => {
  return new Promise((done) => {
    const Vue = createLocalVue()
    Vue.use(VueI18n)
    const i18n = (new VueI18n({
      locale: 'en',
      messages: {
        en: {
          test: 'this should be ignored',
          foo: {
            bar: 'this should be replaced',
          },
        },
      },
    }) as unknown) as IVueI18n
    extendWithAutoI18n({
      i18nPluginInstance: i18n,
      sourceLanguage: 'en',
      apiKey: 'test',
      blacklistedPaths: ['test', 'foo.bar'],
    })

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const instance = mockedTranslationAPI.mock.instances.pop()!
    instance['translate'] = (
      targetLanguage: Locale,
      messages: LocaleMessageObject,
    ): Promise<LocaleMessageObject> => {
      return new Promise<LocaleMessageObject>((resolve) =>
        resolve({
          test: 'bar',
          foo: {
            bar: 'foo',
          },
        }),
      )
    }

    i18n.vm.$watch('messages', () => {
      expect(i18n.messages.ru).toEqual({
        test: 'this should be ignored',
        foo: {
          bar: 'this should be replaced',
        },
      })
      done()
    })

    i18n.locale = 'ru'
  })
})
