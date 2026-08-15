import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { SavedLesson } from '@core/models/SavedLesson';

// ============================================================================
// GET — Load a single saved lesson
// ============================================================================
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();
    const lesson = await SavedLesson.findById(id).lean();

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...lesson });
  } catch (error) {
    console.error('[LESSON_ENGINE_LESSONS] Load error:', error);
    return NextResponse.json({ error: 'Failed to load lesson' }, { status: 500 });
  }
}

// ============================================================================
// PUT — Update a saved lesson (overwrite or rename)
// ============================================================================
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await request.json();
    const { lesson, prompt, imageUrls, title } = body;

    const update: Record<string, unknown> = {};

    // Full lesson update (overwrite)
    if (lesson) {
      update.title = lesson.title;
      update.gradeLevel = lesson.gradeLevel;
      update.subject = lesson.subject;
      update.language = lesson.language || 'en';
      update.duration = lesson.duration || '10 min';
      update.lesson = lesson;
    }

    // Rename only
    if (title && !lesson) {
      update.title = title;
    }

    if (prompt !== undefined) update.prompt = prompt;
    if (imageUrls !== undefined) update.imageUrls = imageUrls;

    const result = await SavedLesson.findByIdAndUpdate(id, update, { new: true });

    if (!result) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    console.log(`[LESSON_ENGINE_LESSONS] Updated lesson: "${result.title}" id=${id}`);
    return NextResponse.json({ success: true, id: result._id });
  } catch (error) {
    console.error('[LESSON_ENGINE_LESSONS] Update error:', error);
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

// ============================================================================
// DELETE — Delete a saved lesson
// ============================================================================
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();
    const result = await SavedLesson.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[LESSON_ENGINE_LESSONS] Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
