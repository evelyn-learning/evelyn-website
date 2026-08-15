import React from 'react';

/**
 * Renders inline markdown (bold, italic) within a text string.
 * Returns an array of React nodes with <strong> and <em> elements.
 */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match **bold**, *italic*, and <strong>text</strong>
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|<strong>(.*?)<\/strong>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      // **bold**
      nodes.push(<strong key={match.index} className="font-semibold">{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      // *italic*
      nodes.push(<em key={match.index}>{match[2]}</em>);
    } else if (match[3] !== undefined) {
      // <strong>text</strong>
      nodes.push(<strong key={match.index} className="font-semibold">{match[3]}</strong>);
    }
    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

/**
 * Renders a full markdown string with headers, bullets, and inline formatting.
 * Used for teacher briefs and other structured AI output.
 */
export function renderFullMarkdown(text: string): React.ReactNode[] {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return (
        <h3 key={i} className="text-base font-bold mt-4 mb-2" style={{ color: '#1A1A1A' }}>
          {renderInline(line.replace('## ', ''))}
        </h3>
      );
    }
    if (line.startsWith('# ')) {
      return (
        <h2 key={i} className="text-lg font-bold mt-4 mb-2" style={{ color: '#1A1A1A' }}>
          {renderInline(line.replace('# ', ''))}
        </h2>
      );
    }
    if (line.match(/^[-•]\s/)) {
      return (
        <div key={i} className="flex gap-2 ml-2 mb-1">
          <span className="flex-shrink-0" style={{ color: '#C8402A' }}>•</span>
          <span className="text-sm" style={{ color: '#1A1A1A' }}>
            {renderInline(line.replace(/^[-•]\s/, ''))}
          </span>
        </div>
      );
    }
    if (line.trim() === '') return <div key={i} className="h-2" />;
    return (
      <p key={i} className="text-sm mb-1" style={{ color: '#1A1A1A' }}>
        {renderInline(line)}
      </p>
    );
  });
}

/**
 * Renders inline markdown for chat bubble content.
 * Returns a span with properly rendered bold/italic text.
 */
export function renderChatContent(content: string): React.ReactNode {
  return <span>{renderInline(content)}</span>;
}
