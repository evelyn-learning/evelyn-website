import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { verifyEmbedTokenAsync } from '@/lib/tutor/portal/embed-token';
import { learnerSummaryEnabled, listLearnerSessions, runSummaryForSession, tokenTutorLanguages, type LearnerSessionRow } from '@/lib/tutor/portal/learner-summary-store';
import { isLearnerSummarySubject } from '@/lib/tutor/portal/learner-summary';
import { signReplayToken, replayUrl, type ReplayTokenPayload } from '@/lib/tutor/portal/replay-token';
import { partnerFrameMetadata } from '@/lib/tutor/portal/partner-frame-metadata';
import LearnerSessionCard from './LearnerSessionCard';
import { startLessonUrl, shouldRunSummary } from './home-rows';

/**
 * Learner home: "Your lessons" — the learner's finished sessions with summary,
 * replay and PDF. Scoped by the embed token's partner_id AND student_id.
 * Only language lessons are listed (summaries exist only for them); a lesson
 * still running elsewhere is "In progress" and not summarised; with
 * TUTOR_LEARNER_SUMMARY=off the cards show no summary and nothing generates.
 */
export const dynamic = 'force-dynamic';

interface HomePageProps { searchParams: Promise<{ token?: string }> }

export async function generateMetadata(): Promise<Metadata> {
  return partnerFrameMetadata('Your lessons');
}

function Refusal({ message }: { message: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gray-100 p-6">
      <div className="max-w-md rounded-xl bg-white p-8 text-center shadow">
        <h1 className="text-lg font-semibold text-gray-900">Your lessons are unavailable</h1>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}

async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get('host');
  if (host) {
    const proto = (h.get('x-forwarded-proto') ?? '').split(',')[0].trim() || 'https';
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://tutor-demo.evelynlearning.com';
}

export default async function LearnerHomePage({ searchParams }: HomePageProps) {
  const { token } = await searchParams;
  const verdict = await verifyEmbedTokenAsync(token ?? null);
  if (!verdict.ok || !token) {
    return <Refusal message="This link is invalid or has expired. Open your lessons again from your dashboard." />;
  }
  const { payload } = verdict;
  const student_id = payload.student_id;
  if (payload.mode === 'replay' || typeof student_id !== 'string' || !student_id) {
    return <Refusal message="This link does not identify a learner, so lessons cannot be shown." />;
  }

  // Summaries are generated only for language lessons: other subjects are not listed.
  const rows = (await listLearnerSessions(payload.partner_id, student_id)).filter((r) => isLearnerSummarySubject(r.subject));
  const summaryDisabled = !learnerSummaryEnabled();
  const now = Date.now();
  const fallbackTutorLanguages = tokenTutorLanguages(payload.tutor_languages);
  const origin = await requestOrigin();
  const b = payload.branding;
  const branding = b && typeof b === 'object' && !Array.isArray(b) ? (b as ReplayTokenPayload['branding'] & { primary_color?: string }) : undefined;
  const brandStyle = typeof branding?.primary_color === 'string' && branding.primary_color
    ? ({ '--brand-color': branding.primary_color } as React.CSSProperties)
    : {};

  const cards: Array<{ row: LearnerSessionRow; replayUrl: string | null }> = [];
  for (const row of rows) {
    let shown = row;
    if (shouldRunSummary(row, now, { summaryDisabled })) {
      void runSummaryForSession(row.sessionId, undefined, { fallbackTutorLanguages }).catch((e) => console.warn('[learner-home] summary run failed', row.sessionId, (e as Error)?.message));
      shown = { ...row, summary: { status: 'pending' } };
    }
    let url: string | null = null;
    try {
      const t = await signReplayToken({
        partner_id: payload.partner_id, student_id, session_id: row.sessionId,
        ...(branding ? { branding } : {}),
      });
      if (t) url = replayUrl(t, origin);
    } catch (err) {
      console.warn('[learner-home] replay token mint failed', (err as Error)?.message);
    }
    cards.push({ row: shown, replayUrl: url });
  }

  const studentName = typeof payload.student_name === 'string' && payload.student_name.trim() ? payload.student_name.trim() : '';
  const lessonTitle = rows[0]?.topic || (typeof payload.topic === 'string' ? payload.topic : '');

  return (
    <div className="min-h-screen bg-gray-100" style={brandStyle}>
      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{studentName || 'Your lessons'}</h1>
            {lessonTitle && <p className="text-sm text-gray-500">{lessonTitle}</p>}
          </div>
          <a
            href={startLessonUrl(token)}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--brand-color, #2563eb)' }}
          >
            Start a new lesson
          </a>
        </div>

        {cards.length === 0 && (
          <p className="rounded-xl bg-white px-4 py-8 text-center text-sm text-gray-500 shadow-sm">
            Your finished lessons will appear here with a summary, a replay and a PDF.
          </p>
        )}

        {cards.map(({ row, replayUrl: url }) => (
          <LearnerSessionCard
            key={row.sessionId}
            row={row}
            replayUrl={url}
            token={token}
            productName={typeof branding?.product_name === 'string' ? branding.product_name : undefined}
            summaryDisabled={summaryDisabled}
            nowMs={now}
            pollUrl={`/api/tutor-portal/learner-summary?sessionId=${encodeURIComponent(row.sessionId)}&token=${encodeURIComponent(token)}`}
          />
        ))}
      </main>
    </div>
  );
}
