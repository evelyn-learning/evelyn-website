import { NextRequest, NextResponse } from "next/server";
import { checkBeaconAuth } from "./ingest-auth";

/** Returns an error response when the request is not Beacon's, else null. */
export function beaconGuard(request: NextRequest): NextResponse | null {
  const status = checkBeaconAuth(request.headers.get("authorization"), process.env.BEACON_INGEST_TOKEN);
  if (status === 503) return NextResponse.json({ error: "beacon ingest disabled" }, { status: 503 });
  if (status === 401) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return null;
}
