"use client";

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div
      className={cn(
        "flex w-full",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
          isAssistant
            ? "rounded-tl-sm bg-gray-100 text-gray-800"
            : "rounded-tr-sm bg-primary-600 text-white"
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
            <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
            <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400" />
          </div>
        ) : (
          <div className="whitespace-pre-wrap break-words">
            {formatMessage(content)}
          </div>
        )}
      </div>
    </div>
  );
}

function formatMessage(content: string): React.ReactNode {
  let keyIndex = 0;

  // Process text for links and emails
  function processLinks(text: string): React.ReactNode[] {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s<>"\]]+)|(?<![a-zA-Z0-9@])([a-zA-Z0-9][-a-zA-Z0-9]*\.(com|org|net|edu|io|co|app)[^\s<>"\]]*)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    // Helper to strip trailing punctuation from URLs
    function cleanUrl(url: string): { cleanedUrl: string; trailingPunct: string } {
      const trailingPunctMatch = url.match(/[.,;:!?]+$/);
      if (trailingPunctMatch) {
        return {
          cleanedUrl: url.slice(0, -trailingPunctMatch[0].length),
          trailingPunct: trailingPunctMatch[0],
        };
      }
      return { cleanedUrl: url, trailingPunct: "" };
    }

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      if (match[1] && match[2]) {
        // Markdown link
        const url = match[2].startsWith("http") ? match[2] : `https://${match[2]}`;
        parts.push(
          <a key={keyIndex++} href={url} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline hover:text-primary-700">
            {match[1]}
          </a>
        );
      } else if (match[3]) {
        // URL with protocol - clean trailing punctuation
        const { cleanedUrl, trailingPunct } = cleanUrl(match[3]);
        parts.push(
          <a key={keyIndex++} href={cleanedUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline hover:text-primary-700">
            {cleanedUrl}
          </a>
        );
        if (trailingPunct) parts.push(trailingPunct);
      } else if (match[4]) {
        // URL without protocol - clean trailing punctuation
        const { cleanedUrl, trailingPunct } = cleanUrl(match[4]);
        parts.push(
          <a key={keyIndex++} href={`https://${cleanedUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline hover:text-primary-700">
            {cleanedUrl}
          </a>
        );
        if (trailingPunct) parts.push(trailingPunct);
      } else if (match[6]) {
        // Email
        parts.push(
          <a key={keyIndex++} href={`mailto:${match[6]}`} className="text-primary-600 underline hover:text-primary-700">
            {match[6]}
          </a>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  }

  // First, handle bold text (**text**)
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const segments: React.ReactNode[] = [];
  let lastBoldIndex = 0;
  let boldMatch;

  while ((boldMatch = boldRegex.exec(content)) !== null) {
    // Add text before bold (process for links)
    if (boldMatch.index > lastBoldIndex) {
      const textBefore = content.slice(lastBoldIndex, boldMatch.index);
      segments.push(...processLinks(textBefore));
    }

    // Add bold text (also process for links inside bold)
    const boldContent = boldMatch[1];
    const processedBold = processLinks(boldContent);
    segments.push(
      <strong key={keyIndex++} className="font-semibold">
        {processedBold}
      </strong>
    );

    lastBoldIndex = boldMatch.index + boldMatch[0].length;
  }

  // Add remaining text after last bold
  if (lastBoldIndex < content.length) {
    segments.push(...processLinks(content.slice(lastBoldIndex)));
  }

  return segments.length > 0 ? segments : content;
}
