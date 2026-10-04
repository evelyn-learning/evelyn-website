// scripts/test-resume-listen.ts
// Run: npx tsx scripts/test-resume-listen.ts
import { strict as assert } from 'node:assert';
import { shouldStartListeningOnSessionStart } from '../src/lib/tutor/session/resume-listen';

// Voice session, mic not muted ⇒ the resume gesture opens the recorder,
// exactly like the normal Start tap.
assert.deepEqual(
  shouldStartListeningOnSessionStart({ enabled: true, sessionMode: 'voice', micMuted: false }),
  { start: true, reason: 'ok' },
);

// Muted before resuming ⇒ honour the mute; the unmute path opens the mic.
assert.deepEqual(
  shouldStartListeningOnSessionStart({ enabled: true, sessionMode: 'voice', micMuted: true }),
  { start: false, reason: 'muted' },
);

// Text mode must never touch the mic — and that wins over everything else.
assert.deepEqual(
  shouldStartListeningOnSessionStart({ enabled: true, sessionMode: 'text', micMuted: false }),
  { start: false, reason: 'text-mode' },
);
assert.deepEqual(
  shouldStartListeningOnSessionStart({ enabled: true, sessionMode: 'text', micMuted: true }),
  { start: false, reason: 'text-mode' },
);

// Kill switch off ⇒ the pre-fix behaviour (resume never opens the recorder).
assert.deepEqual(
  shouldStartListeningOnSessionStart({ enabled: false, sessionMode: 'voice', micMuted: false }),
  { start: false, reason: 'flag-off' },
);

console.log('resume-listen: 5 cases passed');
