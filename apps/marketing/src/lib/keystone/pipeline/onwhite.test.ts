// npx tsx src/lib/keystone/pipeline/onwhite.test.ts
// A graph drawn in black on a transparent background reaches the solvers on white (one solver saw such graphs as
// black rectangles: 139736, 140811). An opaque image is sent byte for byte as it was.
import assert from "node:assert/strict";
import sharp from "sharp";
import { onWhite } from "./run";

async function main() {
  // 20×20, fully transparent except a black 4×4 square in the middle.
  const raw = Buffer.alloc(20 * 20 * 4, 0);
  for (let y = 8; y < 12; y++) for (let x = 8; x < 12; x++) raw.writeUInt32BE(0x000000ff, (y * 20 + x) * 4);
  const png = new Uint8Array(await sharp(raw, { raw: { width: 20, height: 20, channels: 4 } }).png().toBuffer());

  const out = await onWhite(png, "image/png");
  const meta = await sharp(out).metadata();
  assert.equal(meta.format, "png");
  assert.equal(meta.hasAlpha, false, "flattened: no alpha left");
  const px = await sharp(out).raw().toBuffer();
  assert.deepEqual([...px.subarray(0, 3)], [255, 255, 255], "the transparent corner is white, not black");
  const mid = (10 * 20 + 10) * 3;
  assert.deepEqual([...px.subarray(mid, mid + 3)], [0, 0, 0], "the drawing stays black");

  const opaque = new Uint8Array(await sharp({ create: { width: 4, height: 4, channels: 3, background: "#336699" } }).png().toBuffer());
  assert.equal(await onWhite(opaque, "image/png"), opaque, "an opaque PNG is sent unchanged");
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0x00]);
  assert.equal(await onWhite(jpeg, "image/jpeg"), jpeg, "a JPEG is never touched");
  const junk = new Uint8Array([1, 2]);
  assert.equal(await onWhite(junk, "image/png"), junk, "bytes that do not decode are passed on unchanged");
  console.log("onwhite: ok");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
