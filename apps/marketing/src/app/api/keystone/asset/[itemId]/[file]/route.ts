import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/keystone/config";
import { userFromToken } from "@/lib/keystone/auth";
import { MIME, readAsset } from "@/lib/keystone/assets";

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ itemId: string; file: string }> }) {
  const user = await userFromToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!user) return new NextResponse("Not signed in", { status: 401 });
  const { itemId, file } = await params;
  const data = await readAsset(itemId, file);
  if (!data) return new NextResponse("Not found", { status: 404 });
  const ext = file.split(".").pop()!.toLowerCase();
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
