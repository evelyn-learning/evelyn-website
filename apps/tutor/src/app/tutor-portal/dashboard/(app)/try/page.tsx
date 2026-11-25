'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useDemoLanguages } from '@core/demo/use-demo-languages';
import { CodeBlock } from '../../../docs/components/CodeBlock';
import { dashFetch, errorText } from '../../dash-api';
import { CopyButton, Notice, focusRing, inputClass, labelClass, linkClass, primaryButton } from '../../ui';
import { Card, PageHeader, useDash } from '../DashboardShell';

const SUBJECTS = [
  { value: 'math', label: 'Math' },
  { value: 'science', label: 'Science' },
  { value: 'ela', label: 'English language arts' },
  { value: 'social-studies', label: 'Social studies' },
  { value: 'cs', label: 'Computer science' },
];

interface TestLink { url: string; claims: Record<string, unknown> }

export default function DashboardTryPage() {
  const { me, refresh } = useDash();
  const cap = me.pool.pooled && me.pool.sessionMaxMinutes > 0 ? me.pool.sessionMaxMinutes : null;

  const [language, setLanguage] = useState('en');

  const offeredLanguages = useDemoLanguages();
  const [subject, setSubject] = useState('math');
  const [level, setLevel] = useState('Grade 8');
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [minutes, setMinutes] = useState('10');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TestLink | null>(null);

  // A first topic in the picked language, so a lesson can be made without typing one.
  const topicHint = offeredLanguages.find((l) => l.code === language)?.firstTopic ?? 'Solving linear equations';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError('');
    try {
      const r = await dashFetch<TestLink>('test-link', {
        body: { language, subject, level: level.trim() || 'Grade 8', topic: topic.trim() || topicHint, mode, minutes: Math.min(30, Math.max(1, Math.round(Number(minutes) || 10))) },
      });
      setResult(r);
    } catch (err) {
      setError(errorText(err, 'We could not create the test lesson. Try again.'));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <PageHeader title="Try it">
        Start a real lesson on your own account, before writing any code.
      </PageHeader>

      <div className="space-y-6">
        {me.pool.exhausted && (
          <Notice>Your sandbox minutes are used up, so a new lesson will not start. Write to info@evelynlearning.com for more.</Notice>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="language" className={labelClass}>Language</label>
                <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} disabled={pending} className={inputClass}>
                  {offeredLanguages.map((l) => (
                    <option key={l.code} value={l.code}>{l.code === 'en' ? l.label : `${l.label} (${l.code})`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="subject" className={labelClass}>Subject</label>
                <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={pending} className={inputClass}>
                  {SUBJECTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="level" className={labelClass}>Level</label>
                <input id="level" type="text" maxLength={40} value={level} onChange={(e) => setLevel(e.target.value)} disabled={pending} className={inputClass} />
              </div>
              <div>
                <label htmlFor="minutes" className={labelClass}>Minutes</label>
                <input
                  id="minutes" type="number" inputMode="numeric" min={1} max={30} step={1} required
                  value={minutes} onChange={(e) => setMinutes(e.target.value)} disabled={pending}
                  aria-describedby="minutes-hint" className={inputClass}
                />
                <p id="minutes-hint" className="mt-1 text-xs text-slate-500">
                  1 to 30.{cap ? ` Sandbox sessions end at ${cap} minutes whatever is asked.` : ''}
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="topic" className={labelClass}>Topic</label>
              <input
                id="topic" type="text" maxLength={160} placeholder={topicHint}
                value={topic} onChange={(e) => setTopic(e.target.value)} disabled={pending}
                aria-describedby="topic-hint" className={inputClass}
              />
              <p id="topic-hint" className="mt-1 text-xs text-slate-500">Free text, in the lesson&apos;s language. Left empty, the lesson is on &ldquo;{topicHint}&rdquo;.</p>
            </div>

            <fieldset disabled={pending}>
              <legend className={labelClass}>Mode</legend>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {([['voice', 'Voice (the student can also type)'], ['text', 'Text only']] as const).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio" name="mode" value={value} checked={mode === value} onChange={() => setMode(value)}
                      className={`h-4 w-4 border-slate-300 text-blue-600 ${focusRing}`}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div aria-live="polite">{error && <Notice>{error}</Notice>}</div>

            <button type="submit" disabled={pending} className={primaryButton}>
              {pending ? 'Creating…' : 'Create test lesson'}
            </button>

            <p className="text-sm text-slate-500">
              A test lesson uses your sandbox minutes and appears in{' '}
              <Link href="/dashboard/sessions" className={linkClass}>Sessions</Link> as student{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">dashboard-test</code>.
            </p>
          </form>
        </Card>

        {/* Always in the page, so a new result is announced. */}
        <div aria-live="polite">
          {result && (
            <Card title="Your test lesson is ready">
              <p className="mb-3 text-sm text-slate-600">The link works for two hours. It opens the same session page you would embed.</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <code aria-label="Lesson link" className="min-w-0 flex-1 truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800">
                  {result.url}
                </code>
                <div className="flex shrink-0 gap-2">
                  <a
                    href={result.url} target="_blank" rel="noopener noreferrer" className={primaryButton}
                    // The page behind us reads usage once; look again when the visitor comes back from the lesson.
                    onClick={() => window.addEventListener('focus', () => { void refresh(); }, { once: true })}
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />Open lesson<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <CopyButton value={result.url} label="Copy link" />
                </div>
              </div>

              <h3 className="mt-5 text-sm font-semibold text-slate-900">Token payload</h3>
              <p className="mt-1 text-sm text-slate-600">
                This is the token payload your server would sign with your secret. See{' '}
                <Link href="/dashboard/keys" className={linkClass}>API keys</Link> for the signing code.
              </p>
              <CodeBlock language="json" title="claims">{JSON.stringify(result.claims, null, 2)}</CodeBlock>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
