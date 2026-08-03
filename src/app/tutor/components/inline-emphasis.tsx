'use client';

/**
 * Shared emphasis (*word*, **word**) + inline-math bubble rendering.
 *
 * Hoisted out of TranscriptView.tsx (R38 task 13) so the admin/student
 * replay's TranscriptBubble (src/app/admin/tutor-sessions/components/
 * ReplayPlayer.tsx) can apply the same emphasis handling instead of
 * showing raw asterisks. TranscriptView keeps importing renderInlineEmphasis
 * from here (verbatim, zero behavior change) but keeps its OWN
 * renderBubbleText wrapper local — that wrapper also runs
 * normalizeSentenceGaps (a live-drawer display-side fixup for the brain's
 * "1.So" / "$.Now" run-ons) before splitting, which is a TranscriptView-
 * specific display concern that should not silently start rewriting
 * historical replay text. renderBubbleEmphasis below is the split-then-
 * emphasize core WITHOUT that normalization pass, shared by both surfaces.
 */

import React from 'react';
import { segment } from '@/lib/tutor/whiteboard/inline-math';
import { InlineMathText } from './whiteboard/InlineMathText';

/** Render markdown-style *emphasis* and **strong** as actual styled spans
 *  instead of leaving the asterisks raw in the chat bubble. The brain
 *  uses *word* as a TTS hint AND as visual emphasis; we strip the
 *  asterisks and apply <em>/<strong> in their place. */
export function renderInlineEmphasis(text: string): React.ReactNode {
  if (!text) return text;
  // Split on **bold** and *italic*. Order: bold first, then italic, so
  // ** doesn't get eaten by the * matcher.
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  // Combined regex: capture either a bold (**...**) or italic (*...*) run.
  const RE = /(\*\*([^*\n]+)\*\*|\*([^*\n]+)\*)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = RE.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
    if (m[2] !== undefined) {
      parts.push(<strong key={`b-${key++}`} className="font-semibold">{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      parts.push(<em key={`i-${key++}`} className="italic">{m[3]}</em>);
    }
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  // If nothing matched, return the plain string unchanged.
  if (parts.length === 0) return text;
  void remaining; // silence linter
  return parts;
}

/** Split-then-emphasize core shared by TranscriptView's renderBubbleText
 *  and the replay TranscriptBubble: split $…$ math out (InlineMathText
 *  owns math-vs-currency segmentation) and route the remaining prose
 *  through renderInlineEmphasis so emphasis markers never leak into a
 *  KaTeX span. Does NOT run normalizeSentenceGaps — see module doc. */
export function renderBubbleEmphasis(text: string): React.ReactNode {
  if (!text || !text.includes('$')) return renderInlineEmphasis(text);
  const parts = segment(text);
  if (!parts.some((p) => p.kind === 'math')) return renderInlineEmphasis(text);
  return parts.map((p, i) =>
    p.kind === 'math'
      ? <InlineMathText key={`m-${i}`} text={`$${p.body}$`} />
      : <React.Fragment key={`t-${i}`}>{renderInlineEmphasis(p.body)}</React.Fragment>,
  );
}
