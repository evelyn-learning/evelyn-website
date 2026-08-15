import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getDraftsForConcept,
  removeDraft,
} from '@/lib/admin/video-curator/drafts-store';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const conceptId = request.nextUrl.searchParams.get('conceptId');
  if (!conceptId) {
    return NextResponse.json({ error: 'conceptId required' }, { status: 400 });
  }
  const data = await getDraftsForConcept(conceptId);
  return NextResponse.json(data);
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
  const removed = await removeDraft(id);
  return NextResponse.json({ removed });
}
