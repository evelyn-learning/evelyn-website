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
  | 'demo_expand_fullscreen'
  // R39: fullscreen link removed from the live-demo header; these two track the
  // event-driven return path that replaced the always-visible header links.
  | 'demo_session_ended'
  | 'demo_change_lesson_after_end'
  // Demo gate (2026-08-29): a start attempt denied by the quota gate (429).
  | 'demo_limited';

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
