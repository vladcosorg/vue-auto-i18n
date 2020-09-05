import { TranslationApi, TranslationAPIResponse } from '@/translation-api'
import { mocked } from 'ts-jest/utils'
import axios from 'axios'
jest.mock('axios')
const mockedAxios = mocked(axios, true)
const api = new TranslationApi('231123')

test('that the function passes through the data', async () => {
  const dataset = {
    test1: 'bar',
    test2: { inner: 'foo' },
  }

  mockedAxios.post.mockImplementation(
    async (
      url,
      data: URLSearchParams,
    ): Promise<{ data: TranslationAPIResponse }> => {
      return {
        data: {
          data: { translations: [{ translatedText: data.get('q') as string }] },
        },
      }
    },
  )
  const result = await api.translate('lang', dataset)
  expect(result).toEqual(dataset)
})

test('That it encodes the flat translation map into pseudo-XML', async () => {
  // const encodedString =
  // mockedAxios.post.mockResolvedValue({
  //   data: { data: { translations: [{ translatedText: encodedString }] } },
  // })
  // const result = await api.translate('dawd')
  const encodingResults = api['encode']({
    test1: 'bar',
    test2: { inner: 'foo' },
  })
  expect(encodingResults).toEqual(
    '<test1>bar</test1><test2.inner>foo</test2.inner>',
  )
})

it('Decode data from pseudo-XML to nested message object', async () => {
  const decodingResults = api[
    'decode'
  ]('<test1>bar</test1><test2.inner>foo</test2.inner>', [
    'test1',
    'test2.inner',
  ])

  expect(decodingResults).toEqual({ test1: 'bar', test2: { inner: 'foo' } })
})
