/**
 * Audio-finalize decision (2026-08-17 triage): the session-audio route's
 * finalize branch used to write {role}.meta.json and $set hasAudio:true
 * even when ZERO chunks had ever arrived — dead sessions (portal-96a436f0,
 * portal-a4f7499d, portal-d2b9a6ce) all showed hasAudio:true with no PCM
 * on disk (the admin "audio-flag-drift" warning). The rule: no bytes, no
 * flag, no meta.
 */
import './lib/no-db-env';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  resolveAudioFinalize,
  shouldCreateAudioDir,
  shouldSendTrackFinalize,
} from '../src/lib/tutor/recordings/finalize-audio';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures++;
    console.error(`  ✗ ${name}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  } else {
    console.log(`  ✓ ${name}`);
  }
}

console.log('resolveAudioFinalize');
check(
  'no pcm file → no meta, no hasAudio (the empty-beacon drift bug)',
  resolveAudioFinalize({ pcmBytes: null }),
  { writeMeta: false, markHasAudio: false },
);
check(
  'zero-byte pcm file → no meta, no hasAudio',
  resolveAudioFinalize({ pcmBytes: 0 }),
  { writeMeta: false, markHasAudio: false },
);
check(
  'real audio → meta + hasAudio',
  resolveAudioFinalize({ pcmBytes: 16_781_296 }),
  { writeMeta: true, markHasAudio: true },
);
check(
  'even a single sample counts as real audio',
  resolveAudioFinalize({ pcmBytes: 2 }),
  { writeMeta: true, markHasAudio: true },
);

// 2026-10-09 (local end-to-end run): a TEXT session records neither track,
// yet End still sent one finalize signal per track and the route's
// unconditional mkdir left an empty `<TUTOR_AUDIO_DIR>/<sessionId>/` behind.
console.log('shouldSendTrackFinalize (client)');
check('no chunk ever uploaded for the track → no finalize request', shouldSendTrackFinalize({ chunksSent: 0 }), false);
check('one chunk uploaded → finalize', shouldSendTrackFinalize({ chunksSent: 1 }), true);
check('many chunks uploaded → finalize', shouldSendTrackFinalize({ chunksSent: 42 }), true);
check('garbage counter → no finalize', shouldSendTrackFinalize({ chunksSent: Number.NaN }), false);

console.log('shouldCreateAudioDir (route)');
check('finalize signal never creates the directory', shouldCreateAudioDir({ finalize: true, bodyBytes: 0 }), false);
check('finalize signal with a stray body still does not', shouldCreateAudioDir({ finalize: true, bodyBytes: 9600 }), false);
check('empty chunk does not', shouldCreateAudioDir({ finalize: false, bodyBytes: 0 }), false);
check('a real chunk does', shouldCreateAudioDir({ finalize: false, bodyBytes: 2 }), true);

// The route itself, driven without a server. Only paths that never reach the
// database: finalize with nothing on disk, an empty chunk, and a real chunk
// at chunkIndex 5 (hasAudio is only $set for index < 2 or a multiple of 10).
async function routeChecks() {
  const audioDir = fs.mkdtempSync(path.join(os.tmpdir(), 'session-audio-test-'));
  process.env.TUTOR_AUDIO_DIR = audioDir;
  try {
    const { NextRequest } = await import('next/server');
    const { POST } = await import('../src/app/api/tutor/session-audio/route');
    const post = async (qs: string, body: Uint8Array) => {
      const res = await POST(new NextRequest(`http://localhost/api/tutor/session-audio?${qs}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: Buffer.from(body),
      }));
      return { status: res.status, json: await res.json() };
    };
    const dir = path.join(audioDir, 'sess-1');
    const empty = new Uint8Array(0);

    console.log('session-audio route — requests with no audio bytes');
    for (const role of ['student', 'tutor']) {
      const r = await post(`sessionId=sess-1&role=${role}&chunkIndex=0&finalize=true`, empty);
      check(`${role} finalize with nothing on disk → 200 no-op`, r, { status: 200, json: { success: true, finalized: false, empty: true } });
    }
    check('…and no session directory was created', fs.existsSync(dir), false);
    const skipped = await post('sessionId=sess-1&role=student&chunkIndex=0&finalize=false', empty);
    check('empty chunk → 200 skipped', skipped, { status: 200, json: { success: true, skipped: true } });
    check('…and still no session directory', fs.existsSync(dir), false);
    check('audio base dir is left empty', fs.readdirSync(audioDir), []);

    console.log('session-audio route — a later real chunk');
    const real = await post('sessionId=sess-1&role=student&chunkIndex=5&finalize=false', new Uint8Array([1, 2, 3, 4]));
    check('real chunk → 200 with bytesWritten', real, { status: 200, json: { success: true, chunkIndex: 5, bytesWritten: 4 } });
    check('…creates the directory and the pcm file', fs.statSync(path.join(dir, 'student.pcm16')).size, 4);
    check('the silent track still has no file', fs.existsSync(path.join(dir, 'tutor.pcm16')), false);
    check('…and no sidecar', fs.existsSync(path.join(dir, 'tutor.meta.json')), false);
  } finally {
    fs.rmSync(audioDir, { recursive: true, force: true });
  }
}

routeChecks().then(() => {
  if (failures > 0) {
    console.error(`\n${failures} failure(s)`);
    process.exit(1);
  }
  console.log('\nAll finalize-audio checks passed.');
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
