'use client';

/**
 * GreenApple round-2 Task 9 — full-screen zoom for a student's uploaded image
 * (opened from the transcript thumbnail). Closes on the × button, Escape, or a
 * click on the backdrop; a click on the image itself does not close it.
 *
 * Portalled like ResizableModal in SessionControls.tsx: the transcript can sit
 * under a `backdrop-filter` ancestor (which traps `fixed` descendants), so the
 * overlay renders into <body> — or into the fullscreen element while the stage
 * is browser-fullscreen (anything under <body> is invisible then). `mounted`
 * keeps SSR and the first client render identical.
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ImageZoomOverlayProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageZoomOverlay({ src, alt, onClose }: ImageZoomOverlayProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!mounted || typeof document === 'undefined') return null;
  const fsDoc = document as Document & { webkitFullscreenElement?: Element | null };
  const portalTarget = fsDoc.fullscreenElement ?? fsDoc.webkitFullscreenElement ?? document.body;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white text-2xl leading-none flex items-center justify-center hover:bg-white/20"
      >
        ×
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element -- data: URL from the student's upload */}
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />
    </div>,
    portalTarget,
  );
}
