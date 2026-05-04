'use client';

/**
 * LabeledImageRenderer — a real image (Unsplash, Wikimedia, NASA, partner-
 * supplied URL) overlaid with brain-supplied callouts.
 *
 * Different from the existing synthesized-diagram tools (cell_diagram,
 * dna, etc.) — those draw schematic vector art. This tool shows an
 * actual photograph or stock illustration that the brain has chosen to
 * support the explanation, then drops labels on it. Useful for biology
 * (real flower with parts labeled), social studies (map with regions),
 * chemistry (lab apparatus), almost anywhere a real image carries
 * information a synthesized diagram can't.
 *
 * Callouts are placed at percentage coordinates on the image (0-100).
 * The renderer draws a small circle marker + a label box, with a leader
 * line from marker to box. Boxes are auto-positioned to avoid overlap
 * via simple horizontal offsets.
 */

import React, { useState } from 'react';

export interface LabeledImageCallout {
  /** Percentage of image width (0-100). */
  x: number;
  /** Percentage of image height (0-100). */
  y: number;
  /** Short label shown in the box. */
  text: string;
  /** Optional longer caption shown smaller below the label. */
  caption?: string;
  /** Optional color override (defaults to blue). */
  color?: string;
}

export interface LabeledImageSpec {
  title?: string;
  /** Image URL. Must be a publicly fetchable image (https). */
  src: string;
  /** Required alt text for accessibility. */
  alt: string;
  /** Optional credit/attribution shown below the image. */
  credit?: string;
  /** Callouts to overlay. */
  callouts?: LabeledImageCallout[];
}

export default function LabeledImageRenderer({ spec }: { spec: LabeledImageSpec }) {
  // Track image load failure. When the brain-supplied URL doesn't
  // resolve (404, blocked CDN, CORS strip, deep-linking restrictions),
  // the broken-image icon is tiny but the callouts still draw at their
  // percentage positions and overlap each other unreadably. Observed
  // 2026-05-04 thermodynamics session: a Wikimedia hot-tea image
  // failed to load and three callouts collided on the broken-icon.
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="labeled-image-renderer max-w-2xl">
        {spec.title && (
          <div className="text-center text-sm font-semibold text-gray-700 mb-2">{spec.title}</div>
        )}
        <div className="rounded border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <div className="text-sm text-gray-500 italic">{spec.alt || 'Image unavailable'}</div>
          {spec.callouts && spec.callouts.length > 0 && (
            <ul className="mt-3 inline-block text-left text-sm text-gray-700 space-y-1">
              {spec.callouts.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: c.color || '#2563eb' }}
                  />
                  <span>
                    <span className="font-medium">{c.text}</span>
                    {c.caption && <span className="text-xs text-gray-500"> — {c.caption}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="labeled-image-renderer max-w-2xl">
      {spec.title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">{spec.title}</div>
      )}
      <div className="relative inline-block w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={spec.src}
          alt={spec.alt}
          className="w-full h-auto rounded border border-gray-300 block"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {spec.callouts?.map((c, i) => (
          <div key={i}>
            {/* Marker dot at the callout's image-relative position */}
            <span
              className="absolute z-10 w-3 h-3 rounded-full border-2 border-white shadow"
              style={{
                left: `calc(${c.x}% - 6px)`,
                top: `calc(${c.y}% - 6px)`,
                backgroundColor: c.color || '#2563eb',
              }}
            />
            {/* Label box, offset to whichever half avoids the image edge */}
            <div
              className="absolute z-20 px-2 py-1 bg-white border-2 rounded shadow text-sm max-w-[160px]"
              style={{
                left: c.x > 50 ? `auto` : `calc(${c.x}% + 14px)`,
                right: c.x > 50 ? `calc(${100 - c.x}% + 14px)` : 'auto',
                top: `calc(${c.y}% - 14px)`,
                borderColor: c.color || '#2563eb',
              }}
            >
              <div className="font-semibold text-gray-900 leading-tight">{c.text}</div>
              {c.caption && (
                <div className="text-xs text-gray-600 leading-snug mt-0.5">{c.caption}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      {spec.credit && (
        <div className="text-xs text-gray-500 mt-1 italic">Image: {spec.credit}</div>
      )}
    </div>
  );
}
