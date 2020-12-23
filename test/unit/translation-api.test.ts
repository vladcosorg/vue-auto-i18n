import nock from 'nock'

import { InformativeError } from '@/error'
import { TranslationApi } from '@/translation-api'

const api = new TranslationApi('invalid-api-key')

describe('Format conversion', () => {
  test('Flat translation map is encoded into a valid pseudo-XML', async () => {
    expect.assertions(1)

    nock(/.*/)
      .post(/.*/)
      .reply(200, (uri, request) => {
        const encodedString = new URLSearchParams(request).get('q')
        expect(encodedString).toEqual('<0>bar</0><1>foo</1>')
        return {
          data: { translations: [{ translatedText: encodedString }] },
        }
      })

    await api.translate('ru', {
      test1: 'bar',
      test2: { inner: 'foo' },
    })
  })

  it('Decode data from pseudo-XML to nested message object', async () => {
    expect.assertions(1)

    nock(/.*/)
      .post(/.*/)
      .reply(200, {
        data: {
          translations: [
            {
              translatedText: '<0>translated</0><1>translated</1>',
            },
          ],
        },
      })

    await expect(
      api.translate('ru', {
        test1: 'not translated',
        test2: { inner: 'not translated' },
      }),
    ).resolves.toEqual({
      test1: 'translated',
      test2: { inner: 'translated' },
    })
  })
})

describe('Error handling', () => {
  test('When an invalid API key is specified an error is thrown', () => {
    return expect(
      nock
        .back('invalid-api-key-response.json')
        .then(({ nockDone }) =>
          api.translate('ru', { foo: 'bar' }).finally(nockDone),
        ),
    ).rejects.toEqual(
      new Error(
        'API key not valid. Please pass a valid API key. [400 INVALID_ARGUMENT]',
      ),
    )
  })

  it('Should thrown an informative exception when the endpoint returns unexpected response', async () => {
    expect.assertions(1)

    nock(/.*/)
      .post(/.*/)
      .reply(200, {
        some: { invalid: 'response' },
      })

    await expect(api.translate('ru', {})).rejects.toBeInstanceOf(
      InformativeError,
    )
  })
})

afterEach(nock.cleanAll)

afterAll(() => {
  nock.restore()
})
