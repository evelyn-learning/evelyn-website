/**
 * Browser side of the integration: puts the session page in an iframe and hands its events to your callbacks.
 * No secret and no crypto here. The session URL comes from your server (see `EvelynTutor.sessionUrl`).
 */

/** `evelyn:session_started`: the student started the session. */
export interface SessionStartedData {
  session_id: string;
  started_at_ms?: number;
}

/** `evelyn:progress`: the lesson moved to another segment. */
export interface SessionProgressData {
  session_id: string;
  lesson_progress: {
    lessonPlanId: string;
    segments: unknown[];
    currentSegmentId: string;
    completedSegmentIds: string[];
    currentSegmentLabel?: string;
    percent?: number;
  };
  practice?: unknown;
}

/** `evelyn:session_ended`: the student ended the session, or its time cap did. */
export interface SessionEndedData {
  session_id: string;
  /** Active seconds across the session, including earlier sittings of a resumed session. */
  duration: number;
  message_count: number;
  whiteboard_items: number;
  milestone?: string;
  ended_reason?: 'time_limit' | 'finished' | 'minutes_exhausted' | 'no_input' | 'idle' | 'paused';
  end_intent?: 'finish' | 'discard';
  lesson_progress?: SessionProgressData['lesson_progress'];
}

/** Any message the session page posts: `{ type: "evelyn:…", … }`. */
export interface TutorMessage {
  type: string;
  [field: string]: unknown;
}

/** What to mount and which events to hear. */
export interface MountTutorOptions {
  /** The session URL your server made. */
  sessionUrl: string;
  /** The iframe's accessible name. Default `"Tutor"`. */
  title?: string;
  /** The student started the session. */
  onStarted?: (data: SessionStartedData) => void;
  /** The lesson moved to another segment. */
  onProgress?: (data: SessionProgressData) => void;
  /** The session ended. Read `duration` and `ended_reason` here. */
  onEnded?: (data: SessionEndedData) => void;
  /** Every `evelyn:*` message, the three above included (for example `evelyn:start_blocked`, `evelyn:clock`). */
  onEvent?: (message: TutorMessage) => void;
}

/** A mounted session. */
export interface MountedTutor {
  iframe: HTMLIFrameElement;
  /** Removes the iframe and stops listening. */
  destroy(): void;
}

/**
 * Mounts the session in `container` and wires its events. The iframe fills the container, so give the
 * container a height. Messages are accepted only from this iframe and only from the session page's origin.
 */
export function mountTutor(container: HTMLElement, options: MountTutorOptions): MountedTutor {
  const origin = new URL(options.sessionUrl).origin;
  const view = container.ownerDocument.defaultView;
  if (!view) throw new Error('mountTutor needs a container that is part of a window document.');

  const iframe = container.ownerDocument.createElement('iframe');
  iframe.src = options.sessionUrl;
  iframe.title = options.title ?? 'Tutor';
  iframe.allow = 'microphone; camera; autoplay; clipboard-write';
  iframe.allowFullscreen = true;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0';

  const onMessage = (event: MessageEvent): void => {
    if (event.origin !== origin || event.source !== iframe.contentWindow) return;
    const message = event.data as TutorMessage | null;
    if (!message || typeof message !== 'object' || typeof message.type !== 'string' || !message.type.startsWith('evelyn:')) return;
    options.onEvent?.(message);
    if (message.type === 'evelyn:session_started') options.onStarted?.(message.data as SessionStartedData);
    else if (message.type === 'evelyn:progress') options.onProgress?.(message.data as SessionProgressData);
    else if (message.type === 'evelyn:session_ended') options.onEnded?.(message.data as SessionEndedData);
  };

  view.addEventListener('message', onMessage);
  container.appendChild(iframe);
  return {
    iframe,
    destroy() {
      view.removeEventListener('message', onMessage);
      iframe.remove();
    },
  };
}
