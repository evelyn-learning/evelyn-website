/**
 * Extracted verbatim from VoiceTutorRealtime.tsx (seam-extraction slice 1,
 * 2026-07-05). Pure module — no component state.
 */

/** Rasterize a writing gesture for OCR: bbox-cropped strokes, white bg,
 *  dark ink, longest side ~640px. Returns a base64 PNG (no data: prefix). */
export function rasterizeGestureStrokes(
  strokes: { x: number; y: number }[][],
  bbox: { x: number; y: number; w: number; h: number },
): string | null {
  const pad = 0.02;
  const bw = bbox.w + pad * 2;
  const bh = bbox.h + pad * 2;
  if (bw <= 0 || bh <= 0) return null;
  const scale = 640 / Math.max(bw, bh);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(32, Math.round(bw * scale));
  canvas.height = Math.max(32, Math.round(bh * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const stroke of strokes) {
    ctx.beginPath();
    stroke.forEach((p, i) => {
      const x = (p.x - bbox.x + pad) * scale;
      const y = (p.y - bbox.y + pad) * scale;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  return canvas.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, '');
}

/** OCR containment: extract-homework DESCRIBES unclear ink instead of
 *  transcribing ("The image appears to contain…"). A meta-description or
 *  an implausibly long "transcription" must NOT reach the brain as the
 *  student's literal words — degrade to the unreadable wording instead
 *  (observed live 2026-07-05; proper transcribe-mode endpoint is a
 *  follow-up). */
export function sanitizeInkOcrText(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined;
  const text = raw.trim();
  if (!text || text.length > 120) return undefined;
  if (/^th(e|is)\s+(image|photo|picture|drawing)\b/i.test(text)) return undefined;
  if (/\b(image|photo|picture)\b.{0,40}\b(appears|seems|shows|contains|looks like)\b/i.test(text)) return undefined;
  return text;
}
