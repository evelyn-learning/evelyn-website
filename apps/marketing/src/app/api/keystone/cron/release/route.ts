// The hourly timed release, called by the server's cron with curl (no tsx on the server):
//   POST /api/keystone/cron/release   header x-keystone-cron: $KEYSTONE_CRON_SECRET
// Secret only: no user session is read, and a session never opens it. Not configured (secret unset or shorter
// than 24 characters) → 503; a wrong or missing header → 404 with an empty body. Same work as
// scripts/keystone-release.ts in a writing run (pipeline/jobs.ts releaseJob): lock, release, heartbeat.
// The JSON reply is read only by the cron log.
import { after } from "next/server";
import { CRON_HEADER, cronGate, releaseJob } from "@/lib/keystone/pipeline/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export async function POST(req: Request): Promise<Response> {
  const gate = cronGate(req.headers.get(CRON_HEADER), process.env.KEYSTONE_CRON_SECRET);
  if (gate === "unconfigured") return new Response("not configured", { status: 503 });
  if (gate === "denied") return new Response(null, { status: 404 });
  // Safety net for the server's build of animated solutions: whatever is still queued for API credits (a build
  // interrupted by a restart, a press that found the lock held) is built after this reply, never inside it.
  try {
    after(async () => {
      try {
        const { buildQueued } = await import("@/lib/keystone/animated/serverbuild");
        await buildQueued();
      } catch (e) {
        console.error(`[keystone animated build] stopped: ${e instanceof Error ? e.message : String(e)}`);
      }
    });
  } catch {
    // Called outside a request (the route's own test calls POST directly): there is no "after the response", and
    // the release below must still run. The next cron call is the safety net.
  }
  try {
    const r = await releaseJob(new Date());
    if (r.status === "busy") return json({ status: "busy" });
    return json({
      status: "done",
      inWindow: r.inWindow,
      released: r.released.length,
      sampled: r.sampled.length + r.heldUnbatched.length,
      heldNoTime: r.heldNoTime.length,
      blocked: r.blocked.map((b) => ({ batchId: b.batchId, why: b.why })),
    });
  } catch (e) {
    return json({ status: "error", error: (e instanceof Error ? e.message : String(e)).slice(0, 300) }, 500);
  }
}

export async function GET(): Promise<Response> {
  return new Response(null, { status: 405, headers: { allow: "POST" } });
}
