import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listApMacroTopics } from '@/lib/admin/video-curator/ap-macro-topics';
import { countSegmentsByConcept } from '@/lib/admin/video-curator/store';
import { countDraftsByConcept } from '@/lib/admin/video-curator/drafts-store';
import type { TopicWithStatus } from '@/lib/admin/video-curator/types';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const topics = listApMacroTopics();
  const [savedCounts, draftCounts] = await Promise.all([
    countSegmentsByConcept(),
    countDraftsByConcept(),
  ]);
  const out: TopicWithStatus[] = topics.map((t) => ({
    ...t,
    savedSegmentCount: savedCounts[t.conceptId] ?? 0,
    draftCount: draftCounts[t.conceptId] ?? 0,
  }));
  return NextResponse.json({ course: 'ap-macroeconomics', topics: out });
}
