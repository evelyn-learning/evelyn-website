/**
 * STT API Route
 *
 * Transcribes audio using Deepgram Nova-2.
 * Accepts audio data and returns transcription.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      console.error('[STT API] DEEPGRAM_API_KEY not configured');
      return NextResponse.json({ error: 'STT not configured' }, { status: 500 });
    }

    // Get the audio data from the request
    const contentType = request.headers.get('content-type') || '';
    console.log(`[STT API] Received request, content-type: ${contentType}`);
    let audioData: Buffer;

    if (contentType.includes('audio/')) {
      // Raw audio data
      const arrayBuffer = await request.arrayBuffer();
      audioData = Buffer.from(arrayBuffer);
    } else if (contentType.includes('multipart/form-data')) {
      // Form data with audio file
      const formData = await request.formData();
      const audioFile = formData.get('audio') as File;
      if (!audioFile) {
        return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
      }
      const arrayBuffer = await audioFile.arrayBuffer();
      audioData = Buffer.from(arrayBuffer);
    } else {
      return NextResponse.json(
        { error: 'Invalid content type. Expected audio/* or multipart/form-data' },
        { status: 400 }
      );
    }

    if (audioData.length === 0) {
      console.error('[STT API] Empty audio data');
      return NextResponse.json({ error: 'Empty audio data' }, { status: 400 });
    }

    console.log(`[STT API] Audio data size: ${audioData.length} bytes`);

    // Transcribe with Deepgram
    const deepgram = createClient(apiKey);
    console.log('[STT API] Sending to Deepgram...');

    const response = await deepgram.listen.prerecorded.transcribeFile(audioData, {
      model: 'nova-2',
      language: 'en-US',
      punctuate: true,
      smart_format: true,
      encoding: 'linear16',
      sample_rate: 16000,
    });

    const transcript = response.result?.results?.channels?.[0]?.alternatives?.[0];
    console.log(`[STT API] Deepgram response: "${transcript?.transcript || '(empty)'}"`);

    return NextResponse.json({
      text: transcript?.transcript || '',
      confidence: transcript?.confidence || 0,
      words: transcript?.words?.map((w) => ({
        word: w.word || '',
        start: w.start || 0,
        end: w.end || 0,
        confidence: w.confidence || 0,
      })),
    });
  } catch (error) {
    console.error('[STT API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check STT configuration status
 */
export async function GET() {
  const isConfigured = !!process.env.DEEPGRAM_API_KEY;
  return NextResponse.json({ configured: isConfigured });
}
