import { GoogleCloud } from '../../src/service/google-cloud'
import { GoogleFree } from '../../src/service/google-free'

// eslint-disable-next-line jest/no-disabled-tests
test.skip('Live cloud', async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const api = new GoogleCloud(process.env.GOOGLE_API_KEY!)
  const result = await api.translate('ro', {
    // test: (context) => 'hi',
    travel: 'Travel from {origin} to {destination}',
    return: 'Returning from <b>{origin}</b> to <b>{destination}</b>',
    // allowed:
    //   'is <b class=notranslate>@.lower:restriction.travel.value.allowed</b> without any restrictions. ',
  })
  expect(result).not.toBeFalsy()
})
// eslint-disable-next-line jest/no-disabled-tests
test.skip('Live free', async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const api = new GoogleFree()
  const result = await api.translate('fr', {
    status: {
      allowed: 'Allowed',
      forbidden: 'Forbidden',
      conditional: 'Conditional',
    },
  })
  expect(result).not.toBeFalsy()
})
