import { readFile, stat } from "node:fs/promises";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/keystone/config";
import { userFromToken } from "@/lib/keystone/auth";
import { MIME, playerFile } from "@/lib/keystone/assets";

export const runtime = "nodejs";

/** Serves an item's animated player (html + audio) to signed-in users only. Supports Range for audio seeking. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ itemId: string; path: string[] }> }) {
  const user = await userFromToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!user) return new NextResponse("Not signed in", { status: 401 });
  const { itemId, path } = await params;
  const file = playerFile(itemId, path.map(decodeURIComponent).join("/"));
  if (!file) return new NextResponse("Not found", { status: 404 });
  let size: number;
  try {
    size = (await stat(file)).size;
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
  const type = MIME[file.split(".").pop()!.toLowerCase()] ?? "application/octet-stream";
  const headers: Record<string, string> = {
    "Content-Type": type,
    "Cache-Control": "private, max-age=3600",
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
  };
  const data = await readFile(file);
  const range = req.headers.get("range")?.match(/bytes=(\d*)-(\d*)/);
  if (range && type.startsWith("audio/")) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    return new NextResponse(new Uint8Array(data.subarray(start, end + 1)), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
    });
  }
  return new NextResponse(new Uint8Array(data), { headers: { ...headers, "Content-Length": String(size) } });
}
