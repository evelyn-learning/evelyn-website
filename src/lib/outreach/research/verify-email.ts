// The deterministic anti-fabrication gate: an email only survives into a
// Lead if the server itself fetched the model-cited source URL and found
// the address on the page. A model claim is never sufficient.

// Normalize common email obfuscations so "d [at] x [dot] edu" matches.
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s*[\[(]\s*at\s*[\])]\s*/g, "@")
    .replace(/\s+at\s+/g, "@")
    .replace(/\s*[\[(]\s*dot\s*[\])]\s*/g, ".")
    .replace(/\s+dot\s+/g, ".");
}

export function emailAppearsInText(email: string, pageText: string): boolean {
  const needle = email.toLowerCase();
  const haystack = normalize(pageText);
  // Word-ish boundary before the local part so "asmith@x" doesn't match "dsmith@x"
  const idx = haystack.indexOf(needle);
  if (idx === -1) return false;
  const before = idx === 0 ? "" : haystack[idx - 1];
  return before === "" || !/[a-z0-9._%+-]/.test(before);
}

export async function verifyEmailPublished(
  email: string,
  sourceUrl: string,
  fetchFn: typeof fetch = fetch
): Promise<boolean> {
  try {
    const res = await fetchFn(sourceUrl, {
      signal: AbortSignal.timeout(10_000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; EvelynResearch/1.0)" },
    });
    if (!res.ok) return false;
    const text = await res.text();
    return emailAppearsInText(email, text);
  } catch {
    return false;
  }
}
