import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, can } from "@/lib/keystone/config";
import { userFromToken } from "@/lib/keystone/auth";
import { ks } from "@/lib/keystone/db";
import { buildExport } from "@/lib/keystone/export";
import { log } from "@/lib/keystone/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET ?ids=1,2,3 (default: every approved item) → zip of approved solutions. */
export async function GET(req: NextRequest) {
  const user = await userFromToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!user || !can.export(user.role)) return new NextResponse("Not allowed", { status: 403 });
  const { Item } = await ks();
  const asked = req.nextUrl.searchParams.get("ids")?.split(",").filter(Boolean);
  const scope = req.nextUrl.searchParams.get("include") === "delivered" ? ["approved", "delivered"] : ["approved"];
  const q: Record<string, unknown> = { stage: { $in: scope } };
  if (asked?.length) q.itemId = { $in: asked };
  const ids = (await Item.find(q).select("itemId").lean()).map((r) => r.itemId);
  if (!ids.length) return new NextResponse("No approved items to download.", { status: 404 });
  const data = await buildExport(ids);
  for (const id of ids) {
    await log({ itemId: id, type: "stage", body: "Downloaded in the SOLARO package.", ...user });
  }
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="keystone-approved-${stamp}-${ids.length}-items.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
