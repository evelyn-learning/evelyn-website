import { createHmac } from 'node:crypto';
import { EvelynConfigError } from './errors.js';

/** One API request to sign. */
export interface SignRequestInput {
  /** HTTP method. Case does not matter. */
  method: string;
  /** The path with its query string and no host, for example `/api/portal/v1/usage`. */
  path: string;
  /** The request body exactly as it will be sent. Leave it out for a request with no body. */
  body?: string;
  /** Your partner id. */
  partnerId: string;
  /** Your partner secret. Server side only. */
  secret: string;
  /** Unix time in milliseconds. Default: now. The API refuses a timestamp more than 5 minutes from its own clock. */
  timestamp?: number;
}

/** The three headers every `/api/portal/v1/*` request carries. */
export interface SignedHeaders {
  'x-evelyn-partner': string;
  'x-evelyn-timestamp': string;
  'x-evelyn-signature': string;
}

/**
 * Signs one API request. The signature is the hex HMAC-SHA256, with the partner secret, of
 * `<timestamp>.<METHOD>.<path with query string>.<raw body>`.
 *
 * The body is taken as a string because the bytes signed must be the bytes sent: serialise your JSON once,
 * sign that string, and send that same string.
 */
export function signRequest(input: SignRequestInput): SignedHeaders {
  if (typeof input.partnerId !== 'string' || !input.partnerId) throw new EvelynConfigError('partnerId is required to sign a request.');
  if (typeof input.secret !== 'string' || !input.secret) throw new EvelynConfigError('secret is required to sign a request.');
  if (typeof input.path !== 'string' || !input.path.startsWith('/')) {
    throw new EvelynConfigError('path must start with "/" and carry no host, for example "/api/portal/v1/usage".');
  }
  if (input.body !== undefined && typeof input.body !== 'string') {
    throw new EvelynConfigError('body must be the raw string that will be sent. Call JSON.stringify once and pass the result to both signRequest and fetch.');
  }
  const timestamp = String(input.timestamp ?? Date.now());
  const signature = createHmac('sha256', input.secret)
    .update(`${timestamp}.${input.method.toUpperCase()}.${input.path}.${input.body ?? ''}`)
    .digest('hex');
  return { 'x-evelyn-partner': input.partnerId, 'x-evelyn-timestamp': timestamp, 'x-evelyn-signature': signature };
}
