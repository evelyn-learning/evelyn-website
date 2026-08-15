'use client';

/**
 * PassageRenderer
 *
 * Bordered card for a quote, definition, or short passage — the board-side
 * half of the verbosity-3/3 fix (see system-prompt-builder.ts's "quotes,
 * definitions, and passages go on the board" rule). The tutor puts the
 * text HERE instead of reading it aloud in full; speech stays to the
 * analytical point.
 *
 * Simpler sibling of AnnotatedPassageRenderer: no line numbers or margin
 * notes, `highlights` is a flat array of exact substrings (not line +
 * substring pairs). `text` runs through InlineMathText per segment so an
 * inline $…$ math definition still renders via KaTeX, and so does the
 * text inside a highlighted `<mark>` span.
 *
 * Long passages scroll within the card rather than growing the board.
 */

import { InlineMathText } from './InlineMathText';
import { splitHighlights } from '@/lib/tutor/whiteboard/passage-highlights';

export interface PassageRendererProps {
  title?: string;
  source?: string;
  text: string;
  highlights?: string[];
}

export default function PassageRenderer({
  title,
  source,
  text,
  highlights = [],
}: PassageRendererProps) {
  const segments = splitHighlights(text || '', highlights);

  return (
    <div className="passage-renderer my-3 p-4 bg-stone-50 border-2 border-stone-300 rounded-lg max-w-2xl">
      {title && (
        <h4 className="text-sm font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></h4>
      )}

      <blockquote className="max-h-96 overflow-y-auto pr-1 font-serif text-[17px] leading-relaxed text-gray-800 border-l-4 border-stone-300 pl-4">
        {segments.length === 0 && (
          <span className="text-gray-400 italic">(no passage text)</span>
        )}
        {segments.map((seg, i) =>
          seg.highlighted ? (
            <mark key={i} className="bg-amber-200/70 px-0.5 rounded-sm">
              <InlineMathText text={seg.text} />
            </mark>
          ) : (
            <InlineMathText key={i} text={seg.text} />
          )
        )}
      </blockquote>

      {source && (
        <div className="text-xs text-gray-500 mt-2">— {source}</div>
      )}
    </div>
  );
}
