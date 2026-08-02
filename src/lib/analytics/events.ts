/**
 * GA4 custom-event helper for the demo funnel. gtag is defined globally by
 * the GoogleAnalytics inline script (src/components/analytics); absent (env
 * unset, blocked, SSR) this is a silent no-op — analytics must never break
 * the app.
 */

export type DemoEventName =
  | 'demo_start_click'
  | 'tutor_session_started'
  | 'lesson_selected'
  | 'teacher_changed'
  | 'demo_expand_fullscreen';

export function trackEvent(
  name: DemoEventName,
  params?: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  try {
    w.gtag?.('event', name, params ?? {});
  } catch {
    // swallow — see module doc
  }
}
