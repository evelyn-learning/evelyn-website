'use client';

import React, { useRef, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function InlineKatex({ latex }: { latex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, {
          throwOnError: false,
          displayMode: false,
          strict: false,
        });
      } catch {
        ref.current.textContent = `$${latex}$`;
      }
    }
  }, [latex]);
  return <span ref={ref} />;
}

function FormattedLine({ text }: { text: string }) {
  const tokenRegex = /(\*\*[^*]+\*\*|\$[^$\n]{1,150}\$)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`t${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`b${match.index}`} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('$') && token.endsWith('$')) {
      parts.push(<InlineKatex key={`m${match.index}`} latex={token.slice(1, -1)} />);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`t${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return <span>{parts.length > 0 ? parts : text}</span>;
}

export default function FormattedText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/);

  return (
    <div className="space-y-2">
      {paragraphs.map((para, pi) => (
        <div key={pi}>
          {para.split('\n').map((line, li) => (
            <React.Fragment key={li}>
              {li > 0 && <br />}
              <FormattedLine text={line} />
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Render text that may contain inline LaTeX between $ delimiters */
export function MathText({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineKatex key={i} latex={part.slice(1, -1)} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

/** Render LaTeX in display or inline mode */
export function MathDisplay({ latex, display = false }: { latex: string; display?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, {
          throwOnError: false,
          displayMode: display,
          trust: true,
          strict: false,
        });
      } catch {
        ref.current.textContent = latex;
      }
    }
  }, [latex, display]);

  return <span ref={ref} />;
}
