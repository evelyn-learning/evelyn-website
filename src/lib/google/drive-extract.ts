import { google } from 'googleapis';
import { getAuthorizedClient } from './token-refresh';
import { isMockMode } from './oauth-client';
import {
  extractDocxText,
  extractPdfText,
  normalizeExtractedText,
} from '@/lib/utils/document-extract';

const MIME_GOOGLE_DOC = 'application/vnd.google-apps.document';
const MIME_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const MIME_PDF = 'application/pdf';
const MIME_PLAINTEXT = 'text/plain';

export interface DriveExtractResult {
  text: string;
  mimeType: string;
  fileName: string;
}

export async function extractTextFromDriveFile(
  teacherId: string,
  driveFileId: string
): Promise<DriveExtractResult> {
  if (isMockMode()) {
    const { mockDriveContent } = await import('./__mocks__/fixtures');
    const fixture = mockDriveContent[driveFileId];
    if (!fixture) {
      throw new Error(`Mock Drive file not found: ${driveFileId}`);
    }
    return {
      text: normalizeExtractedText(fixture.text),
      mimeType: fixture.mimeType,
      fileName: fixture.name,
    };
  }

  const auth = await getAuthorizedClient(teacherId);
  const drive = google.drive({ version: 'v3', auth });

  const meta = await drive.files.get({
    fileId: driveFileId,
    fields: 'id, name, mimeType',
  });

  const mimeType = meta.data.mimeType || '';
  const fileName = meta.data.name || driveFileId;

  let text = '';

  if (mimeType === MIME_GOOGLE_DOC) {
    const docs = google.docs({ version: 'v1', auth });
    const doc = await docs.documents.get({ documentId: driveFileId });
    text = flattenDocBody(doc.data.body?.content);
  } else if (mimeType === MIME_DOCX) {
    const buffer = await downloadDriveFile(drive, driveFileId);
    text = await extractDocxText(buffer);
  } else if (mimeType === MIME_PDF) {
    const buffer = await downloadDriveFile(drive, driveFileId);
    text = await extractPdfText(buffer);
  } else if (mimeType === MIME_PLAINTEXT) {
    const buffer = await downloadDriveFile(drive, driveFileId);
    text = buffer.toString('utf8');
  } else {
    throw new Error(`Unsupported Drive attachment mimeType: ${mimeType}`);
  }

  return {
    text: normalizeExtractedText(text),
    mimeType,
    fileName,
  };
}

async function downloadDriveFile(
  drive: ReturnType<typeof google.drive>,
  fileId: string
): Promise<Buffer> {
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );
  return Buffer.from(res.data as ArrayBuffer);
}

interface DocStructuralElement {
  paragraph?: {
    elements?: Array<{ textRun?: { content?: string | null } }>;
  };
}

function flattenDocBody(content: DocStructuralElement[] | undefined | null): string {
  if (!content) return '';
  const parts: string[] = [];
  for (const el of content) {
    if (!el.paragraph?.elements) continue;
    for (const e of el.paragraph.elements) {
      if (e.textRun?.content) parts.push(e.textRun.content);
    }
  }
  return parts.join('');
}
