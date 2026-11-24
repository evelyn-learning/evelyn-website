'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, RefreshCw, ShieldAlert } from 'lucide-react';
import { CodeBlock } from '../../../docs/components/CodeBlock';
import { dashFetch, errorText } from '../../dash-api';
import { signTokenSnippet } from '../../snippets';
import { CopyButton, CopyField, Notice, dangerButton, linkClass, secondaryButton } from '../../ui';
import { Card, PageHeader, useDash } from '../DashboardShell';

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '');

export default function DashboardKeysPage() {
  const { me, refresh } = useDash();
  const isOwner = me.account.role === 'owner';
  const current = me.keys.find((k) => k.current) ?? me.keys[0];
  const older = me.keys.filter((k) => k !== current);

  // A revealed or newly made secret lives only in this component's state: it is gone when the page is left,
  // and it is never written to storage or to the console.
  const [secret, setSecret] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [revealError, setRevealError] = useState('');

  const [confirming, setConfirming] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [rotateError, setRotateError] = useState('');
  const [rotated, setRotated] = useState<{ oldValidUntil: string } | null>(null);

  async function reveal() {
    if (revealing) return;
    setRevealing(true);
    setRevealError('');
    try {
      const r = await dashFetch<{ partnerId: string; secret: string }>('keys/reveal', { method: 'POST', body: {} });
      setSecret(r.secret);
    } catch (err) {
      setRevealError(errorText(err, 'We could not show the secret. Try again.'));
    } finally {
      setRevealing(false);
    }
  }

  async function rotate() {
    if (rotating) return;
    setRotating(true);
    setRotateError('');
    try {
      const r = await dashFetch<{ partnerId: string; secret: string; oldValidUntil: string }>('keys/rotate', { method: 'POST', body: {} });
      setSecret(r.secret);
      setRotated({ oldValidUntil: r.oldValidUntil });
      setConfirming(false);
      await refresh();
    } catch (err) {
      setRotateError(errorText(err, 'We could not rotate the secret. Nothing was changed.'));
    } finally {
      setRotating(false);
    }
  }

  return (
    <>
      <PageHeader title="API keys">
        Two values: your partner id, which is public, and your secret, which signs session tokens and API calls.
      </PageHeader>

      <div className="space-y-6">
        <Card title="Partner id">
          <CopyField value={me.partnerId} label="Partner id" />
        </Card>

        <Card title="Secret">
          {rotated && (
            <div className="mb-4">
              <Notice kind="success">
                This is your new secret. Copy it now: after you leave this page it is shown only through Reveal.
                The old secret keeps working until {when(rotated.oldValidUntil)}.
              </Notice>
            </div>
          )}

          {current || secret ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <code aria-label={secret ? 'Secret' : 'Secret, hidden'} className="min-w-0 flex-1 break-all rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800">
                {secret ?? current?.masked}
              </code>
              <div className="flex shrink-0 gap-2">
                {secret ? (
                  <>
                    <CopyButton value={secret} />
                    <button type="button" onClick={() => { setSecret(null); setRotated(null); }} className={secondaryButton}>
                      <EyeOff className="h-4 w-4" aria-hidden />Hide
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={reveal} disabled={revealing} className={secondaryButton}>
                    <Eye className="h-4 w-4" aria-hidden />{revealing ? 'Revealing…' : 'Reveal'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">This account has no secret yet. Write to info@evelynlearning.com.</p>
          )}
          <div aria-live="polite" className="mt-3">{revealError && <Notice>{revealError}</Notice>}</div>

          {current?.createdAt && <p className="text-xs text-slate-500">Created {when(current.createdAt)}.</p>}
          <p className="mt-3 flex items-start gap-2 text-sm text-slate-600">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
            Keep it on your server. Never put it in a web page, a mobile app or a repository.
          </p>

          {older.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Older secrets still accepted</h3>
              <ul className="space-y-2">
                {older.map((k) => (
                  <li key={`${k.masked}-${k.expiresAt}`} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                    <code className="font-mono text-slate-700">{k.masked}</code>
                    <span className="text-slate-500">{k.expiresAt ? `Works until ${when(k.expiresAt)}` : 'No expiry'}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card title="Rotate secret">
          <p className="text-sm text-slate-600">
            Makes a new secret. Do this if the secret may have been exposed, or as routine.
          </p>
          {!isOwner ? (
            <p className="mt-3 text-sm text-slate-500">Only the account owner can rotate the secret.</p>
          ) : confirming ? (
            // An in-page confirm step, not window.confirm: it can say what happens, and it is reachable by keyboard and screen reader like the rest of the page.
            <div role="group" aria-labelledby="rotate-confirm" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p id="rotate-confirm" className="text-sm font-semibold text-amber-900">Rotate the secret now?</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
                <li>A new secret is made and shown here once.</li>
                <li>The old secret keeps working for 24 hours, so you can switch your servers without an outage.</li>
                <li>After 24 hours, tokens and API calls signed with the old secret are refused.</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={rotate} disabled={rotating} className={dangerButton}>
                  <RefreshCw className={`h-4 w-4 ${rotating ? 'animate-spin' : ''}`} aria-hidden />
                  {rotating ? 'Rotating…' : 'Yes, rotate it'}
                </button>
                <button type="button" onClick={() => { setConfirming(false); setRotateError(''); }} disabled={rotating} className={secondaryButton}>Cancel</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className={`${secondaryButton} mt-4`}>
              <RefreshCw className="h-4 w-4" aria-hidden />Rotate secret
            </button>
          )}
          <div aria-live="polite" className="mt-3">{rotateError && <Notice>{rotateError}</Notice>}</div>
        </Card>

        <Card title="Sign a session token (Node)">
          <p className="text-sm text-slate-600">
            A session token is a JWT signed with HS256 and your secret. This needs no dependencies; any JWT
            library works too, as long as the claims are top-level. The secret is read from your server&apos;s
            environment.
          </p>
          <CodeBlock language="js" title="sign-token.js">{signTokenSnippet(me.partnerId)}</CodeBlock>
          <div className="flex flex-wrap items-center gap-3">
            <CopyButton value={signTokenSnippet(me.partnerId)} label="Copy snippet" />
            <Link href="/dashboard/docs" className={`text-sm ${linkClass}`}>All claims and the full guide</Link>
          </div>
        </Card>
      </div>
    </>
  );
}
