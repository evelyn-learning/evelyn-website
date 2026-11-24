'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogOut, UserPlus } from 'lucide-react';
import { dashFetch, errorText } from '../../dash-api';
import { Notice, inputClass, labelClass, linkClass, primaryButton, secondaryButton } from '../../ui';
import { Card, PageHeader, useDash } from '../DashboardShell';

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Never');

export default function DashboardAccountPage() {
  const { me, refresh, signOut, signingOut } = useDash();
  const { account } = me;
  const isOwner = account.role === 'owner';

  const [name, setName] = useState(account.name);
  const [company, setCompany] = useState(account.company);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [memberMsg, setMemberMsg] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  // Removing takes two clicks on the row itself (no window.confirm): the first asks, the second does it.
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const dirty = name.trim() !== account.name || (isOwner && company.trim() !== account.company);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving || !dirty) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      await dashFetch('account', { method: 'PATCH', body: { name: name.trim(), ...(isOwner ? { company: company.trim() } : {}) } });
      await refresh();
      setSaveMsg({ kind: 'success', text: 'Saved.' });
    } catch (err) {
      setSaveMsg({ kind: 'error', text: errorText(err, 'We could not save that. Try again.') });
    } finally {
      setSaving(false);
    }
  }

  async function addMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (adding) return;
    const email = newEmail.trim();
    setAdding(true);
    setMemberMsg(null);
    try {
      await dashFetch('members', { method: 'POST', body: { email } });
      await refresh();
      setNewEmail('');
      setMemberMsg({ kind: 'success', text: `${email} now has access. They sign in with their own emailed link.` });
    } catch (err) {
      setMemberMsg({ kind: 'error', text: errorText(err, 'We could not add that person. Try again.') });
    } finally {
      setAdding(false);
    }
  }

  async function removeMember(email: string) {
    if (removing) return;
    setRemoving(email);
    setMemberMsg(null);
    try {
      await dashFetch('members', { method: 'DELETE', body: { email } });
      await refresh();
      setMemberMsg({ kind: 'success', text: `${email} no longer has access.` });
    } catch (err) {
      setMemberMsg({ kind: 'error', text: errorText(err, 'We could not remove that person. Try again.') });
    } finally {
      setRemoving(null);
      setConfirmRemove(null);
    }
  }

  return (
    <>
      <PageHeader title="Account">
        Signed in as <span className="break-all font-medium text-slate-900">{account.email}</span> ({isOwner ? 'owner' : 'member'}).
      </PageHeader>

      <div className="max-w-3xl space-y-6">
        <Card title="Profile">
          <form onSubmit={save} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>Your name</label>
                <input id="name" type="text" required maxLength={80} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} disabled={saving} className={inputClass} />
              </div>
              <div>
                <label htmlFor="company" className={labelClass}>Company</label>
                <input
                  id="company" type="text" required maxLength={80} autoComplete="organization"
                  value={company} onChange={(e) => setCompany(e.target.value)} disabled={saving || !isOwner}
                  aria-describedby="company-hint" className={inputClass}
                />
                <p id="company-hint" className="mt-1 text-xs text-slate-500">
                  {isOwner ? 'Changing the name does not change your partner id.' : 'Only the account owner can change the company.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={saving || !dirty} className={primaryButton}>{saving ? 'Saving…' : 'Save changes'}</button>
              <div aria-live="polite" className="min-w-0 flex-1">{saveMsg && <Notice kind={saveMsg.kind}>{saveMsg.text}</Notice>}</div>
            </div>
          </form>
        </Card>

        <Card title="People with access">
          <ul className="divide-y divide-slate-100">
            {me.members.map((m) => {
              const self = m.email === account.email;
              return (
                <li key={m.email} className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-all text-sm font-medium text-slate-900">
                      {m.name || m.email}
                      {self && <span className="ml-2 font-normal text-slate-500">(you)</span>}
                      <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{m.role}</span>
                    </p>
                    <p className="break-all text-xs text-slate-500">
                      {m.name ? `${m.email} · ` : ''}Last sign-in: {when(m.lastLoginAt)}
                    </p>
                  </div>
                  {isOwner && m.role !== 'owner' && (
                    <div className="flex shrink-0 gap-2">
                      {confirmRemove === m.email ? (
                        <>
                          <button type="button" onClick={() => void removeMember(m.email)} disabled={removing !== null} className={`${secondaryButton} border-red-300 text-red-700 hover:bg-red-50`}>
                            {removing === m.email ? 'Removing…' : 'Confirm remove'}
                            <span className="sr-only"> {m.email}</span>
                          </button>
                          <button type="button" onClick={() => setConfirmRemove(null)} disabled={removing !== null} className={secondaryButton}>Cancel</button>
                        </>
                      ) : (
                        <button type="button" onClick={() => setConfirmRemove(m.email)} disabled={removing !== null} className={secondaryButton}>
                          Remove<span className="sr-only"> {m.email}</span>
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {isOwner ? (
            <form onSubmit={addMember} className="mt-4 border-t border-slate-100 pt-4">
              <label htmlFor="member-email" className={labelClass}>Add a colleague by email</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="member-email" type="email" required maxLength={254} autoComplete="off" inputMode="email"
                  value={newEmail} onChange={(e) => setNewEmail(e.target.value)} disabled={adding}
                  aria-describedby="member-hint" className={`${inputClass} sm:flex-1`}
                />
                <button type="submit" disabled={adding} className={`${primaryButton} shrink-0`}>
                  <UserPlus className="h-4 w-4" aria-hidden />{adding ? 'Adding…' : 'Add'}
                </button>
              </div>
              <p id="member-hint" className="mt-1 text-xs text-slate-500">
                They can see usage and sessions and reveal the secret. Only you can rotate the secret or change who has access.
              </p>
            </form>
          ) : (
            <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">Only the account owner can add or remove people.</p>
          )}
          <div aria-live="polite" className="mt-3">{memberMsg && <Notice kind={memberMsg.kind}>{memberMsg.text}</Notice>}</div>
        </Card>

        <Card title="Sandbox terms">
          <p className="text-sm text-slate-600">
            {account.termsVersion
              ? <>This account accepted version <span className="font-medium text-slate-900">{account.termsVersion}</span> of the sandbox terms.</>
              : <>This account has no recorded acceptance of the sandbox terms.</>}
            {' '}
            <Link href="/sandbox/terms" className={linkClass}>Read the terms</Link>
            {account.termsVersion && account.termsVersion !== account.termsCurrent && (
              <> (the current version is {account.termsCurrent}).</>
            )}
          </p>
        </Card>

        <Card title="Sign out">
          <p className="mb-3 text-sm text-slate-600">Signs this browser out. Your keys and sessions are not affected.</p>
          <button type="button" onClick={() => void signOut()} disabled={signingOut} className={secondaryButton}>
            <LogOut className="h-4 w-4" aria-hidden />{signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </Card>
      </div>
    </>
  );
}
