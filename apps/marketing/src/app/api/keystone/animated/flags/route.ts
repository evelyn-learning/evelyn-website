import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/keystone/config";
import { userFromToken } from "@/lib/keystone/auth";
import { isReadOnly } from "@/lib/keystone/db";
import { parseVersion } from "@/lib/keystone/animreview/pure";
import { acceptVersion, confirmFlag, createFlag, deleteFlag, reopenFlag, updateFlag, type Outcome } from "@/lib/keystone/animreview/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The flag panel's writes (multipart: pictures go with a flag, which a server action's body limit would refuse).
// op = create | update | delete | confirm | reopen | accept. Any signed-in user may call it; what each role may
// do is decided in the store from the session's role, never from anything the page sends: Castle Rock flag the
// released version only and touch only Castle Rock's flags (anything else answers as if it did not exist);
// accept is Evelyn's alone (404 for anyone else, like the pages). Returns { ok } or { error }; the page
// refreshes itself.

export async function POST(req: NextRequest) {
  const user = await userFromToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  if (isReadOnly()) return NextResponse.json({ error: "Keystone is read-only right now." }, { status: 503 });
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Could not read the request." }, { status: 400 });
  }
  const s = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : undefined;
  };
  const shots: Uint8Array[] = [];
  for (const f of form.getAll("shots")) if (typeof f !== "string" && f.size > 0) shots.push(new Uint8Array(await f.arrayBuffer()));
  const who = { username: user.username, role: user.role, name: user.name };
  let out: Outcome<unknown>;
  try {
    switch (s("op")) {
      case "create": {
        const version = parseVersion(s("version"));
        if (version === null) return NextResponse.json({ error: "No version given." }, { status: 400 });
        const r = await createFlag(
          { itemId: s("itemId") ?? "", version, step: s("step"), line: s("line"), timeMs: s("timeMs"), comment: s("comment"), spoken: s("spoken") },
          shots,
          who,
        );
        out = "error" in r ? r : { ok: r.ok.id };
        break;
      }
      case "update":
        out = await updateFlag(s("flagId") ?? "", s("comment"), shots, who);
        break;
      case "delete":
        out = await deleteFlag(s("flagId") ?? "", who);
        break;
      case "confirm":
        out = await confirmFlag(s("flagId") ?? "", who);
        break;
      case "reopen": {
        const r = await reopenFlag(s("flagId") ?? "", s("comment"), who);
        out = "error" in r ? r : { ok: r.ok.id };
        break;
      }
      case "accept": {
        if (user.role !== "evelyn") return new NextResponse("Not found", { status: 404 });
        const version = parseVersion(s("version"));
        if (version === null) return NextResponse.json({ error: "No version given." }, { status: 400 });
        out = await acceptVersion(s("itemId") ?? "", version, who);
        break;
      }
      default:
        return NextResponse.json({ error: "Unknown operation." }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
  return NextResponse.json(out, { status: "error" in out ? 400 : 200 });
}
