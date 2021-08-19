import { GoogleFree } from '../../src/translation-service/google-free'
import { InMemoryCache, translateMessageObject } from '../../src'

const translate = jest.fn().mockImplementation((_locale, object) => object)
jest.mock('../../src/translation-service/google-free', () => {
  return {
    GoogleFree: jest.fn().mockImplementation(() => {
      return { translate }
    }),
  }
})
beforeEach(() => {
  translate.mockClear()
})

test('Repeated call returns from the in-memory cache', async () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  async function doWork() {
    await translateMessageObject({ test: 'foo' }, 'fr', {
      sourceLanguage: 'en',
      translationService: new GoogleFree(),
    })
  }

  const liveResult = await doWork()
  // this call should be cached
  const cachedResult = await doWork()

  expect(translate).toHaveBeenCalledTimes(1)
  expect(liveResult).toEqual(cachedResult)
})

test('Only changed parts of the source should be sent for translation', async () => {
  const cache = new InMemoryCache()

  await translateMessageObject(
    {
      unchanged: '1',
      unchangedDeep: { one: 'one' },
      changed: 'two',
      changedFromFlatToDeep: 'three',
      changedDeep: {
        two: 'two',
      },
      deleted: '4',
      deletedDeep: {
        foo: 'bar',
        bar: 'foo',
      },
    },
    'fr',
    {
      cache,
      sourceLanguage: 'en',
      translationService: new GoogleFree(),
    },
  )

  await translateMessageObject(
    {
      unchanged: '1',
      unchangedDeep: { one: 'one' },
      changed: 'four',
      changedFromFlatToDeep: {
        five: 'five',
      },
      changedDeep: {
        two: 'five',
      },
      deletedDeep: {
        bar: 'foo',
      },
    },
    'fr',
    {
      cache,
      sourceLanguage: 'en',
      translationService: new GoogleFree(),
    },
  )
  // console.log(cache)
  expect(translate).toHaveBeenLastCalledWith('fr', {
    changed: 'four',
    changedFromFlatToDeep: {
      five: 'five',
    },
    changedDeep: {
      two: 'five',
    },
  })
})

test('Deleted source translations are deleted in output', async () => {
  const cache = new InMemoryCache()

  await translateMessageObject(
    {
      deleted: 'bar',
      kept: 'foo',
    },
    'fr',
    {
      cache,
      sourceLanguage: 'en',
      translationService: new GoogleFree(),
    },
  )

  const result = await translateMessageObject(
    {
      kept: 'foo',
    },
    'fr',
    {
      cache,
      sourceLanguage: 'en',
      translationService: new GoogleFree(),
    },
  )
  expect(result).toStrictEqual({
    kept: 'foo',
  })
})
