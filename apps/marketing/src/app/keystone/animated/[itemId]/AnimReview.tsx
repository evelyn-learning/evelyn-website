"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AnimationStatus, AnimFlagStatus } from "@/lib/keystone/db";
import { ANIMATED_ROUTE, ANIMATION_STATUS_LABEL, MAX_SHOTS, MAX_SHOT_BYTES, clock, cropRect, shotUrl, where } from "@/lib/keystone/animreview/pure";

export type FlagView = {
  id: string;
  version: number;
  step: number | null;
  line: number | null;
  timeMs: number | null;
  comment: string;
  spoken: boolean;
  shots: string[];
  status: AnimFlagStatus;
  fixedInVersion: number | null;
  reply: string | null;
  reopenOf: string | null;
  createdBy: string;
  createdAt: string;
};

type Props = {
  base: string;
  me: string;
  itemId: string;
  version: number;
  status: AnimationStatus;
  voice: string | null;
  notes: string | null;
  src: string;
  height: number;
  versions: { version: number; status: AnimationStatus }[];
  flags: FlagView[];
  fixedHere: FlagView[];
  stillOpen: FlagView[];
  canAccept: boolean;
};

/** The player's API (Task 1 contract). Missing on the legacy prototypes: flags then save with step/line unknown. */
type EsPlayer = {
  state(): { step: number; line: number; timeMs: number; playing: boolean; paused: boolean; version?: unknown };
  pause(): void;
  resume(): void;
};
type Pos = { step: number | null; line: number | null; timeMs: number | null };
type Shot = { blob: Blob; url: string };
type Draft = { pos: Pos; comment: string; spoken: boolean; shots: Shot[]; wasPlaying: boolean };

const WIDTHS = [
  { key: "phone", label: "Phone", px: 360 },
  { key: "tablet", label: "Tablet", px: 768 },
  { key: "desktop", label: "Desktop", px: 1024 },
] as const;

/* eslint-disable @typescript-eslint/no-explicit-any */
type SpeechRec = { continuous: boolean; interimResults: boolean; lang: string; start(): void; stop(): void; onresult: ((e: any) => void) | null; onend: (() => void) | null; onerror: ((e: any) => void) | null };
const speechCtor = (): (new () => SpeechRec) | null => (typeof window === "undefined" ? null : ((window as any).webkitSpeechRecognition ?? (window as any).SpeechRecognition ?? null));
/* eslint-enable @typescript-eslint/no-explicit-any */

const typing = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT" || el.tagName === "SELECT" || el.isContentEditable);
};

async function post(fields: Record<string, string>, shots: Blob[] = []): Promise<{ ok?: unknown; error?: string }> {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  shots.forEach((b, i) => fd.append("shots", b, `${i + 1}.png`));
  try {
    const res = await fetch(`${ANIMATED_ROUTE}/flags`, { method: "POST", body: fd });
    if (res.status === 404) return { error: "Not allowed." };
    return (await res.json()) as { ok?: unknown; error?: string };
  } catch (e) {
    return { error: `Could not save: ${(e as Error).message}` };
  }
}

export function AnimReview(p: Props) {
  const router = useRouter();
  const frame = useRef<HTMLIFrameElement>(null);
  const [width, setWidth] = useState<(typeof WIDTHS)[number]["key"]>("desktop");
  const [draft, setDraft] = useState<Draft | null>(null);
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const [busy, setBusy] = useState(false);
  const [msg, setMsgState] = useState<{ text: string; bad: boolean } | null>(null);
  const setMsg = (text: string, bad = true) => setMsgState(text ? { text, bad } : null);
  const [now, setNow] = useState<Pos | null>(null);
  const [hasApi, setHasApi] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [micOk, setMicOk] = useState(false);
  const recRef = useRef<SpeechRec | null>(null);
  const streamRef = useRef<{ stream: MediaStream; video: HTMLVideoElement } | null>(null);
  const box = useRef<HTMLTextAreaElement>(null);

  const player = useCallback((): EsPlayer | null => {
    try {
      const w = frame.current?.contentWindow as (Window & { esPlayer?: EsPlayer }) | null | undefined;
      return w?.esPlayer && typeof w.esPlayer.state === "function" ? w.esPlayer : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => setMicOk(!!speechCtor()), []);
  useEffect(
    () => () => {
      streamRef.current?.stream.getTracks().forEach((t) => t.stop());
      recRef.current?.stop();
    },
    [],
  );

  // Live position from the player's events (same origin only).
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return;
      const d = e.data as { type?: string; step?: number; line?: number };
      if (d?.type !== "es-player") return;
      setNow({ step: typeof d.step === "number" ? d.step : null, line: typeof d.line === "number" ? d.line : null, timeMs: null });
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, []);

  const openFlag = useCallback((): Draft => {
    if (draftRef.current) {
      box.current?.focus();
      return draftRef.current;
    }
    const pl = player();
    let pos: Pos = { step: null, line: null, timeMs: null };
    let wasPlaying = false;
    if (pl) {
      try {
        const s = pl.state();
        wasPlaying = !!s.playing && !s.paused;
        pl.pause();
        pos = { step: Number.isFinite(s.step) ? s.step : null, line: Number.isFinite(s.line) ? s.line : null, timeMs: Number.isFinite(s.timeMs) ? Math.round(s.timeMs) : null };
      } catch {}
    }
    const d: Draft = { pos, comment: "", spoken: false, shots: [], wasPlaying };
    draftRef.current = d;
    setDraft(d);
    setMsg("");
    setTimeout(() => box.current?.focus(), 0);
    return d;
  }, [player]);

  const resume = useCallback(
    (d: Draft) => {
      if (!d.wasPlaying) return;
      try {
        player()?.resume();
      } catch {}
    },
    [player],
  );

  const stopMic = () => {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  };

  const closeDraft = (d: Draft) => {
    stopMic();
    d.shots.forEach((s) => URL.revokeObjectURL(s.url));
    draftRef.current = null;
    setDraft(null);
  };

  // A picture of the tab, cropped to the player. The browser asks once which tab to share; the stream is kept.
  const snap = useCallback(async () => {
    const d = openFlag();
    if (d.shots.length >= MAX_SHOTS) return setMsg(`At most ${MAX_SHOTS} pictures per flag.`);
    try {
      if (!streamRef.current || !streamRef.current.stream.active) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "browser" }, audio: false, preferCurrentTab: true } as DisplayMediaStreamOptions);
        const video = document.createElement("video");
        video.srcObject = stream;
        video.muted = true;
        await video.play();
        // The first frames of a new capture are blank.
        await new Promise((r) => setTimeout(r, 400));
        streamRef.current = { stream, video };
      }
      const { video } = streamRef.current;
      const el = frame.current;
      if (!el) throw new Error("no player on the page");
      const c = cropRect(el.getBoundingClientRect(), { width: window.innerWidth, height: window.innerHeight }, { width: video.videoWidth, height: video.videoHeight });
      if (!c) throw new Error("the player is not on screen");
      const canvas = document.createElement("canvas");
      canvas.width = c.sw;
      canvas.height = c.sh;
      canvas.getContext("2d")!.drawImage(video, c.sx, c.sy, c.sw, c.sh, 0, 0, c.sw, c.sh);
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
      if (!blob) throw new Error("no picture");
      if (blob.size > MAX_SHOT_BYTES) throw new Error("picture larger than 4 MB");
      const cur = draftRef.current;
      if (!cur) return;
      const next = { ...cur, shots: [...cur.shots, { blob, url: URL.createObjectURL(blob) }] };
      draftRef.current = next;
      setDraft(next);
      setMsg("");
    } catch (e) {
      setMsg(`Snap failed: ${(e as Error).message}`);
    }
  }, [openFlag]);

  const mic = () => {
    if (listening) return stopMic();
    const Ctor = speechCtor();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-CA";
    rec.onresult = (e) => {
      let said = "";
      for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) said += e.results[i][0].transcript;
      said = said.trim();
      const cur = draftRef.current;
      if (!said || !cur) return;
      const next = { ...cur, comment: cur.comment ? `${cur.comment.replace(/\s+$/, "")} ${said}` : said, spoken: true };
      draftRef.current = next;
      setDraft(next);
    };
    rec.onend = () => setListening(false);
    rec.onerror = (e) => {
      setListening(false);
      setMsg(`Dictation stopped: ${e?.error ?? "error"}`);
    };
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const save = async () => {
    const d = draftRef.current;
    if (!d || busy) return;
    if (!d.comment.trim() && !d.shots.length) return setMsg("Write what is wrong, or add a picture.");
    setBusy(true);
    stopMic();
    const r = await post(
      {
        op: "create",
        itemId: p.itemId,
        version: String(p.version),
        step: d.pos.step === null ? "" : String(d.pos.step),
        line: d.pos.line === null ? "" : String(d.pos.line),
        timeMs: d.pos.timeMs === null ? "" : String(d.pos.timeMs),
        comment: d.comment,
        spoken: d.spoken ? "1" : "",
      },
      d.shots.map((s) => s.blob),
    );
    setBusy(false);
    if (r.error) return setMsg(r.error);
    closeDraft(d);
    resume(d);
    setMsg("Flag saved.", false);
    router.refresh();
  };

  const cancel = () => {
    const d = draftRef.current;
    if (!d) return;
    closeDraft(d);
    resume(d);
  };

  // Keys: f = Flag, s = Snap (also when the focus is inside the player).
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return;
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        openFlag();
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        void snap();
      }
    },
    [openFlag, snap],
  );
  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  const hooked = useRef<WeakSet<Window>>(new WeakSet());
  const onFrameLoad = useCallback(() => {
    setHasApi(!!player());
    try {
      const w = frame.current?.contentWindow;
      if (w && !hooked.current.has(w)) {
        hooked.current.add(w);
        w.addEventListener("keydown", onKey);
      }
    } catch {}
  }, [player, onKey]);
  // The iframe can finish loading before hydration, when React's onLoad is not attached yet.
  useEffect(() => {
    try {
      if (frame.current?.contentDocument?.readyState === "complete" && frame.current.contentWindow?.location.href !== "about:blank") onFrameLoad();
    } catch {}
  }, [onFrameLoad]);

  const act = async (fields: Record<string, string>, ok: string) => {
    setBusy(true);
    const r = await post(fields);
    setBusy(false);
    if (r.error) {
      setMsg(r.error);
      return false;
    }
    setMsg(ok, false);
    router.refresh();
    return true;
  };

  const px = WIDTHS.find((w) => w.key === width)!.px;
  const openCount = p.flags.filter((f) => f.status === "open").length + p.stillOpen.length;

  return (
    <div className="ks-ar">
      <div className="ks-ar-head">
        <div>
          <h1>
            Item {p.itemId} · v{p.version} <span className={`ks-chip a-${p.status}`}>{ANIMATION_STATUS_LABEL[p.status]}</span>
          </h1>
          <p className="ks-sub">
            <Link href={`${p.base}/animated`}>All animated solutions</Link>
            {p.voice ? ` · voice: ${p.voice}` : ""}
            {p.notes ? ` · ${p.notes}` : ""}
          </p>
        </div>
        <div className="ks-ar-ctl">
          <nav className="ks-ar-seg" aria-label="Version">
            {p.versions.map((v) => (
              <Link key={v.version} href={`${p.base}/animated/${p.itemId}?v=${v.version}`} className={v.version === p.version ? "on" : ""} title={ANIMATION_STATUS_LABEL[v.status]}>
                v{v.version}
              </Link>
            ))}
          </nav>
          <div className="ks-ar-seg" role="group" aria-label="Width">
            {WIDTHS.map((w) => (
              <button key={w.key} type="button" className={w.key === width ? "on" : ""} onClick={() => setWidth(w.key)} aria-pressed={w.key === width}>
                {w.label} <small>{w.px}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ks-ar-body">
        <div className="ks-ar-stage">
          <iframe ref={frame} src={p.src} title={`Animated solution, item ${p.itemId} v${p.version}`} style={{ width: px, height: p.height }} allow="autoplay" onLoad={onFrameLoad} />
        </div>

        <aside className="ks-ar-panel ks-card">
          <div className="ks-ar-buttons">
            <button type="button" className="ks-btn warn" onClick={() => openFlag()} disabled={busy}>
              ⚑ Flag <kbd>f</kbd>
            </button>
            <button type="button" className="ks-btn" onClick={() => void snap()} disabled={busy}>
              Snap <kbd>s</kbd>
            </button>
            {p.canAccept && openCount === 0 && !draft && (
              <button
                type="button"
                className="ks-btn ok"
                disabled={busy}
                onClick={() => {
                  if (window.confirm(`Accept v${p.version} of item ${p.itemId}?`)) void act({ op: "accept", itemId: p.itemId, version: String(p.version) }, "Version accepted.");
                }}
              >
                Accept this version
              </button>
            )}
          </div>
          <div className="ks-ar-now">
            {hasApi === false ? "This player reports no position: flags save with the step unknown." : now ? `Now: ${where(now.step, now.line)}` : ""}
          </div>

          {draft && (
            <div className="ks-ar-draft">
              <div className="ks-q-meta">
                Flag at {where(draft.pos.step, draft.pos.line)} · {clock(draft.pos.timeMs)}
              </div>
              <textarea
                ref={box}
                rows={4}
                value={draft.comment}
                placeholder="What is wrong here?"
                onChange={(e) => {
                  const next = { ...draft, comment: e.target.value };
                  draftRef.current = next;
                  setDraft(next);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void save();
                  if (e.key === "Escape") cancel();
                }}
              />
              {draft.shots.length > 0 && (
                <div className="ks-ar-thumbs">
                  {draft.shots.map((s, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={s.url} src={s.url} alt={`Picture ${i + 1}`} />
                  ))}
                </div>
              )}
              <div className="ks-ar-buttons">
                <button type="button" className="ks-btn primary" onClick={() => void save()} disabled={busy}>
                  Save <kbd>⌘↵</kbd>
                </button>
                {micOk && (
                  <button type="button" className={`ks-btn${listening ? " bad" : ""}`} onClick={mic} disabled={busy} aria-pressed={listening}>
                    {listening ? "■ Stop" : "🎙 Speak"}
                  </button>
                )}
                <button type="button" className="ks-linkbtn" onClick={cancel} disabled={busy}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          {msg && <div className={msg.bad ? "ks-err" : "ks-ar-msg"}>{msg.text}</div>}

          <h2>Flags on v{p.version} · {p.flags.length}</h2>
          {p.flags.length ? (
            <ul className="ks-ar-list">
              {p.flags.map((f) => (
                <FlagRow key={f.id} f={f} me={p.me} busy={busy} act={act} />
              ))}
            </ul>
          ) : (
            <div className="ks-empty">No flag on this version.</div>
          )}

          {p.fixedHere.length > 0 && (
            <>
              <h2>Fixed in v{p.version} · {p.fixedHere.length}</h2>
              <ul className="ks-ar-list">
                {p.fixedHere.map((f) => (
                  <FixedRow key={f.id} f={f} busy={busy} act={act} />
                ))}
              </ul>
            </>
          )}

          {p.stillOpen.length > 0 && (
            <>
              <h2>Still open from earlier versions · {p.stillOpen.length}</h2>
              <ul className="ks-ar-list">
                {p.stillOpen.map((f) => (
                  <li key={f.id} className="ks-ar-flag">
                    <FlagHead f={f} />
                    <div className="ks-ar-comment">{f.comment}</div>
                    <Shots f={f} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

const STATUS_LABEL: Record<AnimFlagStatus, string> = { open: "Open", fixed: "Fixed", confirmed: "Confirmed", reopened: "Reopened" };

function FlagHead({ f }: { f: FlagView }) {
  return (
    <div className="ks-q-head">
      <b>{where(f.step, f.line)}</b>
      <span className="ks-q-meta">
        {clock(f.timeMs)} · v{f.version}
        {f.spoken ? " · spoken" : ""}
        {f.reopenOf ? " · reopened" : ""}
      </span>
      <span className={`ks-chip f-${f.status}`}>{f.status === "fixed" && f.fixedInVersion ? `Fixed in v${f.fixedInVersion}` : STATUS_LABEL[f.status]}</span>
    </div>
  );
}

function Shots({ f }: { f: FlagView }) {
  if (!f.shots.length) return null;
  return (
    <div className="ks-ar-thumbs">
      {f.shots.map((s) => (
        <a key={s} href={shotUrl(f.id, s)} target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shotUrl(f.id, s)} alt={`Picture ${s}`} loading="lazy" />
        </a>
      ))}
    </div>
  );
}

type Act = (fields: Record<string, string>, ok: string) => Promise<boolean>;

function FlagRow({ f, me, busy, act }: { f: FlagView; me: string; busy: boolean; act: Act }) {
  const [edit, setEdit] = useState<string | null>(null);
  const mine = f.createdBy === me && f.status === "open";
  return (
    <li className="ks-ar-flag" data-flag={f.id}>
      <FlagHead f={f} />
      {edit === null ? <div className="ks-ar-comment">{f.comment || <i>No comment</i>}</div> : <textarea rows={3} value={edit} onChange={(e) => setEdit(e.target.value)} />}
      {f.reply && <div className="ks-ar-reply">Fix: {f.reply}</div>}
      <Shots f={f} />
      {mine && (
        <div className="ks-ar-buttons">
          {edit === null ? (
            <>
              <button type="button" className="ks-linkbtn" disabled={busy} onClick={() => setEdit(f.comment)}>
                Edit
              </button>
              <button
                type="button"
                className="ks-linkbtn"
                disabled={busy}
                onClick={() => {
                  if (window.confirm("Delete this flag?")) void act({ op: "delete", flagId: f.id }, "Flag deleted.");
                }}
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button type="button" className="ks-btn primary" disabled={busy} onClick={() => void act({ op: "update", flagId: f.id, comment: edit }, "Flag updated.").then((ok) => ok && setEdit(null))}>
                Save
              </button>
              <button type="button" className="ks-linkbtn" onClick={() => setEdit(null)}>
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
}

function FixedRow({ f, busy, act }: { f: FlagView; busy: boolean; act: Act }) {
  const [why, setWhy] = useState<string | null>(null);
  return (
    <li className="ks-ar-flag" data-flag={f.id}>
      <FlagHead f={f} />
      <div className="ks-ar-comment">{f.comment || <i>No comment</i>}</div>
      {f.reply && <div className="ks-ar-reply">Fix: {f.reply}</div>}
      <Shots f={f} />
      {f.status === "fixed" && (
        <div className="ks-ar-buttons">
          {why === null ? (
            <>
              <button type="button" className="ks-btn ok" disabled={busy} onClick={() => void act({ op: "confirm", flagId: f.id }, "Fix confirmed.")}>
                Confirm
              </button>
              <button type="button" className="ks-btn warn" disabled={busy} onClick={() => setWhy("")}>
                Reopen
              </button>
            </>
          ) : (
            <div className="ks-ar-draft">
              <textarea rows={3} value={why} placeholder="What is still wrong?" onChange={(e) => setWhy(e.target.value)} autoFocus />
              <div className="ks-ar-buttons">
                <button type="button" className="ks-btn warn" disabled={busy || !why.trim()} onClick={() => void act({ op: "reopen", flagId: f.id, comment: why }, "Flag reopened.").then((ok) => ok && setWhy(null))}>
                  Reopen
                </button>
                <button type="button" className="ks-linkbtn" onClick={() => setWhy(null)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
