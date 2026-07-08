'use client';

/**
 * Session-quality A3 (2026-07-08): downloadable session PDF on
 * /admin/tutor-sessions/[sessionId]. Ports the /admin/demos export — same
 * exporter (exportTutorSessionPDF, dynamic jsPDF import), fed from the
 * TutorSession record's stored transcript + whiteboardCommands instead of
 * demo interactions. Stored whiteboard commands are wrapped as
 * { action, data: {...args}, timestamp } — flattened back for the exporter.
 */

import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';

interface StoredTranscriptEntry {
  role: string;
  text: string;
  timestamp: string;
  whiteboardCommands?: Array<Record<string, unknown>>;
  pedagogicalIntent?: string;
}

interface StoredWhiteboardEntry {
  action: string;
  data?: Record<string, unknown>;
  timestamp?: string;
}

interface Props {
  transcript: StoredTranscriptEntry[];
  whiteboardCommands: StoredWhiteboardEntry[];
  topic?: string;
  subject?: string;
  level?: string;
  sessionGoal?: string;
  studentName?: string;
}

export default function ExportSessionPDFButton({
  transcript, whiteboardCommands, topic, subject, level, sessionGoal, studentName,
}: Props) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { exportTutorSessionPDF } = await import('@/lib/utils/export/pdf-tutor-session');
      const pdfTranscript = transcript.map((t, i) => ({
        id: String(i),
        timestamp: new Date(t.timestamp),
        role: (t.role === 'student' || t.role === 'tutor' || t.role === 'system' ? t.role : 'system') as 'student' | 'tutor' | 'system',
        text: t.text || '',
        ...(t.whiteboardCommands?.length
          ? { whiteboardCommands: t.whiteboardCommands as Array<{ action: string; [key: string]: unknown }> }
          : {}),
        ...(t.pedagogicalIntent ? { pedagogicalIntent: t.pedagogicalIntent } : {}),
      }));
      const pdfCommands = whiteboardCommands
        .filter((c) => c && c.action)
        .map((c) => ({ ...(c.data ?? {}), action: c.action }));
      await exportTutorSessionPDF(
        pdfTranscript,
        pdfCommands,
        topic || 'Tutor Session',
        sessionGoal || 'practice',
        studentName,
        { subject, level },
      );
    } catch (err) {
      console.error('[ExportSessionPDFButton] export failed:', err);
      alert('PDF export failed — see console.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting || transcript.length === 0}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      title={transcript.length === 0 ? 'No transcript to export' : 'Download session PDF'}
    >
      {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
      {exporting ? 'Exporting…' : 'Download PDF'}
    </button>
  );
}
