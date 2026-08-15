/**
 * Client IP extraction for the session-usage capture path. Pure — no Node
 * networking — so it stays testable from scripts/test-recordings.ts.
 * The engine sits behind nginx, so x-forwarded-for's first hop is the
 * client; x-real-ip is the fallback.
 */

export function extractClientIp(headers: Headers): string | undefined {
  const raw =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    '';
  if (!raw) return undefined;
  // Node often reports IPv4 as IPv6-mapped (::ffff:1.2.3.4).
  return raw.replace(/^::ffff:/i, '');
}

/** Loopback / RFC1918 / link-local / IPv6 unique-local — never geolocatable. */
export function isPrivateIp(ip: string): boolean {
  const v = ip.toLowerCase();
  if (v === '::1' || v === 'localhost') return true;
  if (/^(127|10)\./.test(v)) return true;
  if (/^192\.168\./.test(v)) return true;
  if (/^169\.254\./.test(v)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(v)) return true;
  if (/^f[cd]/.test(v)) return true; // fc00::/7 unique-local
  if (/^fe80/.test(v)) return true; // link-local
  return false;
}
