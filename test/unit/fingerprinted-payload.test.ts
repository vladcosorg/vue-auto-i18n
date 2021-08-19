import {
  isFingerprintedPayloadSame,
  wrapIntoFingerprintedEnvelope,
} from '../../src/fingerprinted-payload'

test('Fingerprints of the same content matches', () => {
  const content = {
    foo: 'bar',
  }

  const fingerprintedPayload = wrapIntoFingerprintedEnvelope(content)

  expect(isFingerprintedPayloadSame(fingerprintedPayload, content)).toBe(true)
})

test('Fingerprints on different content does not match', () => {
  const fingerprintedPayload = wrapIntoFingerprintedEnvelope({
    foo: 'bar',
  })

  const differentContent = {
    foo: 'bar',
    bar: 'foo',
  }

  expect(
    isFingerprintedPayloadSame(fingerprintedPayload, differentContent),
  ).toBe(false)
})
