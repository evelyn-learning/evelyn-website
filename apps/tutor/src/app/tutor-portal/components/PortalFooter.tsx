import Link from 'next/link';
import { PRODUCT_PAGE_URL } from '../portal-pages';

// 2026-11-24: the footer had only Privacy, Terms and the email address, so a visitor at the bottom of a page
// had no way on, and crawlers found the docs, the pricing page and the sign-in only through the header.
const productLinks = [
  { href: '/docs', label: 'Docs' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/demo', label: 'Live demo' },
  { href: '/sandbox', label: 'Get API keys' },
  { href: '/dashboard/login', label: 'Sign in' },
];

export function PortalFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Footer" className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-slate-600 sm:justify-start">
          {productLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-slate-900">
              {l.label}
            </Link>
          ))}
          <a href={PRODUCT_PAGE_URL} className="hover:text-slate-900">
            Evelyn Learning
          </a>
        </nav>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>&copy; {new Date().getFullYear()} Evelyn Learning.</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <Link href="https://www.evelynlearning.com/privacy" className="hover:text-slate-700">
              Privacy
            </Link>
            <Link href="https://www.evelynlearning.com/terms" className="hover:text-slate-700">
              Terms
            </Link>
            <a href="mailto:info@evelynlearning.com" className="hover:text-slate-700">
              info@evelynlearning.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
