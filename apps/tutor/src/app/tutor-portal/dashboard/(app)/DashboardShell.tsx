'use client';

/**
 * The frame of every signed-in dashboard page: who you are (company, partner id), the section links, sign out,
 * and the one fetch of /me that all the pages share through useDash().
 *
 * Pages render only once /me has answered, so each can read `me` without a loading branch of its own. A 401
 * sends the browser to the sign-in page (dashFetch does it).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, History, KeyRound, LayoutDashboard, LogOut, Play, UserRound } from 'lucide-react';
import { isUnder, portalPath } from '../../components/portal-path';
import { DashApiError, LOGIN_PATH, dashFetch, errorText, type DashMe } from '../dash-api';
import { Notice, focusRing, secondaryButton } from '../ui';

interface DashContext {
  me: DashMe;
  /** Read /me again, after a change that it reports (a rotated key, a renamed company, a new member). */
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  signingOut: boolean;
}

const Ctx = createContext<DashContext | null>(null);

export function useDash(): DashContext {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDash is used outside the dashboard layout');
  return v;
}

const sections = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/keys', label: 'API keys', icon: KeyRound },
  { href: '/dashboard/try', label: 'Try it', icon: Play },
  { href: '/dashboard/sessions', label: 'Sessions', icon: History },
  { href: '/dashboard/docs', label: 'Docs', icon: BookOpen },
  { href: '/dashboard/account', label: 'Account', icon: UserRound },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const path = portalPath(usePathname());
  const [me, setMe] = useState<DashMe | null>(null);
  const [error, setError] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  const load = useCallback(async () => {
    try {
      setMe(await dashFetch<DashMe>('me'));
      setError('');
    } catch (err) {
      // Signed out: the browser is already on its way to the sign-in page; show nothing in between.
      if (err instanceof DashApiError && err.status === 401) return;
      setError(errorText(err, 'We could not load your dashboard.'));
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  // On a phone the section links are one scrolling row: keep the current one in view.
  const tabs = useRef<HTMLUListElement>(null);
  useEffect(() => {
    tabs.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [path]);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    try { await dashFetch('logout', { method: 'POST', body: {}, stayOn401: true }); } catch { /* signed out or not, leave */ }
    // A full load, not a client transition: nothing of the signed-in pages stays in memory.
    window.location.assign(LOGIN_PATH);
  }, []);

  const value = useMemo(() => (me ? { me, refresh: load, signOut, signingOut } : null), [me, load, signOut, signingOut]);

  const isActive = (href: string) => (href === '/dashboard' ? path === href : isUnder(path, href));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <aside className="mb-6 lg:mb-0">
          <div className="lg:sticky lg:top-24">
            {/* Company and partner id. Fixed height, so the page does not move when /me answers. */}
            <div className="mb-4 flex h-12 items-start justify-between gap-3">
              <div className="min-w-0">
                {me ? (
                  <>
                    <p className="truncate text-sm font-semibold text-slate-900">{me.account.company || me.account.email}</p>
                    <p className="truncate font-mono text-xs text-slate-500" title="Your partner id">{me.partnerId}</p>
                  </>
                ) : (
                  <div aria-hidden className="space-y-2 pt-1">
                    <div className="h-3.5 w-32 rounded bg-slate-100" />
                    <div className="h-3 w-20 rounded bg-slate-100" />
                  </div>
                )}
              </div>
              <button type="button" onClick={signOut} disabled={signingOut} className={`${secondaryButton} shrink-0 px-2.5 py-1.5 lg:hidden`}>
                <LogOut className="h-4 w-4" aria-hidden />
                {signingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>

            <nav aria-label="Dashboard" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <ul ref={tabs} className="flex gap-1 border-b border-slate-200 pb-2 lg:flex-col lg:border-0 lg:pb-0">
                {sections.map((s) => {
                  const active = isActive(s.href);
                  return (
                    <li key={s.href} className="shrink-0">
                      <Link
                        href={s.href}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${focusRing} ${
                          active ? 'bg-blue-50 font-medium text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <s.icon className="h-4 w-4" aria-hidden />
                        {s.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <button
              type="button" onClick={signOut} disabled={signingOut}
              className={`mt-4 hidden w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:text-slate-400 lg:flex ${focusRing}`}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </aside>

        <section className="min-h-[70vh] min-w-0">
          {value ? (
            <Ctx.Provider value={value}>{children}</Ctx.Provider>
          ) : error ? (
            <div className="max-w-xl space-y-4">
              <Notice>{error}</Notice>
              <button type="button" onClick={() => { setError(''); void load(); }} className={secondaryButton}>Try again</button>
            </div>
          ) : (
            <div role="status" aria-label="Loading your dashboard" className="max-w-3xl animate-pulse space-y-4">
              <div className="h-8 w-48 rounded bg-slate-100" />
              <div className="h-4 w-72 max-w-full rounded bg-slate-100" />
              <div className="h-40 rounded-lg bg-slate-100" />
              <div className="h-40 rounded-lg bg-slate-100" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/** The title block every dashboard page opens with. */
export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {children && <p className="mt-1 text-sm text-slate-600">{children}</p>}
    </header>
  );
}

export function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white p-4 sm:p-5 ${className}`}>
      {title && <h2 className="mb-3 text-base font-semibold text-slate-900">{title}</h2>}
      {children}
    </section>
  );
}
