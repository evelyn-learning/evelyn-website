/**
 * Wikidata SPARQL fact-check helper.
 *
 * Targets a narrow set of factual question types that come up in K-12
 * history / geography tutoring:
 *   - date-of-event
 *   - place-of-birth / death
 *   - capital of country
 *   - inventor of X
 *   - leader at time T
 *
 * We don't try to generalize — each helper wraps one specific SPARQL
 * query with a pre-baked template. Catches the common cases; anything
 * unusual falls back to Claude.
 */

const ENDPOINT = 'https://query.wikidata.org/sparql';
const UA = 'EvelynLearningTutor/1.0 (https://evelynlearning.ai)';
const TIMEOUT_MS = 6000;

// In-memory LRU-ish cache (module-level). Keyed by the full query string.
// Max 256 entries, 24h TTL.
const cache = new Map<string, { at: number; value: unknown }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_MAX = 256;
function cacheGet<T>(key: string): T | null {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.at > CACHE_TTL_MS) { cache.delete(key); return null; }
  return e.value as T;
}
function cacheSet(key: string, value: unknown) {
  if (cache.size >= CACHE_MAX) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, { at: Date.now(), value });
}

interface SparqlBinding { [key: string]: { value: string; type: string } }

async function runSparql(query: string): Promise<SparqlBinding[] | null> {
  const cached = cacheGet<SparqlBinding[]>(query);
  if (cached) return cached;
  try {
    const url = `${ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;
    const resp = await fetch(url, {
      headers: { Accept: 'application/sparql-results+json', 'User-Agent': UA },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const bindings = data?.results?.bindings as SparqlBinding[] | undefined;
    if (!Array.isArray(bindings)) return null;
    cacheSet(query, bindings);
    return bindings;
  } catch (err) {
    console.error('[Wikidata] query failed:', err);
    return null;
  }
}

/** Capital of a country, looked up by English label. */
export async function capitalOf(countryName: string): Promise<string | null> {
  const query = `
    SELECT ?capitalLabel WHERE {
      ?country rdfs:label "${countryName}"@en.
      ?country wdt:P36 ?capital.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    } LIMIT 1
  `;
  const rows = await runSparql(query);
  return rows?.[0]?.capitalLabel?.value || null;
}

/** Year of birth for a person, by label. */
export async function birthYearOf(personName: string): Promise<number | null> {
  const query = `
    SELECT ?dob WHERE {
      ?person rdfs:label "${personName}"@en.
      ?person wdt:P569 ?dob.
    } LIMIT 1
  `;
  const rows = await runSparql(query);
  const dob = rows?.[0]?.dob?.value;
  if (!dob) return null;
  const m = dob.match(/^-?(\d{1,5})/);
  return m ? parseInt(m[1], 10) : null;
}

/** Year of an event, by label. Matches against point-in-time or start-time. */
export async function yearOfEvent(eventName: string): Promise<number | null> {
  const query = `
    SELECT ?date WHERE {
      ?event rdfs:label "${eventName}"@en.
      { ?event wdt:P585 ?date } UNION { ?event wdt:P580 ?date }.
    } LIMIT 1
  `;
  const rows = await runSparql(query);
  const d = rows?.[0]?.date?.value;
  if (!d) return null;
  const m = d.match(/^-?(\d{1,5})/);
  return m ? parseInt(m[1], 10) : null;
}

/**
 * Verify a claim of the form "capital of X is Y" or "X was born in year N".
 */
export async function validateFactClaim(claim: {
  kind: 'capital' | 'birth-year' | 'event-year';
  subject: string;
  claimedValue: string | number;
}): Promise<{ correct: boolean; expected?: string | number; issues?: string[] }> {
  let expected: string | number | null = null;
  if (claim.kind === 'capital') expected = await capitalOf(claim.subject);
  else if (claim.kind === 'birth-year') expected = await birthYearOf(claim.subject);
  else if (claim.kind === 'event-year') expected = await yearOfEvent(claim.subject);

  if (expected == null) {
    return { correct: true, issues: [`Wikidata had no direct match for "${claim.subject}".`] };
  }
  const matches = String(expected).toLowerCase() === String(claim.claimedValue).toLowerCase()
    || (typeof expected === 'number' && Number(claim.claimedValue) === expected);
  return {
    correct: matches,
    expected: expected ?? undefined,
    issues: matches ? undefined : [`${claim.kind} of ${claim.subject} is ${expected}, not ${claim.claimedValue}`],
  };
}
