import { mount } from '@vue/test-utils'
import { isArray, isObject, isPlainObject, map, mapValues } from 'lodash'
import { mocked } from 'ts-jest/utils'
import {
  createI18n,
  Locale,
  LocaleMessageObject,
  VueI18nOptions,
} from 'vue-i18n'
import { integrateWithVueI18n } from '../../src'
import { Options } from '../../src/integration/vue-i18n'
import { GoogleFree } from '../../src/translation-service/google-free'
import { Messages, VueI18nReturn } from '../../src/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapValuesDeep(obj: any, fn: any, key?: any): any {
  return isArray(obj)
    ? map(obj, (innerObj, idx) => mapValuesDeep(innerObj, fn, idx))
    : isPlainObject(obj)
    ? mapValues(obj, (val, key) => mapValuesDeep(val, fn, key))
    : isObject(obj)
    ? obj
    : fn(obj, key)
}

jest.mock('../../src/translation-service/google-free')
const mockedTranslationAPI = mocked(GoogleFree)

afterEach(() => {
  mockedTranslationAPI.mockReset()
})

function setupWithMessages(
  vueI18nOptions?: VueI18nOptions,
  pluginOptions?: Partial<Options>,
): VueI18nReturn {
  const i18n = createI18n({
    locale: 'en',
    legacy: false,
    ...vueI18nOptions,
  })

  mount(
    {},
    {
      global: {
        plugins: [i18n],
      },
    },
  )

  integrateWithVueI18n({
    i18nPluginInstance: i18n,
    sourceLanguage: 'en',
    translationService: new GoogleFree(),
    ...pluginOptions,
  })

  return i18n
}

function mockWithResponseMessages(responseMessages?: Messages): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const instance = mockedTranslationAPI.mock.instances.pop()!
  instance['translate'] = (
    _targetLanguage: Locale,
    messages: Messages,
  ): Promise<Messages> => {
    return new Promise<Messages>((resolve) => {
      resolve(
        mapValuesDeep(
          responseMessages ?? messages,
          (value: string) => `${value} translated`,
        ),
      )
    })
  }
}

function triggerAndExpect(
  expectationCallback: (args: { i18n: VueI18nReturn }) => void,
  i18n: VueI18nReturn,
  done: (value: void) => void,
): void {
  i18n.global.locale = 'ru'

  // i18n.global.vm.$watch('messages', () => {
  expectationCallback({ i18n })
  done()
  // })
}

function setupMockAndExpect(
  options: {
    vueI18nOptions?: VueI18nOptions
    pluginOptions?: Partial<Options>
    responseMessages?: LocaleMessageObject
  },
  expectation: (args: { i18n: VueI18nReturn }) => void,
): Promise<void> {
  return new Promise((done) => {
    const i18n = setupWithMessages(
      options.vueI18nOptions,
      options.pluginOptions,
    )
    mockWithResponseMessages(options.responseMessages)
    triggerAndExpect(expectation, i18n, done)
  })
}

// eslint-disable-next-line jest/expect-expect
test.skip('That data passes through', () => {
  return setupMockAndExpect(
    {
      vueI18nOptions: {
        messages: {
          en: {
            test: 'foo',
          },
        },
      },
    },
    ({ i18n }) => {
      expect(i18n.global.messages).toEqual({
        test: 'foo translated',
      })
    },
  )
})

test.skip('That that blacklistedPaths ignores the received translations', () => {
  return setupMockAndExpect(
    {
      vueI18nOptions: {
        messages: {
          en: {
            test: 'this should be ignored',
            foo: {
              test: 'foo',
              bar: 'this should be ignored',
            },
          },
        },
      },
      pluginOptions: {
        blacklistedPaths: ['test', 'foo.bar'],
      },
    },
    ({ i18n }) => {
      expect(i18n.global.messages).toEqual({
        test: 'this should be ignored',
        foo: {
          test: 'foo translated',
          bar: 'this should be ignored',
        },
      })
    },
  )
})

test.skip('Ensure that the message functions are not sent for translation', () => {
  return setupMockAndExpect(
    {
      vueI18nOptions: {
        messages: {
          en: {
            test: (): string => 'it should be excluded',
          },
        },
      },
    },
    ({ i18n }) => {
      expect(i18n.global.messages).toHaveProperty('ru')
    },
  )
})
