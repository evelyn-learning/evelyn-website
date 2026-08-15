import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { ShowcaseSite } from '@/models';

// GET - Fetch all Q&A pairs for a site
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;

    await connectDB();
    const site = await ShowcaseSite.findOne(
      { slug },
      { customQA: 1 }
    ).lean() as { customQA?: Array<{ question: string; answer: string; enabled: boolean }> } | null;

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      qaPairs: site.customQA || [],
    });
  } catch (error) {
    console.error('[CHAT_QA_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch Q&A pairs' },
      { status: 500 }
    );
  }
}

// POST - Create a new Q&A pair
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;
    const body = await request.json();

    const { question, answer, enabled = true } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await ShowcaseSite.findOneAndUpdate(
      { slug },
      {
        $push: {
          customQA: {
            question,
            answer,
            enabled,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      qaPairs: result.customQA,
    });
  } catch (error) {
    console.error('[CHAT_QA_POST]', error);
    return NextResponse.json(
      { error: 'Failed to create Q&A pair' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing Q&A pair
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;
    const body = await request.json();

    const { _id, question, answer, enabled } = body;

    if (!_id) {
      return NextResponse.json(
        { error: 'Q&A ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await ShowcaseSite.findOneAndUpdate(
      { slug, 'customQA._id': _id },
      {
        $set: {
          'customQA.$.question': question,
          'customQA.$.answer': answer,
          'customQA.$.enabled': enabled,
          'customQA.$.updatedAt': new Date(),
        },
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Q&A not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      qaPairs: result.customQA,
    });
  } catch (error) {
    console.error('[CHAT_QA_PUT]', error);
    return NextResponse.json(
      { error: 'Failed to update Q&A pair' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a Q&A pair
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Q&A ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await ShowcaseSite.findOneAndUpdate(
      { slug },
      {
        $pull: {
          customQA: { _id: id },
        },
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      qaPairs: result.customQA,
    });
  } catch (error) {
    console.error('[CHAT_QA_DELETE]', error);
    return NextResponse.json(
      { error: 'Failed to delete Q&A pair' },
      { status: 500 }
    );
  }
}
