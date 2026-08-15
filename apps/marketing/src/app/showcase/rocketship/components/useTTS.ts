import { useState, useRef, useCallback } from 'react';

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  const speak = useCallback(async (text: string, id?: string) => {
    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }

    // If same id clicked again, just stop
    if (id && id === speakingId) {
      setIsSpeaking(false);
      setSpeakingId(null);
      return;
    }

    setIsSpeaking(true);
    setSpeakingId(id || null);

    try {
      const response = await fetch('/api/showcase/rocketship/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`TTS failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      urlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        setSpeakingId(null);
        URL.revokeObjectURL(url);
        urlRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setSpeakingId(null);
        URL.revokeObjectURL(url);
        urlRef.current = null;
      };

      await audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
      setSpeakingId(null);
    }
  }, [speakingId]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setIsSpeaking(false);
    setSpeakingId(null);
  }, []);

  return { speak, stop, isSpeaking, speakingId };
}
