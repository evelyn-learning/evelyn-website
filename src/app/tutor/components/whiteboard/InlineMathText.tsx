'use client';

/**
 * InlineMathText
 *
 * Renders a string that mixes plain text and inline LaTeX math, where math
 * segments are delimited with $...$ (single dollar signs). Used for problem
 * statements, answer choices, and other cards where the tutor embeds
 * equations inline with prose.
 *
 * Example:
 *   "Solve for x: $2^{x+1} - 3 \\cdot 2^{x+2} = 0$"
 *   renders "Solve for x: " as text and the math in KaTeX.
 *
 * Currency vs. math: a $...$ pair is treated as math ONLY if the inner
 * content contains a LaTeX-style indicator (\, ^, _, {, }) or is a short
 * (≤4 char) whitespace-free identifier like $x$ or $T$. Without that, the
 * $ is treated as literal text — so prose containing currency like
 * "Maya has $50 and a $15 movie" renders correctly instead of being parsed
 * as a math segment "50 and a 15 movie".
 *
 * Unmatched $ is treated as literal text (so a raw "$5" shows as dollar-five).
 *
 * The pure segmenter lives in src/lib/tutor/whiteboard/inline-math.ts
 * (importable from node test scripts — this file pulls in katex CSS).
 */

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { segment, autoWrapUnicodeMath, autoWrapLatex, decodeHtmlEntities } from '@/lib/tutor/whiteboard/inline-math';

interface InlineMathTextProps {
  text: string;
  className?: string;
  /** Skip the currency guard — every balanced $...$ pair renders as math.
   *  For trusted-source contexts (Q pin gists) where $ always means LaTeX. */
  forceMath?: boolean;
}

function Math({ latex }: { latex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    try {
      const processed = latex
        .replace(/\\\\(?=[a-zA-Z{])/g, '\\')
        .replace(/\\n/g, '\n');
      katex.render(processed, ref.current, {
        throwOnError: false,
        displayMode: false,
        trust: true,
        strict: false,
      });
    } catch {
      // Fall back to raw text if KaTeX throws
      if (ref.current) ref.current.textContent = latex;
    }
  }, [latex]);
  return <span ref={ref} className="inline-block align-baseline" />;
}

export function InlineMathText({ text, className = '', forceMath = false }: InlineMathTextProps) {
  const parts = segment(autoWrapLatex(autoWrapUnicodeMath(decodeHtmlEntities(text))), forceMath);
  return (
    <span className={`whitespace-pre-wrap ${className}`}>
      {parts.map((p, i) =>
        p.kind === 'math'
          ? <Math key={i} latex={p.body} />
          : <span key={i}>{p.body}</span>
      )}
    </span>
  );
}
