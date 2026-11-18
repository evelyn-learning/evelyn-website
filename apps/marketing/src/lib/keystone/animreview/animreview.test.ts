// Owner review of animated solutions: the parts with no database (paths, crop, limits, input checks).
import assert from "node:assert/strict";
import path from "node:path";
import { tmpdir } from "node:os";

process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-anim-pure");

(async () => {
  const p = await import("./pure");
  const f = await import("./files");
  const root = path.join(tmpdir(), "ks-anim-pure");

  // path safety: files of a version stay inside its folder
  assert.equal(f.animatedFile("234035", 2, "solution.html"), path.join(root, "assets", "234035", "animated", "v2", "solution.html"));
  assert.equal(f.animatedFile("234035", 2, "audio/step-1.mp3"), path.join(root, "assets", "234035", "animated", "v2", "audio", "step-1.mp3"));
  assert.equal(f.animatedFile("234035", 2, "../v1/solution.html"), null, "no step to a sibling version");
  assert.equal(f.animatedFile("234035", 2, "../../player/solution.html"), null, "no step to the legacy player");
  assert.equal(f.animatedFile("234035", 2, "/etc/passwd"), null, "absolute path refused");
  assert.equal(f.animatedFile("234035", 2, ""), null, "the folder itself is not a file");
  assert.equal(f.animatedFile("../x", 2, "solution.html"), null, "item id must be numeric");
  assert.equal(f.animatedFile("234035", 0, "solution.html"), null, "version from 1");
  assert.equal(f.shotFile("0123456789abcdef01234567", "1.png"), path.join(root, "animflags", "0123456789abcdef01234567", "1.png"));
  assert.equal(f.shotFile("0123456789abcdef01234567", "../1.png"), null);
  assert.equal(f.shotFile("0123456789abcdef01234567", "0.png"), null);
  assert.equal(f.shotFile("../../etc", "1.png"), null);

  assert.equal(p.parseVersion("3"), 3);
  assert.equal(p.parseVersion("v3"), 3);
  for (const bad of ["0", "-1", "1.5", "x", "", undefined, "99999"]) assert.equal(p.parseVersion(bad), null, `parseVersion(${bad})`);
  assert.equal(p.animatedUrl("234035", 2), "/api/keystone/animated/234035/2/solution.html");

  // who sees a version
  assert.ok(p.canSeeAnimation("evelyn", "review"));
  assert.ok(p.canSeeAnimation("evelyn", undefined));
  assert.ok(!p.canSeeAnimation("reviewer", "review"));
  assert.ok(!p.canSeeAnimation("tech", "accepted"));
  assert.ok(!p.canSeeAnimation("reviewer", undefined));
  assert.ok(p.canSeeAnimation("reviewer", "released"));
  assert.ok(!p.canSeeAnimation(undefined, "review"));

  // crop: viewport 1000×800 CSS px captured at 2000×1600 (retina)
  assert.deepEqual(p.cropRect({ left: 100, top: 50, width: 400, height: 300 }, { width: 1000, height: 800 }, { width: 2000, height: 1600 }), { sx: 200, sy: 100, sw: 800, sh: 600 });
  // partly scrolled off the top and the right: clamped to the frame
  assert.deepEqual(p.cropRect({ left: 900, top: -100, width: 400, height: 300 }, { width: 1000, height: 800 }, { width: 1000, height: 800 }), { sx: 900, sy: 0, sw: 100, sh: 200 });
  // capture at a different aspect (the sharing bar took some height): each axis scales by itself
  assert.deepEqual(p.cropRect({ left: 0, top: 0, width: 500, height: 400 }, { width: 1000, height: 800 }, { width: 1000, height: 760 }), { sx: 0, sy: 0, sw: 500, sh: 380 });
  assert.equal(p.cropRect({ left: 0, top: 900, width: 500, height: 400 }, { width: 1000, height: 800 }, { width: 1000, height: 800 }), null, "off screen");
  assert.equal(p.cropRect({ left: 0, top: 0, width: 5, height: 5 }, { width: 0, height: 800 }, { width: 1000, height: 800 }), null, "no viewport");

  // pictures
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]);
  assert.ok(p.isPng(png));
  assert.ok(!p.isPng(new Uint8Array([0xff, 0xd8, 0xff, 0, 0, 0, 0, 0, 0])));
  assert.equal(p.shotsProblem([png, png]), null);
  assert.match(p.shotsProblem([new Uint8Array(10)]) ?? "", /PNG/);
  assert.match(p.shotsProblem([png], 8) ?? "", /At most 8/);
  assert.match(p.shotsProblem(Array(9).fill(png)) ?? "", /At most 8/);
  const big = new Uint8Array(p.MAX_SHOT_BYTES + 1);
  big.set(png);
  assert.match(p.shotsProblem([big]) ?? "", /4 MB/);

  // positions and comments
  assert.equal(p.cleanPosition("3"), 3);
  assert.equal(p.cleanPosition("2.7"), 2);
  assert.equal(p.cleanPosition(""), null);
  assert.equal(p.cleanPosition("-1"), null);
  assert.equal(p.cleanPosition("abc"), null);
  assert.equal(p.cleanComment("  a\r\nb  "), "a\nb");
  assert.equal(p.cleanComment("x".repeat(5000)).length, p.MAX_COMMENT);
  assert.equal(p.clock(65_400), "1:05");
  assert.equal(p.clock(null), "–");
  assert.equal(p.where(1, 2), "Step 2 · line 3");
  assert.equal(p.where(null, null), "Step unknown");

  // --reply arguments
  const id = "0123456789abcdef01234567";
  assert.deepEqual(p.parseReplies([`${id}=Moved the arrow = to the left`]), { replies: { [id]: "Moved the arrow = to the left" }, errors: [] });
  assert.equal(p.parseReplies(["nope=text"]).errors.length, 1);
  assert.equal(p.parseReplies(["text only"]).errors.length, 1);

  console.log("animreview.test: ok");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
