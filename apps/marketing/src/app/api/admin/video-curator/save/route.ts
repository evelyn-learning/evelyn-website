import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomUUID } from 'crypto';
import { authOptions } from '@/lib/auth';
import { getApMacroTopic } from '@/lib/admin/video-curator/ap-macro-topics';
import {
  deleteSegment,
  readStore,
  upsertSegment,
} from '@/lib/admin/video-curator/store';
import type { SavedSegment, VideoMeta } from '@/lib/admin/video-curator/types';

interface SaveBody {
  conceptId: string;
  video: VideoMeta;
  segments: Array<{
    id?: string;
    startSec: number;
    endSec: number;
    summary: string;
  }>;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as Partial<SaveBody>;
  if (!body.conceptId || !body.video || !body.segments?.length) {
    return NextResponse.json(
      { error: 'conceptId, video, and segments[] required' },
      { status: 400 },
    );
  }
  const topic = getApMacroTopic(body.conceptId);
  if (!topic) {
    return NextResponse.json({ error: `Unknown conceptId: ${body.conceptId}` }, { status: 404 });
  }

  const now = new Date().toISOString();
  const saved: SavedSegment[] = [];
  for (const seg of body.segments) {
    const out: SavedSegment = {
      id: seg.id ?? randomUUID(),
      course: 'ap-macroeconomics',
      conceptId: body.conceptId,
      conceptTitle: topic.cedTitle,
      youtubeId: body.video.youtubeId,
      videoTitle: body.video.title,
      videoChannel: body.video.channel,
      videoDurationSec: body.video.durationSec,
      language: 'en-US',
      startSec: Math.max(0, Math.round(seg.startSec)),
      endSec: Math.max(seg.startSec + 1, Math.round(seg.endSec)),
      summary: seg.summary,
      approvedAt: now,
    };
    await upsertSegment(out);
    saved.push(out);
  }
  return NextResponse.json({ saved });
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const conceptId = request.nextUrl.searchParams.get('conceptId');
  const store = await readStore();
  const segments = conceptId
    ? store.segments.filter((s) => s.conceptId === conceptId)
    : store.segments;
  return NextResponse.json({ segments });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }
  const removed = await deleteSegment(id);
  return NextResponse.json({ removed });
}
