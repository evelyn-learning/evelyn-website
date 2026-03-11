import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File exceeds 10MB limit.' }, { status: 400 });
    }

    const fileName = file.name;
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    let text = '';

    if (ext === '.txt') {
      text = await file.text();
    } else if (ext === '.docx') {
      const mammoth = await import('mammoth');
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (ext === '.pdf') {
      // pdf-parse v1 index.js tries to read a test PDF on import — bypass by
      // requiring the internal lib entry point directly.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse/lib/pdf-parse');
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await pdfParse(buffer);
      text = result.text || '';
    } else {
      return NextResponse.json(
        { error: `Unsupported file type: ${ext}. Accepted: .docx, .pdf, .txt` },
        { status: 400 }
      );
    }

    // Clean up whitespace
    text = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

    if (!text) {
      return NextResponse.json({ error: 'Could not extract text from file.' }, { status: 400 });
    }

    return NextResponse.json({ text, fileName });
  } catch (error) {
    console.error('File parse error:', error);
    return NextResponse.json({ error: 'Failed to parse file.' }, { status: 500 });
  }
}
