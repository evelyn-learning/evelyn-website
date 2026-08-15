import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { SavedLesson } from '@core/models/SavedLesson';

// ============================================================================
// GET — List saved lessons
// ============================================================================
export async function GET() {
  try {
    await connectDB();
    const lessons = await SavedLesson.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .select('title gradeLevel subject language duration prompt createdAt')
      .lean();

    return NextResponse.json({ success: true, lessons });
  } catch (error) {
    console.error('[LESSON_ENGINE_LESSONS] List error:', error);
    return NextResponse.json({ error: 'Failed to load lessons' }, { status: 500 });
  }
}

// ============================================================================
// POST — Save a lesson
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { lesson, prompt, imageUrls } = body;

    if (!lesson || !lesson.title) {
      return NextResponse.json({ error: 'Lesson data is required' }, { status: 400 });
    }

    const saved = await SavedLesson.create({
      title: lesson.title,
      gradeLevel: lesson.gradeLevel,
      subject: lesson.subject,
      language: lesson.language || 'en',
      duration: lesson.duration || '10 min',
      prompt: prompt || '',
      lesson,
      imageUrls: imageUrls || {},
    });

    console.log(`[LESSON_ENGINE_LESSONS] Saved lesson: "${lesson.title}" id=${saved._id}`);

    return NextResponse.json({ success: true, id: saved._id });
  } catch (error) {
    console.error('[LESSON_ENGINE_LESSONS] Save error:', error);
    return NextResponse.json({ error: 'Failed to save lesson' }, { status: 500 });
  }
}
