/**
 * The daily status email to Praveen (spec §9), sent by cron on the server at 7:00 am Pacific. Calls no model.
 *
 *   KEYSTONE_MONGODB_URI=<uri> KEYSTONE_STATUS_TO=... KEYSTONE_STATUS_FROM=...@evelynlearning.com \
 *   KEYSTONE_RESEND_API_KEY=... npx tsx apps/marketing/scripts/keystone-status-email.ts [--print [--now <iso>]]
 *
 *   --print        read-only connection (KEYSTONE_READONLY=1 before connecting); prints the subject and the
 *                  text body; sends nothing, writes nothing
 *   --now <iso>    with --print only: the status as of this instant
 *
 * Without --print: sends through Resend (key: KEYSTONE_RESEND_API_KEY, else RESEND_API_KEY; the sender must
 * be an @evelynlearning.com address, the account that key belongs to), then records the heartbeat
 * "keystone-status-email" — its only database write. If the mail went out and only the heartbeat fails, it
 * prints a warning and exits 0 (a failing exit would get the mail sent twice). Every error printed passes
 * through the key scrub (status.ts scrubSecrets) first.
 */
import { KEYSTONE_DB } from "../src/lib/keystone/config";

/** Host and port of a mongodb URI, without credentials or options. */
function hostOf(uri: string): string {
  const m = /^mongodb(?:\+srv)?:\/\/(?:[^@/]*@)?([^/?]+)/.exec(uri);
  return m ? m[1] : "(unreadable URI)";
}

function parse(argv: string[]): { print: boolean; now?: Date } {
  const a: { print: boolean; now?: Date } = { print: false };
  for (let i = 0; i < argv.length; i++) {
    const o = argv[i];
    if (o === "--print") a.print = true;
    else if (o === "--now") {
      const v = argv[++i];
      const d = new Date(v ?? "");
      if (!v || Number.isNaN(d.getTime())) throw new Error("--now needs an ISO date-time");
      a.now = d;
    } else throw new Error(`unknown option ${o}`);
  }
  if (a.now && !a.print) throw new Error("--now is allowed only together with --print");
  return a;
}

async function main() {
  const args = parse(process.argv.slice(2));
  // Before any connection: --print opens the database read-only (db.ts connectOptions / blockWrites).
  if (args.print) process.env.KEYSTONE_READONLY = "1";
  else if (process.env.KEYSTONE_READONLY === "1") throw new Error("Refusing to run: KEYSTONE_READONLY=1 is set for a sending run (use --print).");
  const uri = process.env.KEYSTONE_MONGODB_URI;
  if (!uri) throw new Error("Refusing to run: set KEYSTONE_MONGODB_URI explicitly.");

  const status = await import("../src/lib/keystone/pipeline/status");
  // Checked before connecting: a send that cannot happen does not touch the database.
  const cfg = args.print ? null : status.statusSendConfig(process.env);
  console.log(`Database: ${KEYSTONE_DB} on ${hostOf(uri)}${args.print ? " (PRINT: read-only connection, nothing is sent or written)" : ""}`);

  const { closeKs } = await import("../src/lib/keystone/db");
  try {
    const now = args.now ?? new Date();
    const s = await status.buildStatus(now);
    const email = status.renderStatusEmail(s, now);
    if (!cfg) {
      console.log(`Subject: ${email.subject}\n\n${email.text}\n\n(not sent: --print)`);
      return;
    }
    const res = await status.sendStatusEmail(email, cfg);
    console.log(`status email: sent "${email.subject}" to ${cfg.to.join(", ")}${res.id ? ` (Resend id ${res.id})` : ""}`);
    const { beat } = await import("../src/lib/keystone/pipeline/heartbeat");
    await status.afterSent(() => beat(status.STATUS_HEARTBEAT, new Date()), (w) => console.warn(w), status.secretsOf(process.env));
  } finally {
    await closeKs().catch(() => {});
  }
}

main().catch(async (e) => {
  const msg = e instanceof Error ? e.message : String(e);
  // The same scrub as the send path, for every error (network, database, configuration).
  let scrubbed: string;
  try {
    const { scrubSecrets, secretsOf } = await import("../src/lib/keystone/pipeline/status");
    scrubbed = scrubSecrets(msg, secretsOf(process.env));
  } catch {
    scrubbed = "error (message withheld: the key scrub could not load)";
  }
  console.error(scrubbed);
  process.exit(1);
});
