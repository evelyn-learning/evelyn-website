// Animated solutions: the headless check of one built folder (solution.html + audio/), behind a function that
// says "not available" when Playwright or its browser is missing instead of failing. Used by the laptop script
// (scripts/keystone-animated-verify.ts) and the server build (serverbuild.ts).
// At 360×740, 768×1024 and 1024×768 it loads the page from a local server and checks: the fresh state (nothing
// derived on the board), Reset and the board buttons before play, a full Play through every step (paused once per
// step for a picture), the finished board against the same board built silently (catch-up), Listen on step 3 then
// step 1, Pause/Resume, Reset during play, the practice task, the taps (transcript, folds, equation lines,
// choices, sliders), no console error, no request other than the page and its clips, no horizontal scroll, and
// that the board and the caption never move. Pictures go to <outDir>/shots/. No network beyond 127.0.0.1.
// Playwright is imported only when the check runs (a dynamic import): the module loads without it.
import { createReadStream, existsSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import http from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";
import type { BrowserType, Page } from "playwright";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Cue = { do: string; id?: string | string[] };
type Data = {
  steps: { title: string; lines: { say: string; len: number; cues: Cue[] }[] }[];
  board: { fresh: Cue[]; readoutFresh: string; readoutPractice: string; readoutEnd?: string; buttons?: { label: string }[] };
  practice: { kind: string; drag?: string; snap?: [number, number]; tolerance?: number; chips?: { id: string; slot: string }[]; doneText?: string; missText?: string };
};
type State = { step: number; line: number; timeMs: number; playing: boolean; paused: boolean; practice: string; played: boolean; clock: string | null };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const TYPES: Record<string, string> = { ".html": "text/html; charset=utf-8", ".mp3": "audio/mpeg", ".json": "application/json", ".png": "image/png" };

function serve(dir: string): Promise<{ url: string; close: () => void }> {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent((req.url ?? "/").split("?")[0]);
    const file = path.join(dir, rel);
    if (!file.startsWith(dir) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404).end();
      return;
    }
    const size = statSync(file).size;
    const type = TYPES[path.extname(file)] ?? "application/octet-stream";
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "");
    if (m && (m[1] || m[2])) {
      const start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
      const end = m[1] && m[2] ? Math.min(size - 1, Number(m[2])) : size - 1;
      res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1, "Accept-Ranges": "bytes" });
      createReadStream(file, { start, end }).pipe(res);
      return;
    }
    res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ url: `http://127.0.0.1:${(server.address() as AddressInfo).port}`, close: () => server.close() })));
}

/** The board as a comparable value: every element with an id (classes that are only passing effects left out), the ink, the element count. */
const signature = (page: Page) =>
  page.evaluate(() => {
    const svg = document.querySelector("#es-board svg")!;
    const passing = ["es-go", "es-pulse", "es-held", "es-drag", "es-chip"];
    const out: Record<string, string> = { "(elements)": String(svg.querySelectorAll("*").length) };
    svg.querySelectorAll("[id]").forEach((el) => {
      const cls = (el.getAttribute("class") ?? "").split(/\s+/).filter((c) => c && !passing.includes(c)).sort().join(" ");
      out[el.id] = `${cls} | ${el.getAttribute("transform") ?? ""}`;
    });
    out["(ink)"] = [...document.querySelectorAll("#es-ink .es-ink-line:not(.es-wither)")].map((d) => d.textContent).join(" / ");
    return out;
  });
const diff = (a: Record<string, string>, b: Record<string, string>) =>
  [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => a[k] !== b[k]).map((k) => `${k}: "${a[k]}" vs "${b[k]}"`);

const state = (page: Page) => page.evaluate(() => (window as any).esPlayer.state() as State);
const rects = (page: Page) =>
  page.evaluate(() => {
    window.scrollTo(0, 0);
    const r = (id: string) => {
      const b = document.getElementById(id)!.getBoundingClientRect();
      return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)].join(",");
    };
    return { board: r("es-board"), live: r("es-live"), pause: r("es-pause"), play: r("es-play") };
  });
const noSideScroll = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
/** A point on the element (or one of its shapes) that a press would land on. */
const grabPoint = (page: Page, id: string) =>
  page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    el.scrollIntoView({ block: "center" });
    for (const k of [el, ...el.querySelectorAll("*")]) {
      const r = k.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      for (const [fx, fy] of [[0.5, 0.5], [0.5, 0.25], [0.5, 0.75], [0.25, 0.5], [0.75, 0.5]]) {
        const x = r.left + r.width * fx, y = r.top + r.height * fy;
        const hit = document.elementFromPoint(x, y);
        if (hit && el.contains(hit)) return { x, y };
      }
    }
    return null;
  }, id);
async function dragBy(page: Page, from: { x: number; y: number }, dx: number, dy: number) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(from.x + (dx * i) / 8, from.y + (dy * i) / 8);
  await page.mouse.up();
}

async function checkWidth(chromium: BrowserType, base: string, outDir: string, data: Data, width: number, height: number, speed: number, hasClips: boolean, log: (line: string) => void): Promise<string[]> {
  const fails: string[] = [];
  const notes: string[] = [];
  const fail = (m: string) => fails.push(`${width}px: ${m}`);
  const expect = (cond: unknown, m: string) => {
    if (!cond) fail(m);
  };
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, hasTouch: width < 600 });
  const page = await ctx.newPage();
  const requests: string[] = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    if (!hasClips && /Failed to load resource/.test(m.text()) && /\/audio\/step-\d+\.mp3$/.test(m.location().url)) return; // a clip not recorded yet
    fail(`console error: ${m.text()}`);
  });
  page.on("pageerror", (e) => fail(`page error: ${e.message}`));
  page.on("request", (r) => requests.push(r.url()));
  page.on("requestfailed", (r) => {
    if (!/ERR_ABORTED/.test(r.failure()?.errorText ?? "")) fail(`request failed: ${r.url()} ${r.failure()?.errorText ?? ""}`);
  });
  await page.addInitScript("window.__name = function (f) { return f; };"); // the TypeScript runner wraps named functions passed to the page in this helper
  await page.addInitScript((speed) => {
    (window as any).esSpeed = speed;
    (window as any).esEvents = [];
    window.addEventListener("message", (e) => {
      if (e.data && e.data.type === "es-player") (window as any).esEvents.push(e.data);
    });
  }, speed);
  const shot = async (name: string) => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(outDir, "shots", `w${width}-${name}.png`), fullPage: true });
  };
  const n = data.steps.length;
  const endText = data.board.readoutEnd ?? 'Press "Reset board" to try it yourself.';
  const readout = () => page.evaluate(() => document.getElementById("es-readout")!.textContent ?? "");
  const stepTimeout = (k: number) => (data.steps[k].lines.reduce((a, l) => a + l.len, 0) * 60 * 3) / speed + 20000;

  try {
    await page.goto(`${base}/solution.html`);
    await page.waitForFunction(() => !!(window as any).esPlayer, null, { timeout: 10000 });

    // --- fresh ---
    const s0 = await state(page);
    expect(s0.step === -1 && !s0.playing && !s0.played && s0.practice === "off", `fresh: unexpected state ${JSON.stringify(s0)}`);
    expect((await readout()) === data.board.readoutFresh, "fresh: the readout is not readoutFresh");
    const fresh = await page.evaluate(() => ({
      ink: document.querySelectorAll("#es-ink .es-ink-line").length,
      shownOff: [...document.querySelectorAll("#es-board svg .es-off")].filter((e) => getComputedStyle(e).opacity !== "0").map((e) => e.id || e.tagName),
      visible: [...document.querySelectorAll("#es-board svg [id]")].filter((e) => !e.closest(".es-off") && !e.closest("defs")).map((e) => e.id),
      details: document.querySelectorAll("details").length,
      pauseDisabled: (document.getElementById("es-pause") as HTMLButtonElement).disabled,
      footer: document.querySelector(".es-footer")?.textContent ?? "",
    }));
    expect(fresh.ink === 0, "fresh: the ink strip is not empty");
    expect(fresh.shownOff.length === 0, `fresh: hidden layers are visible: ${fresh.shownOff.join(", ")}`);
    expect(fresh.pauseDisabled, "fresh: Pause should be disabled");
    expect(fresh.footer.includes("© 2026 Evelyn Learning"), "the footer is missing");
    const freshShown = new Set(data.board.fresh.filter((c) => c.do === "show" || c.do === "draw").flatMap((c) => (Array.isArray(c.id) ? c.id : c.id ? [c.id] : [])));
    const revealed = new Set(data.steps.flatMap((s) => s.lines.flatMap((l) => l.cues.filter((c) => c.do === "show" || c.do === "draw").flatMap((c) => (Array.isArray(c.id) ? c.id : c.id ? [c.id] : [])))));
    const early = fresh.visible.filter((id) => revealed.has(id) && !freshShown.has(id));
    if (early.length) notes.push(`fresh: these layers are revealed by a cue but are already visible before play (is something derived showing early?): ${early.join(", ")}`);
    expect(await noSideScroll(page), "fresh: the page scrolls sideways");
    const layout = await page.evaluate(() => {
      const p = document.querySelector(".es-player")!.getBoundingClientRect(), c = document.querySelector(".es-content")!.getBoundingClientRect();
      return { beside: p.right <= c.left + 1, above: p.bottom <= c.top + 1, boardW: document.getElementById("es-board")!.getBoundingClientRect().width };
    });
    if (width >= 600) expect(layout.beside, "layout: at this width the board should sit to the left of the steps");
    else expect(layout.above, "layout: at phone width the board should sit above the steps");
    expect(layout.boardW >= 230, `layout: the board is only ${Math.round(layout.boardW)} px wide`);
    const r0 = await rects(page);
    const sigFresh = await signature(page);
    await shot("00-fresh");

    // --- Reset and board buttons before play: still Fresh afterwards ---
    await page.click("#es-reset");
    expect(diff(sigFresh, await signature(page)).length === 0, "Reset before play does not give the fresh board");
    for (let i = 0; i < (data.board.buttons ?? []).length; i++) {
      await page.click(`.es-boardbar [data-button="${i}"]`);
      await sleep(9000 / speed + 900);
      const d = diff(sigFresh, await signature(page));
      expect(d.length === 0, `board button "${data.board.buttons![i].label}" does not return the board to rest (end its action with api.rest()): ${d.join("; ")}`);
      expect((await state(page)).practice === "off", "a board button before play must leave the Fresh state");
    }

    // --- Play: every step to the end, one pause (and picture) per step during its last line ---
    await page.evaluate(() => ((window as any).esEvents.length = 0));
    await page.click("#es-play");
    for (let k = 0; k < n; k++) {
      const last = data.steps[k].lines.length - 1;
      await page.waitForFunction(
        ([k, last]) => {
          const p = (window as any).esPlayer, s = p.state();
          if (s.step === k && s.line === last) { p.pause(); return true; }
          return s.step > k || (s.step === -1 && s.played && k > 0 && (window as any).esEvents.some((e: any) => e.event === "end"));
        },
        [k, last] as const,
        { timeout: stepTimeout(k), polling: 10 },
      );
      const s = await state(page);
      if (!(s.step === k && s.paused)) {
        fail(`play: step ${k + 1} went by before its last line could be caught (state ${JSON.stringify(s)})`);
        continue;
      }
      if (hasClips) expect(s.clock === "audio", `play: step ${k + 1} did not play its clip (clock ${s.clock})`);
      await sleep(1700);
      const marks = await page.evaluate((k) => {
        const lis = [...document.querySelectorAll(".es-step")];
        const prev = k > 0 ? (lis[k - 1].querySelector(".es-body") as HTMLElement).getBoundingClientRect().height : -1;
        return {
          now: lis.findIndex((li) => li.classList.contains("es-now")),
          open: !lis[k].classList.contains("es-closed"),
          earlierClosed: lis.slice(0, Math.max(0, k - 1)).every((li) => li.classList.contains("es-closed")),
          said: lis[k].querySelectorAll(".es-said").length,
          pauseText: document.getElementById("es-pause")!.textContent,
          live: document.getElementById("es-live-text")!.textContent,
          prev,
        };
      }, k);
      expect(marks.now === k, `play: step ${k + 1} is not marked as the current step`);
      expect(marks.open, `play: step ${k + 1} is not open while it is spoken`);
      expect(marks.earlierClosed, `play: steps before step ${k} should be folded`);
      expect(marks.said === 1, `play: step ${k + 1} should highlight exactly one caption sentence (${marks.said})`);
      expect(marks.live === data.steps[k].lines[last].say, `play: the live caption does not show step ${k + 1}'s last line`);
      expect(marks.pauseText === "Resume", "pause: the button should read Resume");
      const t1 = (await state(page)).timeMs;
      await sleep(250);
      expect((await state(page)).timeMs === t1, "pause: the clock keeps running while paused");
      if (k > 0) {
        const h2 = await page.evaluate((k) => (document.querySelectorAll(".es-step")[k - 1].querySelector(".es-body") as HTMLElement).getBoundingClientRect().height, k);
        expect(Math.abs(h2 - marks.prev) < 0.5, "pause: the previous step keeps folding while paused");
      }
      const r = await rects(page);
      expect(r.board === r0.board && r.live === r0.live, `play: the board or the caption moved or changed size at step ${k + 1} (board ${r0.board} → ${r.board}; caption ${r0.live} → ${r.live})`);
      expect(r.pause === r0.pause && r.play === r0.play, `pause: the button row changed (${r0.pause} → ${r.pause})`);
      expect(await noSideScroll(page), `play: the page scrolls sideways at step ${k + 1}`);
      await shot(`${String(k + 1).padStart(2, "0")}-step-${k + 1}`);
      await page.evaluate(() => (window as any).esPlayer.resume());
      expect((await page.evaluate(() => document.getElementById("es-pause")!.textContent)) === "Pause", "resume: the button should read Pause");
    }
    await page.waitForFunction(() => (window as any).esEvents.some((e: any) => e.event === "end"), null, { timeout: stepTimeout(n - 1) });
    await sleep(2600);
    const sEnd = await state(page);
    expect(sEnd.step === -1 && !sEnd.playing && sEnd.played, `end: unexpected state ${JSON.stringify(sEnd)}`);
    expect((await readout()) === endText, "end: the readout is not the end text");
    const events = (await page.evaluate(() => (window as any).esEvents)) as { event: string; step: number; line: number }[];
    const got = events.filter((e) => e.event === "step" || e.event === "line" || e.event === "end").map((e) => (e.event === "line" ? `${e.step}.${e.line}` : e.event === "step" ? `step ${e.step}` : "end")).join(" ");
    const want = data.steps.map((s, k) => [`step ${k}`, ...s.lines.map((_, i) => `${k}.${i}`)].join(" ")).join(" ") + " end";
    expect(got === want, `play: events out of order.\n      want ${want}\n      got  ${got}`);
    expect(events.filter((e) => e.event === "pause").length === n, "play: one pause event per pause expected");
    const rEnd = await rects(page);
    expect(rEnd.board === r0.board && rEnd.live === r0.live, `end: the board or the caption moved or changed size (board ${r0.board} → ${rEnd.board}; caption ${r0.live} → ${rEnd.live})`);
    const sigEnd = await signature(page);
    await shot(`${String(n + 1).padStart(2, "0")}-end`);

    // --- the finished board must equal the board built silently (what a jump or Listen relies on) ---
    await page.evaluate(() => (window as any).esPlayer.buildAll());
    const dBuilt = diff(sigEnd, await signature(page));
    expect(dBuilt.length === 0, `catch-up: the board after a full play differs from the board built at once (an action is not honouring api.fast?): ${dBuilt.join("; ")}`);

    // --- Listen on step 3, then on step 1; Pause / Resume with the buttons; Reset during play ---
    const third = Math.min(2, n - 1);
    await page.click(`.es-step[data-step="${third}"] .es-listen`);
    await page.waitForFunction((k) => (window as any).esPlayer.state().step === k && (window as any).esPlayer.state().line >= 0, third, { timeout: 20000, polling: 10 });
    await page.click("#es-pause");
    const l3 = await page.evaluate((k) => {
      const lis = [...document.querySelectorAll(".es-step")];
      return { open: !lis[k].classList.contains("es-closed"), earlierClosed: lis.slice(0, Math.max(0, k - 1)).every((li) => li.classList.contains("es-closed")), head: document.getElementById("es-live-head")!.textContent ?? "" };
    }, third);
    expect(l3.open && l3.earlierClosed, `listen: step ${third + 1} should be open and the steps before the previous one folded`);
    expect(l3.head.startsWith(`Step ${third + 1}`), "listen: the caption heading does not name the step");
    await sleep(900);
    await shot(`${String(n + 2).padStart(2, "0")}-listen-step-${third + 1}`);
    await page.click(`.es-step[data-step="0"] .es-listen`);
    await page.waitForFunction(() => (window as any).esPlayer.state().step === 0 && (window as any).esPlayer.state().line >= 0, null, { timeout: 20000, polling: 10 });
    await page.click("#es-pause");
    const p1 = await state(page);
    expect(p1.paused && p1.step === 0, `listen: Pause after Listen on step 1 gave ${JSON.stringify(p1)}`);
    expect(await page.evaluate(() => !document.querySelector('.es-step[data-step="0"]')!.classList.contains("es-closed")), "listen: step 1 should be open");
    await page.click("#es-pause");
    await page.waitForFunction((t) => (window as any).esPlayer.state().timeMs > t || (window as any).esPlayer.state().step !== 0, p1.timeMs, { timeout: 10000, polling: 20 });
    await page.click("#es-reset");
    const sReset = await state(page);
    expect(sReset.step === -1 && sReset.practice === "ready", `reset during play: unexpected state ${JSON.stringify(sReset)}`);
    expect((await readout()) === data.board.readoutPractice, "reset after play: the readout is not readoutPractice");
    expect((await page.evaluate(() => document.querySelectorAll("#es-ink .es-ink-line:not(.es-wither)").length)) === 0, "reset after play: the ink strip is not empty");
    await sleep(700);
    const sigPractice = await signature(page);
    await shot(`${String(n + 3).padStart(2, "0")}-practice`);

    // --- the practice task ---
    const pr = data.practice;
    const scale = await page.evaluate(() => document.querySelector("#es-board svg")!.getBoundingClientRect().width / 240);
    if (pr.kind === "drag-snap" && pr.drag && pr.snap) {
      const cur = await page.evaluate((id) => /translate\(\s*(-?[\d.]+)[\s,]+(-?[\d.]+)/.exec(document.getElementById(id)!.getAttribute("transform") ?? "")?.slice(1).map(Number) ?? [0, 0], pr.drag);
      const dx = (pr.snap[0] - cur[0]) * scale, dy = (pr.snap[1] - cur[1]) * scale, off = ((pr.tolerance ?? 16) + 14) * scale;
      let at = await grabPoint(page, pr.drag);
      if (!at) fail(`practice: nothing to press on "${pr.drag}"`);
      else {
        await dragBy(page, at, dx - off, dy - off);
        expect((await state(page)).practice === "ready", "practice: a drop away from the target counted as right");
        if (pr.missText) expect((await readout()) === pr.missText, "practice: a miss should show missText");
        at = await grabPoint(page, pr.drag);
        await dragBy(page, at!, off + 3, off - 3);
      }
    } else if (pr.kind === "order" && pr.chips) {
      const centre = (id: string) => page.evaluate((id) => { const r = document.getElementById(id)!.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
      const drop = async (chip: string, slot: string) => {
        const at = await grabPoint(page, chip);
        if (!at) return fail(`practice: nothing to press on chip "${chip}"`);
        const c = await centre(chip), s = await centre(slot);
        await dragBy(page, at, s.x - c.x, s.y - c.y);
      };
      await drop(pr.chips[0].id, pr.chips[1].slot);
      expect(await page.evaluate((id) => !document.getElementById(id)!.classList.contains("es-placed"), pr.chips[0].id), "practice: a chip dropped on the wrong slot stayed there");
      for (const c of pr.chips) await drop(c.id, c.slot);
    } else {
      await page.evaluate(() => (window as any).esPlayer.solvePractice());
    }
    await sleep(1800);
    expect((await state(page)).practice === "done", "practice: the task did not complete");
    if (pr.doneText) expect((await readout()) === pr.doneText, "practice: the readout is not doneText");
    const rPr = await rects(page);
    expect(rPr.board === r0.board && rPr.live === r0.live, `practice: the board or the caption moved or changed size (board ${r0.board} → ${rPr.board})`);
    await shot(`${String(n + 4).padStart(2, "0")}-practice-done`);
    await page.click("#es-reset");
    await sleep(700);
    expect((await state(page)).practice === "ready", "reset after the practice task should open the task again");
    const dPr = diff(sigPractice, await signature(page));
    expect(dPr.length === 0, `reset after the practice task does not give the practice board again: ${dPr.join("; ")}`);

    // --- taps ---
    await page.click("#es-transcript-btn");
    expect(await page.isVisible("#es-transcript"), "transcript: does not open");
    const taps = await page.evaluate(() => {
      const out: string[] = [];
      document.querySelectorAll<HTMLElement>(".es-step.es-closed .es-chev").forEach((c) => c.click());
      const folds = [...document.querySelectorAll<HTMLElement>(".es-fold")];
      if (!folds.length) out.push("no fold on the page");
      folds.forEach((f) => {
        const head = f.querySelector<HTMLElement>(".es-fold-head"), body = f.querySelector<HTMLElement>(".es-fold-body");
        if (!head || !body) return void out.push("a fold was not set up");
        if (getComputedStyle(body).display !== "none") out.push("a fold starts open");
        head.click();
        if (getComputedStyle(body).display === "none") out.push("a fold does not open");
      });
      document.querySelectorAll<HTMLElement>(".es-eq [data-how]").forEach((l) => {
        l.click();
        const how = l.nextElementSibling as HTMLElement | null;
        if (!how || !how.classList.contains("es-how") || getComputedStyle(how).display === "none") out.push("an equation line does not show its operation");
      });
      document.querySelectorAll<HTMLElement>(".es-choices").forEach((box) => {
        const want = box.getAttribute("data-answer"), fb = box.parentElement!.querySelector(".es-fb");
        const btns = [...box.querySelectorAll("button")];
        const wrong = btns.find((b) => b.textContent!.trim() !== want), right = btns.find((b) => b.textContent!.trim() === want);
        if (!right || !wrong || !fb) return void out.push("a choice box has no right answer, no wrong answer or no feedback line");
        wrong.click();
        if (!wrong.classList.contains("es-wrong") || !/^Not quite/.test(fb.textContent ?? "")) out.push("a wrong choice gives no feedback");
        right.click();
        if (!right.classList.contains("es-right") || !/^Yes\./.test(fb.textContent ?? "")) out.push("the right choice gives no feedback");
      });
      document.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach((r) => {
        for (const v of [r.max, r.min]) { r.value = v; r.dispatchEvent(new Event("input", { bubbles: true })); }
      });
      return out;
    });
    for (const t of taps) fail(`taps: ${t}`);
    await sleep(500);
    expect(await noSideScroll(page), "everything open: the page scrolls sideways");
    const wide = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".ai-solution *")].filter((e) => !e.closest("svg") && e.getBoundingClientRect().right > window.innerWidth + 1).map((e) => `${e.tagName.toLowerCase()}.${e.className}`).slice(0, 5));
    expect(wide.length === 0, `everything open: content runs past the right edge: ${wide.join(", ")}`);
    await shot(`${String(n + 5).padStart(2, "0")}-all-open`);

    // --- nothing but the page and its clips was requested ---
    const outside = requests.filter((u) => !(u === `${base}/solution.html` || new RegExp(`^${base}/audio/step-\\d+\\.mp3$`).test(u)));
    expect(outside.length === 0, `requests other than the page and its clips: ${[...new Set(outside)].join(", ")}`);
  } catch (e) {
    fail(`stopped: ${(e as Error).message.split("\n")[0]}`);
    try {
      await shot("99-where-it-stopped");
    } catch {
      /* the page is gone */
    }
  } finally {
    await browser.close();
  }
  for (const m of notes) log(`  note (${width}px): ${m}`);
  return fails;
}

export const SCREEN_SIZES: [number, number][] = [[360, 740], [768, 1024], [1024, 768]];

export type ScreenCheck =
  /** Playwright or its browser is not installed here: nothing was checked. */
  | { status: "unavailable"; why: string }
  | { status: "ok"; shots: string }
  | { status: "failed"; fails: string[]; shots: string };

export type ScreenCheckOptions = { speed?: number; widths?: [number, number][]; log?: (line: string) => void };

/** Playwright's chromium, or why it cannot be used here (package missing, or its browser not downloaded). */
export async function loadBrowser(): Promise<{ chromium: BrowserType } | { why: string }> {
  let chromium: BrowserType;
  try {
    chromium = (await import("playwright")).chromium;
  } catch (e) {
    return { why: `Playwright is not installed (${(e as Error).message.split("\n")[0]})` };
  }
  try {
    const b = await chromium.launch();
    await b.close();
  } catch (e) {
    return { why: `the Playwright browser cannot start (${(e as Error).message.split("\n")[0]})` };
  }
  return { chromium };
}

/**
 * Checks the built folder `outDir` at the three screen sizes. "unavailable" when there is no browser to check
 * with; "failed" lists every problem. Throws only when the folder is not a built item.
 */
export async function screenCheck(outDir: string, opts: ScreenCheckOptions = {}): Promise<ScreenCheck> {
  const log = opts.log ?? (() => {});
  const dir = path.resolve(outDir);
  const pagePath = path.join(dir, "solution.html");
  if (!existsSync(pagePath)) throw new Error(`${pagePath} not found. Build the item first.`);
  const m = /<script type="application\/json" id="es-spec">([\s\S]*?)<\/script>/.exec(readFileSync(pagePath, "utf8"));
  if (!m) throw new Error("solution.html has no embedded spec; was it built by keystone-animated-build.ts?");
  const data = JSON.parse(m[1]) as Data;
  const browser = await loadBrowser();
  if ("why" in browser) return { status: "unavailable", why: browser.why };
  const speed = Math.max(1, Math.min(16, opts.speed ?? 8));
  const widths = opts.widths ?? SCREEN_SIZES;
  const hasClips = data.steps.every((_, k) => existsSync(path.join(dir, "audio", `step-${k + 1}.mp3`)));
  if (!hasClips) log("  note: not every step has a clip; those steps are timed by caption length");
  const shots = path.join(dir, "shots");
  rmSync(shots, { recursive: true, force: true });
  mkdirSync(shots, { recursive: true });
  const server = await serve(dir);
  const fails: string[] = [];
  try {
    for (const [w, h] of widths) {
      const f = await checkWidth(browser.chromium, server.url, dir, data, w, h, speed, hasClips, log);
      log(`${w}×${h}: ${f.length ? `${f.length} problem(s)` : "ok"}`);
      fails.push(...f);
    }
  } finally {
    server.close();
  }
  return fails.length ? { status: "failed", fails, shots } : { status: "ok", shots };
}
