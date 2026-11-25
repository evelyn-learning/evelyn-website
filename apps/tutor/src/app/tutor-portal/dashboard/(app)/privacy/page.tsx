'use client';

import Link from 'next/link';
import { Download } from 'lucide-react';
import { linkClass, secondaryButton } from '../../ui';
import { Card, PageHeader, useDash } from '../DashboardShell';

/**
 * What the sandbox holds and how to get it out or have it deleted. Every statement here is one the product
 * does today; nothing about retention periods, certifications or the companies behind the service belongs
 * on this page until it is written in an agreement.
 */
export default function DashboardPrivacyPage() {
  const { me } = useDash();
  const { account } = me;
  const agreementMail = `mailto:info@evelynlearning.com?subject=${encodeURIComponent(`Data-processing agreement for partner ${me.partnerId}`)}`;

  return (
    <>
      <PageHeader title="Data & privacy">
        What we store for your sessions, how to export it, and how to delete it.
      </PageHeader>

      <div className="max-w-3xl space-y-6">
        <Card title="What we store">
          <p className="text-sm text-slate-600">For each session:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>the transcript,</li>
            <li>the whiteboard,</li>
            <li>the session record: its times, language and topic.</li>
          </ul>
          <p className="mt-3 text-sm text-slate-600">
            For voice sessions the audio is processed to recognise and produce speech.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            All of it is keyed to your partner id (<span className="break-all font-mono text-xs text-slate-800">{me.partnerId}</span>) and
            to your own student ids.
          </p>
        </Card>

        <Card title="Export">
          <p className="mb-3 text-sm text-slate-600">One row for each session, newest first.</p>
          {/* A plain link, so the browser saves the file itself; the route answers with a CSV attachment. */}
          <a href="/api/tutor-portal/dashboard/export" download className={secondaryButton}>
            <Download className="h-4 w-4" aria-hidden />Download sessions (CSV)
          </a>
          <p className="mt-3 text-sm text-slate-500">
            Transcripts and boards are not in the file: they are in each session&apos;s replay, on the{' '}
            <Link href="/dashboard/sessions" className={linkClass}>Sessions</Link> page.
          </p>
        </Card>

        <Card title="Deleting a student's data">
          <p className="text-sm text-slate-600">
            {account.role === 'owner' ? 'You can delete' : 'The account owner can delete'} everything held for one student on the{' '}
            <Link href="/dashboard/students" className={linkClass}>Students</Link> page. Your server can do the same with{' '}
            <code className="break-all rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">POST /api/portal/v1/student-erase</code>.
          </p>
        </Card>

        <Card title="Sandbox rule">
          <p className="text-sm text-slate-600">
            Use test data only in the sandbox, until a written agreement that includes a data-processing agreement is signed.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Write to <a href={agreementMail} className={linkClass}>info@evelynlearning.com</a> to start one.
          </p>
        </Card>

        <Card title="Sandbox terms">
          <p className="text-sm text-slate-600">
            {account.termsVersion
              ? <>This account accepted version <span className="font-medium text-slate-900">{account.termsVersion}</span> of the sandbox terms.</>
              : <>This account has no recorded acceptance of the sandbox terms.</>}
            {' '}
            <Link href="/sandbox/terms" className={linkClass}>Read the terms</Link>
          </p>
        </Card>
      </div>
    </>
  );
}
