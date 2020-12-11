import nock from 'nock'

import { TranslationApi } from '@/translation-api'

const api = new TranslationApi('invalid-api-key')
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

test('That it encodes the flat translation map into pseudo-XML', async () => {
  expect.assertions(1)

  nock(/.*/)
    .post(/.*/)
    .reply(200, (uri, request) => {
      const encodedString = new URLSearchParams(request).get('q')
      expect(encodedString).toEqual(
        '<test1>bar</test1><test2.inner>foo</test2.inner>',
      )
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
            translatedText:
              '<test1>translated</test1><test2.inner>translated</test2.inner>',
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

afterEach(nock.cleanAll)

afterAll(() => {
  nock.restore()
})
