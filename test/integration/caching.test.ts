import { GoogleFree } from '../../src/translation-service/google-free'
import { translateMessageObject } from '../../src'

const translate = jest.fn().mockReturnValue({ test: 'translated' })
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
      translationService: new GoogleFree(),
    })
  }

  const liveResult = await doWork()
  // this call should be cached
  const cachedResult = await doWork()

  expect(translate).toHaveBeenCalledTimes(1)
  expect(liveResult).toEqual(cachedResult)
})
