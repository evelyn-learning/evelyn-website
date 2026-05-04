import { NextRequest, NextResponse } from 'next/server';
import {
  extractDocxText,
  extractPdfText,
  normalizeExtractedText,
} from '@/lib/utils/document-extract';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File exceeds 10MB limit.' }, { status: 400 });
    }

    const fileName = file.name;
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    let text = '';

    if (ext === '.txt') {
      text = await file.text();
    } else if (ext === '.docx') {
      const buffer = Buffer.from(await file.arrayBuffer());
      text = await extractDocxText(buffer);
    } else if (ext === '.pdf') {
      const buffer = Buffer.from(await file.arrayBuffer());
      text = await extractPdfText(buffer);
    } else {
      return NextResponse.json(
        { error: `Unsupported file type: ${ext}. Accepted: .docx, .pdf, .txt` },
        { status: 400 }
      );
    }

    text = normalizeExtractedText(text);

    if (!text) {
      return NextResponse.json({ error: 'Could not extract text from file.' }, { status: 400 });
    }

    return NextResponse.json({ text, fileName });
  } catch (error) {
    console.error('File parse error:', error);
    return NextResponse.json({ error: 'Failed to parse file.' }, { status: 500 });
  }
}
