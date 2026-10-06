'use client';

import { useSyncExternalStore } from 'react';
import { formatInstant, type InstantKind } from '@/lib/tutor/format-instant';

const subscribeNever = () => () => {};

/**
 * A time shown in the VIEWER's zone, safe to server-render.
 *
 * The server does not know the viewer's zone (formatting there showed the
 * server's, unlabelled). So: the server render and the hydration pass print
 * the instant in UTC, labelled " UTC" — identical on both sides, no hydration
 * mismatch — and the first client render after hydration prints the viewer's
 * local time. A component mounted on the client only (no server HTML) prints
 * local time straight away.
 */
export function LocalTime({
  iso,
  kind,
  className,
}: {
  iso: string | number | Date | null | undefined;
  kind: InstantKind;
  className?: string;
}) {
  // false on the server and while hydrating; true on every later client render.
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const text = formatInstant(iso, kind, hydrated ? undefined : 'UTC');
  if (!text) return null;
  const machine = iso instanceof Date ? iso.toISOString() : typeof iso === 'number' ? new Date(iso).toISOString() : String(iso);
  return (
    <time dateTime={machine} className={className} suppressHydrationWarning>
      {text}
    </time>
  );
}
