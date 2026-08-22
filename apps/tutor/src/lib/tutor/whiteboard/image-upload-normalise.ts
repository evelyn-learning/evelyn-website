/**
 * R50c — normalise an uploaded image into a format the vision API accepts.
 *
 * Live report (2026-08-21): an AVIF upload silently did nothing. The cause is
 * a THREE-WAY mismatch that no single layer could see:
 *   · every file input advertises `accept="image/*"`, so the OS picker offers
 *     avif/heic/bmp/svg and the student reasonably expects them to work;
 *   · `/api/tutor/extract-homework` whitelists exactly
 *     ['image/jpeg','image/png','image/gif','image/webp'] and 400s otherwise;
 *   · that whitelist is not arbitrary — it is what the vision model accepts as
 *     `media_type`, so simply widening it moves the failure downstream instead
 *     of fixing it, and the student still sees nothing happen.
 *
 * So the fix cannot be a longer list. It has to CONVERT: any format the
 * BROWSER can decode is re-encoded to PNG here, before it ever reaches the
 * API. That covers avif, heic (Safari), bmp and svg for free, and it keeps
 * working for formats that do not exist yet, because the capability follows
 * the browser's decoder rather than a list anyone has to maintain.
 *
 * Pass-through for already-supported types so the common path costs nothing.
 */

/** Exactly the API's whitelist — keep in sync with extract-homework/route.ts. */
export const VISION_SAFE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

export function isVisionSafe(mimeType: string): boolean {
  return VISION_SAFE_TYPES.has((mimeType || '').toLowerCase().split(';')[0].trim());
}

/** Data-URL mime, lowercased. '' when the string is not a data URL. */
export function dataUrlMime(dataUrl: string): string {
  const m = /^data:([^;,]+)[;,]/.exec(dataUrl || '');
  return m ? m[1].toLowerCase() : '';
}

/**
 * Returns a data URL guaranteed to carry a vision-safe mime type, or null if
 * the browser could not decode the input at all (a genuinely unreadable file
 * — the ONE case the caller must surface rather than retry).
 *
 * Deliberately returns null instead of throwing: every existing call site is
 * a fire-and-forget upload handler, and a throw there would reproduce the
 * exact silent-nothing-happens failure this exists to fix.
 */
export async function normaliseUploadedImage(dataUrl: string): Promise<string | null> {
  if (!dataUrl) return null;
  if (isVisionSafe(dataUrlMime(dataUrl))) return dataUrl;
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('decode failed'));
      el.src = dataUrl;
    });
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return null;
    // Cap the long edge: an 8000px phone photo re-encodes to a base64 payload
    // large enough to be refused upstream, which would swap one silent failure
    // for another. 2000px is comfortably above what the model resolves.
    const scale = Math.min(1, 2000 / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}
