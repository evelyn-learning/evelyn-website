import { openPcmChunkStream } from '../src/lib/tutor/voice/pcm-stream';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

function streamOf(chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      if (i < chunks.length) controller.enqueue(chunks[i++]);
      else controller.close();
    },
  });
}

function f32Bytes(samples: number[]): Uint8Array {
  return new Uint8Array(new Float32Array(samples).buffer.slice(0));
}

async function main() {
  const N = 24000;
  const src = Array.from({ length: N }, (_, i) => (i % 997) / 997);
  const bytes = f32Bytes(src);
  const HEAD = 9600;   // 0.4s at 24kHz
  const CHUNK = 4800;  // 0.2s follow windows for the test

  // Network chunks deliberately split Float32s mid-sample: 6 + 7 bytes,
  // then the rest of the head, then a TRICKLING tail (1201-sample pieces,
  // misaligned by 3 bytes each) so the pump must window + carry.
  const netChunks = [bytes.slice(0, 6), bytes.slice(6, 13), bytes.slice(13, HEAD * 4)];
  for (let off = HEAD * 4; off < bytes.length; off += 1201 * 4 + 3) {
    netChunks.push(bytes.slice(off, Math.min(off + 1201 * 4 + 3, bytes.length)));
  }
  const s1 = await openPcmChunkStream(streamOf(netChunks), HEAD, CHUNK);
  check('s1-nonnull', s1 !== null);
  if (s1) {
    check('head-length', s1.head.length === HEAD);
    check('not-done', s1.done === false);
    const emitted: Float32Array[] = [];
    await s1.pump((c) => { emitted.push(c); });
    const total = emitted.reduce((n, c) => n + c.length, 0);
    check('tail-total', total === N - HEAD);
    // Trickling input → multiple window emits, each (except the last)
    // at least CHUNK samples.
    check('tail-chunked', emitted.length >= 2 && emitted.slice(0, -1).every((c) => c.length >= CHUNK));
    // head + emitted chunks reassemble the source exactly (f32-rounded)
    let equal = true;
    let idx = 0;
    const all = [s1.head, ...emitted];
    for (const c of all) for (let i = 0; i < c.length; i++, idx++) {
      if (c[i] !== Math.fround(src[idx])) { equal = false; break; }
    }
    check('bytes-equal', equal && idx === N);
  }

  // Empty stream → null
  check('empty-null', (await openPcmChunkStream(streamOf([]), HEAD, CHUNK)) === null);

  // Stream shorter than head → whole audio in head, done=true, pump no-op
  const short = f32Bytes(src.slice(0, 100));
  const s2 = await openPcmChunkStream(streamOf([short.slice(0, 33), short.slice(33)]), HEAD, CHUNK);
  check('short-head-100', s2 !== null && s2.head.length === 100 && s2.done === true);
  if (s2) {
    let called = 0;
    await s2.pump(() => { called++; });
    check('short-pump-noop', called === 0);
  }

  // emit returning false aborts the pump (kill path)
  const s3 = await openPcmChunkStream(streamOf([bytes]), HEAD, CHUNK);
  if (s3) {
    let calls = 0;
    await s3.pump(() => { calls++; return false; });
    check('abort-after-first', calls === 1);
  }

  // Reader error mid-tail → pump RESOLVES with what arrived (never rejects)
  const errSeq = [bytes.slice(0, HEAD * 4), bytes.slice(HEAD * 4, HEAD * 4 + 400)];
  let errI = 0;
  const errStream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (errI < errSeq.length) controller.enqueue(errSeq[errI++]);
      else controller.error(new Error('boom'));
    },
  });
  const s4 = await openPcmChunkStream(errStream, HEAD, CHUNK);
  check('err-head-ok', s4 !== null && s4.head.length === HEAD);
  if (s4) {
    const got: Float32Array[] = [];
    const r = await s4.pump((c) => { got.push(c); }).catch(() => 'REJECTED' as const);
    check('err-pump-resolves', r !== 'REJECTED');
    check('err-partial-100', got.reduce((n, c) => n + c.length, 0) === 100);
  }

  // Error before head completes → head has what arrived, done=true
  let earlyI = 0;
  const errEarly = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (earlyI++ === 0) controller.enqueue(bytes.slice(0, 400));
      else controller.error(new Error('boom'));
    },
  });
  const s5 = await openPcmChunkStream(errEarly, HEAD, CHUNK);
  check('err-early-head', s5 !== null && s5.head.length === 100 && s5.done === true);

  if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
  console.log('test:pcm-stream PASS');
}

main().catch((e) => { console.error(e); process.exit(1); });
