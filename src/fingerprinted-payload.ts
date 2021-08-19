import { hashString } from './util'

export type FingerprintedPayload<T = unknown> = {
  fingerprint: number
  payload: T
}

type InnerPayloadType<T> = T extends FingerprintedPayload<infer I> ? I : never
export function wrapIntoFingerprintedEnvelope<T>(
  data: T,
): FingerprintedPayload<T> {
  return createFingerprintedEnvelope(getContentFingerprint(data), data)
}

export function getContentFingerprint(data: unknown): number {
  return hashString(JSON.stringify(data))
}

export function createFingerprintedEnvelope<T>(
  fingerprint: number,
  payload: T,
): FingerprintedPayload<T> {
  return {
    fingerprint,
    payload,
  }
}

export function isFingerprintedPayloadSame(
  fingerprintedPayload: FingerprintedPayload,
  rawPayload: unknown,
): boolean {
  return (
    hashString(JSON.stringify(rawPayload)) === fingerprintedPayload.fingerprint
  )
}

export function extractPayloadFromTheEnvelope<T extends FingerprintedPayload>(
  fingerprintedPayload: T,
): InnerPayloadType<T> {
  return fingerprintedPayload.payload as InnerPayloadType<T>
}
