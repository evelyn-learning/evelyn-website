import { readFile, stat } from "node:fs/promises";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/keystone/config";
import { userFromToken } from "@/lib/keystone/auth";
import { MIME } from "@/lib/keystone/assets";
import { canSeeAnimation, parseVersion } from "@/lib/keystone/animreview/pure";
import { animatedFile } from "@/lib/keystone/animreview/files";
import { animationStatus } from "@/lib/keystone/animreview/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const notFound = () => new NextResponse("Not found", { status: 404 });

/**
 * Serves one published version of an animated solution (html + audio). Evelyn only until the version is
 * released; anyone else gets 404 (the same as a version that does not exist). Range for audio seeking.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ itemId: string; version: string; path: string[] }> }) {
  const user = await userFromToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!user) return new NextResponse("Not signed in", { status: 401 });
  const { itemId, version, path } = await params;
  const v = parseVersion(version);
  if (v === null) return notFound();
  let rel: string;
  try {
    rel = path.map(decodeURIComponent).join("/");
  } catch {
    return new NextResponse("Not found", { status: 404 }); // a malformed % sequence
  }
  const file = animatedFile(itemId, v, rel);
  if (!file) return notFound();
  if (!canSeeAnimation(user.role, await animationStatus(itemId, v))) return notFound();
  let size: number;
  try {
    const s = await stat(file);
    if (!s.isFile()) return notFound();
    size = s.size;
  } catch {
    return notFound();
  }
  const type = MIME[file.split(".").pop()!.toLowerCase()] ?? "application/octet-stream";
  const headers: Record<string, string> = {
    "Content-Type": type,
    "Cache-Control": "private, no-cache",
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
  };
  const data = await readFile(file);
  const range = req.headers.get("range")?.match(/bytes=(\d*)-(\d*)/);
  if (range && type.startsWith("audio/")) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start > end) return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    return new NextResponse(new Uint8Array(data.subarray(start, end + 1)), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
    });
  }
  return new NextResponse(new Uint8Array(data), { headers: { ...headers, "Content-Length": String(size) } });
}
