import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { extractYouTubeId, validateAndDescribe } from '@/lib/admin/video-curator/youtube';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { input } = (await request.json()) as { input?: string };
  if (!input || typeof input !== 'string') {
    return NextResponse.json({ error: 'input required (URL or video id)' }, { status: 400 });
  }
  const youtubeId = extractYouTubeId(input);
  if (!youtubeId) {
    return NextResponse.json({ error: 'Could not extract a YouTube video id from input' }, { status: 400 });
  }
  const meta = await validateAndDescribe(youtubeId);
  if (!meta) {
    return NextResponse.json(
      { error: 'Video not found or not embeddable (it may be private, deleted, or region-restricted)' },
      { status: 404 },
    );
  }
  return NextResponse.json({ video: meta });
}
