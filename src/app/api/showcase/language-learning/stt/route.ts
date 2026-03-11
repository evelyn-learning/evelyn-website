/**
 * Language Learning STT API Route
 *
 * Uses OpenAI Whisper to transcribe speech in multiple languages.
 * Supports: Spanish, French, German, Japanese, Mandarin, English.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Map language codes to Whisper language hints
const WHISPER_LANGUAGES: Record<string, string> = {
  'es-ES': 'es',
  'fr-FR': 'fr',
  'de-DE': 'de',
  'ja-JP': 'ja',
  'zh-CN': 'zh',
  'en-US': 'en',
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_SHOWCASE_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'STT not configured' }, { status: 500 });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const languageCode = (formData.get('language') as string) || 'en-US';

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    if (audioFile.size === 0) {
      return NextResponse.json({ error: 'Empty audio data' }, { status: 400 });
    }

    // 25MB limit (OpenAI's limit)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'Audio file too large (max 25MB)' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });
    const whisperLang = WHISPER_LANGUAGES[languageCode] || 'en';

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: whisperLang,
    });

    return NextResponse.json({
      text: transcription.text || '',
    });
  } catch (error) {
    console.error('[Language STT] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Transcription failed' },
      { status: 500 }
    );
  }
}
