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
 * Unmatched $ is treated as literal text (so a raw "$5" shows as dollar-five).
 */

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface InlineMathTextProps {
  text: string;
  className?: string;
}

// Split a string into alternating plain-text and math segments.
// Math is anything between matched single $...$ that doesn't include whitespace-only
// content and doesn't span across a newline.
function segment(text: string): Array<{ kind: 'text' | 'math'; body: string }> {
  if (!text) return [];
  const out: Array<{ kind: 'text' | 'math'; body: string }> = [];
  let i = 0;
  while (i < text.length) {
    const dollar = text.indexOf('$', i);
    if (dollar < 0) {
      out.push({ kind: 'text', body: text.slice(i) });
      break;
    }
    // Escaped \$ → treat as literal dollar
    if (dollar > 0 && text[dollar - 1] === '\\') {
      out.push({ kind: 'text', body: text.slice(i, dollar - 1) + '$' });
      i = dollar + 1;
      continue;
    }
    const close = text.indexOf('$', dollar + 1);
    if (close < 0) {
      // Unmatched — emit remainder as text
      out.push({ kind: 'text', body: text.slice(i) });
      break;
    }
    const inner = text.slice(dollar + 1, close);
    // Skip empty or whitespace-only "$$" pairs; treat as literal text
    if (!inner.trim() || inner.includes('\n')) {
      out.push({ kind: 'text', body: text.slice(i, close + 1) });
      i = close + 1;
      continue;
    }
    if (dollar > i) out.push({ kind: 'text', body: text.slice(i, dollar) });
    out.push({ kind: 'math', body: inner });
    i = close + 1;
  }
  return out;
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

export function InlineMathText({ text, className = '' }: InlineMathTextProps) {
  const parts = segment(text);
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
