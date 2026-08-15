'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sections = [
  { href: '/docs', label: 'Overview' },
  { href: '/docs/quickstart', label: 'Getting Started' },
  { href: '/docs/embed', label: 'Embed Configuration' },
  { href: '/docs/api', label: 'API Reference' },
  { href: '/docs/webhooks', label: 'Webhooks' },
  { href: '/docs/modules', label: 'Curriculum Modules' },
  { href: '/docs/authentication', label: 'Authentication' },
  { href: '/docs/whiteboard', label: 'Whiteboard Types' },
];

export function DocsSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const fullPath = `/tutor-portal${href}`;
    return href === '/docs'
      ? pathname === fullPath
      : pathname === fullPath || pathname?.startsWith(`${fullPath}/`);
  };

  return (
    <nav className="sticky top-20 space-y-1">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Documentation
      </p>
      {sections.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
            isActive(s.href)
              ? 'bg-blue-50 font-medium text-blue-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {s.label}
        </Link>
      ))}
    </nav>
  );
}
