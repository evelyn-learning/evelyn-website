'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { DEMO_LANGUAGES } from '@core/demo/demo-languages';
import { DashApiError, dashFetch, errorText, type DashStudentRow } from '../../dash-api';
import { Notice, dangerButton, inputClass, labelClass, primaryButton, secondaryButton } from '../../ui';
import { PageHeader, useDash } from '../DashboardShell';

interface StudentsList { rows: DashStudentRow[]; total: number }

const languageName = (code: string) => DEMO_LANGUAGES.find((l) => l.code === code)?.english ?? code;
const whenText = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const num = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 });

export default function DashboardStudentsPage() {
  const { me } = useDash();
  const isOwner = me.account.role === 'owner';

  const [data, setData] = useState<StudentsList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  // The erase takes an in-page confirm step (no window.confirm): the panel names the student, says what goes,
  // and its button works only once the student id has been typed.
  const [confirming, setConfirming] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [erasing, setErasing] = useState(false);
  const [eraseError, setEraseError] = useState('');
  const [erased, setErased] = useState<{ studentId: string; records: number } | null>(null);
  const typedInput = useRef<HTMLInputElement>(null);
  const result = useRef<HTMLDivElement>(null);
  // The button that opened the panel: focus goes back to it on Cancel.
  const opener = useRef<HTMLButtonElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await dashFetch<StudentsList>('students'));
    } catch (err) {
      if (!(err instanceof DashApiError && err.status === 401)) setError(errorText(err, 'We could not load your students.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => { if (confirming) typedInput.current?.focus(); }, [confirming]);
  // After an erase the row and the panel are gone: focus lands on the line that says what happened.
  useEffect(() => { if (erased) result.current?.focus(); }, [erased]);

  function ask(studentId: string, button: HTMLButtonElement) {
    opener.current = button;
    setConfirming(studentId);
    setTyped('');
    setEraseError('');
    setErased(null);
  }

  function cancel() {
    setConfirming(null);
    setTyped('');
    setEraseError('');
    opener.current?.focus();
  }

  async function erase(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (erasing || !confirming || typed !== confirming) return;
    const studentId = confirming;
    setErasing(true);
    setEraseError('');
    try {
      const r = await dashFetch<{ ok: true; deleted: Record<string, number> }>('students', { method: 'DELETE', body: { studentId } });
      const records = Object.values(r.deleted ?? {}).reduce((sum, n) => sum + (typeof n === 'number' ? n : 0), 0);
      setData((d) => (d ? { rows: d.rows.filter((x) => x.studentId !== studentId), total: Math.max(0, d.total - 1) } : d));
      setConfirming(null);
      setTyped('');
      setErased({ studentId, records });
    } catch (err) {
      if (err instanceof DashApiError && err.status === 401) return;
      setEraseError(errorText(err, 'We could not delete this student\'s data. Nothing was changed.'));
      // A part of it may be gone: show the list as it now is.
      if (err instanceof DashApiError && err.code === 'erase_incomplete') void load();
    } finally {
      setErasing(false);
    }
  }

  const all = data?.rows ?? [];
  const q = filter.trim().toLowerCase();
  const rows = q ? all.filter((r) => r.studentId.toLowerCase().includes(q)) : all;

  return (
    <>
      <PageHeader title="Students">
        The student ids your sessions were started with, most recent first. Times are in your local time zone.
      </PageHeader>

      {error && (
        <div className="mb-4 space-y-3">
          <Notice>{error}</Notice>
          <button type="button" onClick={() => void load()} className={secondaryButton}>Try again</button>
        </div>
      )}

      {!data && loading && (
        <div role="status" aria-label="Loading students" className="animate-pulse space-y-2">
          {Array.from({ length: 6 }, (_, i) => <div key={i} className="h-12 rounded-lg bg-slate-100" />)}
        </div>
      )}

      <div ref={result} tabIndex={-1} aria-live="polite" className="focus:outline-none">
        {erased && (
          <div className="mb-4">
            <Notice kind="success">
              Deleted everything we held for student <span className="break-all font-mono">{erased.studentId}</span>:
              {' '}{erased.records.toLocaleString()} {erased.records === 1 ? 'record' : 'records'} in all (sessions, transcripts, recordings and the learning record).
            </Notice>
          </div>
        )}
      </div>

      {data && all.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center">
          <p className="text-base font-semibold text-slate-900">No students yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">A student appears here after the first session started with their student id.</p>
          <Link href="/dashboard/try" className={`${primaryButton} mt-5`}>Try it</Link>
        </div>
      )}

      {data && all.length > 0 && (
        <>
          <div className="mb-4 max-w-sm">
            <label htmlFor="student-filter" className={labelClass}>Filter by student id</label>
            <input
              id="student-filter" type="search" autoComplete="off" spellCheck={false}
              value={filter} onChange={(e) => setFilter(e.target.value)} className={inputClass}
            />
          </div>

          {confirming && (
            <form onSubmit={erase} role="group" aria-labelledby="erase-confirm" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p id="erase-confirm" className="text-sm font-semibold text-red-900">
                Delete all data for student <span className="break-all font-mono">{confirming}</span>?
              </p>
              <p className="mt-2 text-sm text-red-900">
                This permanently deletes that student&apos;s sessions, transcripts, recordings and learning record. It cannot be undone.
              </p>
              <label htmlFor="erase-typed" className="mb-1 mt-3 block text-sm font-medium text-red-900">Type the student id to confirm</label>
              <input
                ref={typedInput} id="erase-typed" type="text" autoComplete="off" spellCheck={false} autoCapitalize="off"
                value={typed} onChange={(e) => setTyped(e.target.value)} disabled={erasing}
                className={`${inputClass} max-w-sm font-mono`}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="submit" disabled={erasing || typed !== confirming} className={dangerButton}>
                  <Trash2 className="h-4 w-4" aria-hidden />
                  {erasing ? 'Deleting…' : 'Delete this student\'s data'}
                </button>
                <button type="button" onClick={cancel} disabled={erasing} className={secondaryButton}>Cancel</button>
              </div>
              <div aria-live="polite" className="mt-3">{eraseError && <Notice>{eraseError}</Notice>}</div>
            </form>
          )}

          <div className={`relative overflow-x-auto rounded-lg border border-slate-200 ${loading ? 'opacity-60' : ''}`} aria-busy={loading}>
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">Your students</caption>
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th scope="col" className="px-3 py-2.5 font-medium">Student id</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Sessions</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Minutes</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Last session</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Languages</th>
                  {isOwner && <th scope="col" className="px-3 py-2.5 font-medium"><span className="sr-only">Delete data</span></th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.studentId} className={`border-t border-slate-100 align-top ${confirming === r.studentId ? 'bg-red-50/60' : ''}`}>
                    <th scope="row" className="min-w-[12rem] max-w-[20rem] px-3 py-2.5 font-normal">
                      <span className="break-all font-mono text-xs text-slate-800">{r.studentId}</span>
                    </th>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">{r.sessions.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">{num(r.minutes)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-700">
                      <time dateTime={r.lastSessionAt}>{whenText(r.lastSessionAt)}</time>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700">{r.languages.map(languageName).join(', ') || '—'}</td>
                    {isOwner && (
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button" onClick={(e) => ask(r.studentId, e.currentTarget)} disabled={erasing}
                          className={`${secondaryButton} whitespace-nowrap border-red-300 px-2.5 py-1.5 text-red-700 hover:bg-red-50`}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                          Delete data<span className="sr-only"> of student {r.studentId}</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr className="border-t border-slate-100">
                    <td colSpan={isOwner ? 6 : 5} className="px-3 py-6 text-center text-slate-500">No student id contains &ldquo;{filter.trim()}&rdquo;.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm text-slate-500" aria-live="polite">
            {q ? `${rows.length.toLocaleString()} of ${all.length.toLocaleString()} shown.` : `${all.length.toLocaleString()} ${all.length === 1 ? 'student' : 'students'}.`}
            {data.total > all.length && <> You have {data.total.toLocaleString()} students in all; this page lists the {all.length.toLocaleString()} with the most recent sessions.</>}
          </p>
        </>
      )}

      <p className="mt-6 max-w-3xl text-sm text-slate-600">
        {isOwner ? 'Deleting a student\'s data here' : 'Only the account owner can delete a student\'s data here. The same erase'}
        {isOwner && ' is the same erase that'} is available to your server as{' '}
        <code className="break-all rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">POST /api/portal/v1/student-erase</code>.
      </p>
    </>
  );
}
