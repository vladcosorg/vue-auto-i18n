import { createLocalVue } from '@vue/test-utils'
import { map, isArray, isObject, isPlainObject, mapValues } from 'lodash'
import { mocked } from 'ts-jest/utils'
import VueI18n, {
  IVueI18n,
  I18nOptions,
  Locale,
  LocaleMessageObject,
} from 'vue-i18n'
import { Options } from '../../src/integration/vue-i18n'
import { GoogleFree } from '../../src/translation-service/google-free'
import { integrateWithVueI18n } from '../../src'

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
  vueI18nOptions?: I18nOptions,
  pluginOptions?: Partial<Options>,
): IVueI18n {
  const Vue = createLocalVue()
  Vue.use(VueI18n)
  const i18n = (new VueI18n({
    locale: 'en',
    ...vueI18nOptions,
  }) as unknown) as IVueI18n
  integrateWithVueI18n({
    i18nPluginInstance: i18n,
    sourceLanguage: 'en',
    translationService: new GoogleFree(),
    ...pluginOptions,
  })
  return i18n
}

function mockWithResponseMessages(
  responseMessages?: LocaleMessageObject,
): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const instance = mockedTranslationAPI.mock.instances.pop()!
  instance['translate'] = (
    _targetLanguage: Locale,
    messages: LocaleMessageObject,
  ): Promise<LocaleMessageObject> => {
    return new Promise<LocaleMessageObject>((resolve) => {
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
  expectationCallback: (args: { i18n: IVueI18n }) => void,
  i18n: IVueI18n,
  done: (value: void) => void,
): void {
  i18n.locale = 'ru'

  i18n.vm.$watch('messages', () => {
    expectationCallback({ i18n })
    done()
  })
}

function setupMockAndExpect(
  options: {
    vueI18nOptions?: I18nOptions
    pluginOptions?: Partial<Options>
    responseMessages?: LocaleMessageObject
  },
  expectation: (args: { i18n: IVueI18n }) => void,
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
      expect(i18n.messages.ru).toEqual({
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
      expect(i18n.messages.ru).toEqual({
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
      expect(i18n.messages.ru).toEqual({})
    },
  )
})
