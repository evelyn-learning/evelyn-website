'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isUnder, portalPath } from '../../components/portal-path';
import { DOCS_PAGES } from '../../portal-pages';

// 2026-11-24: the list is the docs pages of portal-pages.ts, so a new docs page is in the sidebar, the sitemap
// and llms.txt together. The active check now works on the tutor host too (the path there has no /tutor-portal
// prefix, so nothing was ever highlighted).
export function DocsSidebar() {
  const path = portalPath(usePathname());
  const isActive = (href: string) => (href === '/docs' ? path === '/docs' : isUnder(path, href));

  return (
    <nav className="sticky top-20 space-y-1" aria-label="Documentation">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Documentation
      </p>
      {DOCS_PAGES.map((s) => (
        <Link
          key={s.path}
          href={s.path}
          aria-current={isActive(s.path) ? 'page' : undefined}
          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
            isActive(s.path)
              ? 'bg-blue-50 font-medium text-blue-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {s.docs}
        </Link>
      ))}
    </nav>
  );
}
