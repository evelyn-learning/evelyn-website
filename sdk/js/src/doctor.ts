import { DEFAULT_API_HOST, type Usage } from './client.js';
import { EvelynApiError, explainError, SANDBOX_URL } from './errors.js';
import { signRequest } from './signing.js';
import { VERSION } from './version.js';

/** One line of the doctor's report. */
export interface DoctorCheck {
  name: string;
  ok: boolean;
  detail: string;
}

const USAGE_PATH = '/api/portal/v1/usage';
const SKEW_LIMIT_SEC = 300;
const DEFAULT_REGISTRY = 'https://registry.npmjs.org';

/** How a usage answer reads in one line. */
export function describeUsage(usage: Usage): string {
  if (!usage.pooled) return `No minute pool applies to partner ${usage.partner_id}.`;
  return `${usage.used_minutes} of ${usage.cap_minutes} tutoring minutes used, ${usage.remaining_minutes} left (one session may run up to ${usage.session_max_minutes} minutes).`;
}

/** Whether version `a` is newer than version `b` (`major.minor.patch`; anything after the patch is ignored). */
function isNewer(a: string, b: string): boolean {
  const [x, y] = [a, b].map((version) => version.split('.').map((part) => parseInt(part, 10) || 0));
  for (let i = 0; i < 3; i += 1) {
    if ((x![i] ?? 0) !== (y![i] ?? 0)) return (x![i] ?? 0) > (y![i] ?? 0);
  }
  return false;
}

/**
 * Says whether a newer version of this package is on the npm registry. Advice only: the line is never a
 * failure, and when the registry cannot be reached within 4 seconds it says so and nothing else.
 * `EVELYN_NPM_REGISTRY` names another registry (a company mirror).
 */
async function checkVersion(env: NodeJS.ProcessEnv, fetchImpl: typeof fetch): Promise<DoctorCheck> {
  const name = 'Package version';
  const registry = (env.EVELYN_NPM_REGISTRY ?? DEFAULT_REGISTRY).replace(/\/+$/, '');
  try {
    const response = await fetchImpl(`${registry}/@evelynlearning%2ftutor/latest`, { signal: AbortSignal.timeout(4000) });
    const latest = response.ok ? ((await response.json()) as { version?: unknown }).version : undefined;
    if (typeof latest !== 'string') return { name, ok: true, detail: `${VERSION} (the registry did not say which version is the latest)` };
    return isNewer(latest, VERSION)
      ? { name, ok: true, detail: `${VERSION}; ${latest} is available. Update with: npm install @evelynlearning/tutor@latest` }
      : { name, ok: true, detail: `${VERSION} is the latest` };
  } catch {
    return { name, ok: true, detail: `${VERSION} (the npm registry could not be reached, so newer versions were not looked for)` };
  }
}

/**
 * Checks an integration's setup end to end: both keys present, this machine's clock against the API's, one
 * signed `GET /usage`, and whether a newer version of this package exists. Never prints the secret.
 */
export async function runDoctor(env: NodeJS.ProcessEnv = process.env, fetchImpl: typeof fetch = fetch): Promise<DoctorCheck[]> {
  const [setup, version] = await Promise.all([checkSetup(env, fetchImpl), checkVersion(env, fetchImpl)]);
  return [...setup, version];
}

/** The keys, the clock and the signed call: one request to the API. */
async function checkSetup(env: NodeJS.ProcessEnv, fetchImpl: typeof fetch): Promise<DoctorCheck[]> {
  const partnerId = env.EVELYN_PARTNER_ID;
  const secret = env.EVELYN_PARTNER_SECRET;
  const checks: DoctorCheck[] = [
    { name: 'EVELYN_PARTNER_ID', ok: !!partnerId, detail: partnerId ? `set (${partnerId})` : `not set. Sign up at ${SANDBOX_URL} and copy it from the dashboard.` },
    { name: 'EVELYN_PARTNER_SECRET', ok: !!secret, detail: secret ? 'set' : `not set. Sign up at ${SANDBOX_URL} and copy it from the dashboard.` },
  ];
  if (!partnerId || !secret) return checks;

  const host = (env.EVELYN_API_HOST ?? DEFAULT_API_HOST).replace(/\/+$/, '');
  const sentAt = Date.now();
  let response: Response;
  let text: string;
  try {
    response = await fetchImpl(`${host}${USAGE_PATH}`, {
      headers: { ...signRequest({ method: 'GET', path: USAGE_PATH, partnerId, secret, timestamp: sentAt }) },
      signal: AbortSignal.timeout(15000),
    });
    text = await response.text();
  } catch (err) {
    checks.push({ name: 'API reachable', ok: false, detail: `could not reach ${host}: ${explainError(err)}` });
    return checks;
  }
  checks.push({ name: 'API reachable', ok: true, detail: host });

  const serverTime = Date.parse(response.headers.get('date') ?? '');
  if (Number.isFinite(serverTime)) {
    // The Date header has whole seconds; the middle of the round trip is the fairest local reading.
    const skewSec = Math.round((serverTime - (sentAt + Date.now()) / 2) / 1000);
    const ok = Math.abs(skewSec) < SKEW_LIMIT_SEC;
    checks.push({
      name: 'Clock',
      ok,
      detail: ok
        ? `within ${Math.abs(skewSec)} s of the API's clock`
        : `this machine is ${Math.abs(skewSec)} s ${skewSec > 0 ? 'behind' : 'ahead of'} the API. Requests are refused beyond 300 s: set the system clock.`,
    });
  } else {
    checks.push({ name: 'Clock', ok: true, detail: 'not measured (the response had no Date header)' });
  }

  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {
    // Not JSON: reported below as the body of a failed call.
  }
  checks.push(
    response.ok
      ? { name: 'Signed GET /usage', ok: true, detail: describeUsage(body as Usage) }
      : { name: 'Signed GET /usage', ok: false, detail: explainError(new EvelynApiError(response.status, body, `GET ${USAGE_PATH}`)) },
  );
  return checks;
}

/** The report as text, one check per line. */
export function formatDoctor(checks: DoctorCheck[]): string {
  const lines = checks.map((check) => `${check.ok ? 'ok  ' : 'FAIL'}  ${check.name}: ${check.detail}`);
  lines.push(checks.every((check) => check.ok) ? 'Everything works.' : 'Fix the lines marked FAIL and run the check again.');
  return lines.join('\n');
}
