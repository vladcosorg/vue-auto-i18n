import { GoogleFree } from '../../../src/service/google-free'

const api = new GoogleFree()

describe('Live API (may be unstable)', () => {
  test('Simple string returns translation', async () => {
    await expect(api.translate('ru', { foo: 'hi' })).resolves.toEqual({
      foo: 'привет',
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
