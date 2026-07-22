import { readPcmHeadTail } from '../src/lib/tutor/voice/pcm-stream';

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
  // Source: 24000 samples with a recognizable ramp.
  const N = 24000;
  const src = Array.from({ length: N }, (_, i) => (i % 997) / 997);
  const bytes = f32Bytes(src);

  // Chunks deliberately split a Float32 mid-sample: 6 bytes + 7 bytes + rest.
  const chunks = [bytes.slice(0, 6), bytes.slice(6, 13), bytes.slice(13)];

  const HEAD = 9600; // 0.4s at 24kHz
  const r1 = await readPcmHeadTail(streamOf(chunks), HEAD);
  check('r1-nonnull', r1 !== null);
  if (r1) {
    check('head-length', r1.head.length === HEAD);
    const tail = await r1.tailPromise;
    check('tail-nonnull', tail !== null);
    check('tail-length', (tail?.length ?? 0) === N - HEAD);
    // head + tail byte-equal to source (misaligned boundaries carried right)
    let equal = true;
    for (let i = 0; i < HEAD; i++) if (r1.head[i] !== Math.fround(src[i])) { equal = false; break; }
    if (tail) for (let i = 0; i < tail.length && equal; i++) if (tail[i] !== Math.fround(src[HEAD + i])) equal = false;
    check('bytes-equal', equal);
  }

  // Empty stream → null
  const r2 = await readPcmHeadTail(streamOf([]), HEAD);
  check('empty-null', r2 === null);

  // Stream shorter than headSamples → whole audio in head, tail resolves null
  const short = f32Bytes(src.slice(0, 100));
  const r3 = await readPcmHeadTail(streamOf([short.slice(0, 33), short.slice(33)]), HEAD);
  check('short-nonnull', r3 !== null);
  if (r3) {
    check('short-head-100', r3.head.length === 100);
    check('short-tail-null', (await r3.tailPromise) === null);
  }

  // Exact head-size stream → full head, tail null
  const exact = f32Bytes(src.slice(0, HEAD));
  const r4 = await readPcmHeadTail(streamOf([exact]), HEAD);
  check('exact-head', r4 !== null && r4.head.length === HEAD);
  check('exact-tail-null', r4 !== null && (await r4.tailPromise) === null);

  // Reader error mid-tail → tailPromise RESOLVES (never rejects) with what
  // accumulated. Pull-based: chunks must be CONSUMED before the error fires
  // (error() discards anything still enqueued).
  const errSeq = [bytes.slice(0, HEAD * 4), bytes.slice(HEAD * 4, HEAD * 4 + 400)];
  let errI = 0;
  const errStream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (errI < errSeq.length) controller.enqueue(errSeq[errI++]);
      else controller.error(new Error('boom'));
    },
  });
  const r5 = await readPcmHeadTail(errStream, HEAD);
  check('err-head-ok', r5 !== null && r5.head.length === HEAD);
  const t5 = r5 ? await r5.tailPromise.catch(() => 'REJECTED' as const) : null;
  check('err-tail-resolves', t5 !== 'REJECTED');
  check('err-tail-partial', t5 !== null && t5 !== 'REJECTED' && (t5 as Float32Array).length === 100);

  // Error before head completes → head padded with what arrived (still non-null,
  // playable), tail null
  let earlyI = 0;
  const errEarly = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (earlyI++ === 0) controller.enqueue(bytes.slice(0, 400)); // 100 samples only
      else controller.error(new Error('boom'));
    },
  });
  const r6 = await readPcmHeadTail(errEarly, HEAD);
  check('err-early-head', r6 !== null && r6.head.length === 100);
  check('err-early-tail-null', r6 !== null && (await r6.tailPromise) === null);

  if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
  console.log('test:pcm-stream PASS');
}

main().catch((e) => { console.error(e); process.exit(1); });
