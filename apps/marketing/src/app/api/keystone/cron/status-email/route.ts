// The daily status email to Praveen, called by the server's cron with curl at 14:00 and 15:00 UTC (no tsx on
// the server): POST /api/keystone/cron/status-email   header x-keystone-cron: $KEYSTONE_CRON_SECRET
// It sends only when it is 7 am in Los Angeles and not already today, so exactly one of the two calls sends,
// in summer and in winter. ?print=1 returns the text without sending and without the heartbeat (no write
// function is called: pipeline/jobs.ts statusEmailJob). Secret only, as the release route: 503 when not
// configured, 404 with an empty body for a wrong or missing header. Same work as scripts/keystone-status-email.ts.
import { CRON_HEADER, cronGate, statusEmailJob } from "@/lib/keystone/pipeline/jobs";
import { scrubSecrets, secretsOf } from "@/lib/keystone/pipeline/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export async function POST(req: Request): Promise<Response> {
  const gate = cronGate(req.headers.get(CRON_HEADER), process.env.KEYSTONE_CRON_SECRET);
  if (gate === "unconfigured") return new Response("not configured", { status: 503 });
  if (gate === "denied") return new Response(null, { status: 404 });
  const print = new URL(req.url).searchParams.get("print") === "1";
  try {
    const r = await statusEmailJob(print ? { print: true } : { onlyAtPacificHour: 7 });
    if (r.status === "printed") return new Response(`Subject: ${r.subject}\n\n${r.text}\n`, { status: 200, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
    return json(r);
  } catch (e) {
    return json({ status: "error", error: scrubSecrets(e instanceof Error ? e.message : String(e), secretsOf(process.env)).slice(0, 300) }, 500);
  }
}

export async function GET(): Promise<Response> {
  return new Response(null, { status: 405, headers: { allow: "POST" } });
}
