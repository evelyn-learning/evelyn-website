import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UseStreamChatOptions {
  endpoint: string;
  extraBody?: Record<string, unknown>;
  onComplete?: (fullText: string) => void;
}

export function useStreamChat({ endpoint, extraBody = {}, onComplete }: UseStreamChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (isStreaming) return;
      setError(null);

      const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
      setMessages([...newMessages, { role: 'assistant', content: '' }]);
      setIsStreaming(true);

      abortRef.current = new AbortController();
      let fullText = '';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages, ...extraBody }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const payload = JSON.parse(line.slice(6));
              if (payload.type === 'chunk') {
                fullText += payload.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'assistant', content: fullText };
                  return updated;
                });
              } else if (payload.type === 'error') {
                setError(payload.content);
              }
            } catch {
              // skip malformed lines
            }
          }
        }

        onComplete?.(fullText);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Failed to get response. Please try again.');
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, isStreaming, endpoint, extraBody, onComplete]
  );

  const resetChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, error, sendMessage, resetChat, setMessages };
}
