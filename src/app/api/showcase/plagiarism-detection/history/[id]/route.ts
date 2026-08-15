import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { connectDB } from '@core/db';
import { AnalysisHistory } from '@/models/AnalysisHistory';

function isObjectId(s: string): boolean {
  return Types.ObjectId.isValid(s);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const teacherId = new URL(req.url).searchParams.get('teacherId');
  if (!teacherId || !isObjectId(teacherId) || !isObjectId(id)) {
    return NextResponse.json({ error: 'teacherId and valid id required' }, { status: 400 });
  }

  try {
    await connectDB();
    // Filter by both _id AND teacherId to prevent IDOR — a teacher can only
    // read their own records even if they guess another id.
    const item = await AnalysisHistory.findOne({ _id: id, teacherId }).lean();
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const teacherId = new URL(req.url).searchParams.get('teacherId');
  if (!teacherId || !isObjectId(teacherId) || !isObjectId(id)) {
    return NextResponse.json({ error: 'teacherId and valid id required' }, { status: 400 });
  }

  try {
    await connectDB();
    const result = await AnalysisHistory.deleteOne({ _id: id, teacherId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
