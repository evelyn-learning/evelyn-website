import { readFile } from "node:fs/promises";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/keystone/config";
import { userFromToken } from "@/lib/keystone/auth";
import { shotFile } from "@/lib/keystone/animreview/files";
import { canSeeShots } from "@/lib/keystone/animreview/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A picture attached to an animation flag. Evelyn sees every flag's pictures; a Castle Rock user only those of
 * flags raised by Castle Rock. Anything else is 404, the same as a picture that does not exist.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ flagId: string; file: string }> }) {
  const user = await userFromToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!user) return new NextResponse("Not signed in", { status: 401 });
  const { flagId, file } = await params;
  const full = shotFile(flagId, file);
  if (!full || !(await canSeeShots(flagId, user.role))) return new NextResponse("Not found", { status: 404 });
  try {
    const data = await readFile(full);
    return new NextResponse(new Uint8Array(data), {
      headers: { "Content-Type": "image/png", "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff", "Content-Length": String(data.length) },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
