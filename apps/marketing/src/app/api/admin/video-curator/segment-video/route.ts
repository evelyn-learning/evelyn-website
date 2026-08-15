/**
 * Manual-paste fallback: when the reviewer pastes a YouTube URL the
 * batch didn't surface, this endpoint validates the video and runs a
 * fresh segmentation against the topic. Returns one best clip — the
 * paste flow renders it the same way as a batch-generated draft.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getApMacroTopic } from '@/lib/admin/video-curator/ap-macro-topics';
import { validateAndDescribe } from '@/lib/admin/video-curator/youtube';
import { segmentOneVideo } from '@/lib/admin/video-curator/find-clips';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { conceptId, youtubeId } = (await request.json()) as {
    conceptId?: string;
    youtubeId?: string;
  };
  if (!conceptId || !youtubeId) {
    return NextResponse.json({ error: 'conceptId and youtubeId required' }, { status: 400 });
  }
  const topic = getApMacroTopic(conceptId);
  if (!topic) {
    return NextResponse.json({ error: `Unknown conceptId: ${conceptId}` }, { status: 404 });
  }
  const video = await validateAndDescribe(youtubeId);
  if (!video) {
    return NextResponse.json(
      { error: 'Video not found or not embeddable' },
      { status: 404 },
    );
  }
  const { clip, errors } = await segmentOneVideo(topic, video);
  return NextResponse.json({ video, clip, errors });
}
