import { GoogleFreeTranslation } from '@/service/google-free-translation'

const api = new GoogleFreeTranslation()

describe('Live API (may be unstable)', () => {
  test('Simple string returns translation', async () => {
    await expect(api.translate('ru', { foo: 'hi' })).resolves.toEqual({
      foo: 'привет',
    })
  })
  test.only('The nostranslate tags are respected', async () => {
    await expect(
      api.translate('ru', {
        foo: 'hi {destination}',
      }),
    ).resolves.toEqual({
      foo: 'привет {destination}',
    })
  })
})
