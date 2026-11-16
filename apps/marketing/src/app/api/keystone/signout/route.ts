import { NextResponse, type NextRequest } from "next/server";
import { KEYSTONE_HOSTS, SESSION_COOKIE } from "@/lib/keystone/config";
import { ks } from "@/lib/keystone/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    const { Session } = await ks();
    await Session.deleteOne({ token });
  }
  const host = req.headers.get("host") || "";
  const onKs = KEYSTONE_HOSTS.includes(host.split(":")[0]);
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const res = NextResponse.redirect(new URL(onKs ? "/login" : "/keystone/login", `${proto}://${host}`), 303);
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
