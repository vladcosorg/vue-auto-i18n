import { GoogleFree } from '../../../src/translation-service/google-free'

const api = new GoogleFree()

describe.skip('Live API (may be unstable)', () => {
  test('Simple string returns translation', async () => {
    await expect(api.translate('ru', { foo: 'hi' })).resolves.toEqual({
      foo: 'Привет',
    })
  })
  test('The nostranslate tags are respected', async () => {
    await expect(
      api.translate('ru', {
        foo: 'hi {destination}',
      }),
    ).resolves.toEqual({
      foo: 'привет {destination}',
    })
  })
})
