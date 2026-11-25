import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** The vectors shared with the Python package's tests. */
export const vectors = JSON.parse(readFileSync(new URL('../../vectors.json', import.meta.url), 'utf8'));

/** Paths of the two commands, as a user's shell would run them. */
export const CLI = fileURLToPath(new URL('../bin/evelyn-tutor.js', import.meta.url));
export const MCP = fileURLToPath(new URL('../bin/evelyn-tutor-mcp.js', import.meta.url));

/** An environment for a child process with no Evelyn keys inherited from the developer's shell. */
export function cleanEnv(extra = {}) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('EVELYN_')));
  return { ...env, ...extra };
}

/** A fetch double: records every call and answers from `respond(url, init)`. */
export function fakeFetch(respond) {
  const calls = [];
  const fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    const { status = 200, body = {}, headers = {} } = respond(String(url), init) ?? {};
    return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });
  };
  return { fetch, calls };
}
