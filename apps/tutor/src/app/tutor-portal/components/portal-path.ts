/**
 * The portal path a visitor is on, without the /tutor-portal prefix.
 *
 * On the tutor host the middleware rewrites /x → /tutor-portal/x, so usePathname() can report either form
 * (the address-bar path, or the rewritten one when the page is opened by its full path). Links are always
 * written host-relative, without the prefix; this gives the same form back for active-state checks.
 */
export function portalPath(pathname: string | null | undefined): string {
  const p = pathname || '/';
  if (p === '/tutor-portal') return '/';
  return p.startsWith('/tutor-portal/') ? p.slice('/tutor-portal'.length) : p;
}

/** True when `path` (already without the prefix) is `href` or below it. */
export function isUnder(path: string, href: string): boolean {
  return path === href || path.startsWith(`${href}/`);
}
