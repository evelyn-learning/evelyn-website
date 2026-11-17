import { headers } from "next/headers";
import { KEYSTONE_HOSTS } from "./config";

/** True when the request came in on the Keystone host (src/proxy.ts strips /keystone there). */
export async function onKeystoneHost(): Promise<boolean> {
  const host = ((await headers()).get("host") || "").split(":")[0];
  return KEYSTONE_HOSTS.includes(host);
}

/** URL path for a Keystone page: "/item/1" on the Keystone host, "/keystone/item/1" elsewhere. */
export async function ksHref(path: string): Promise<string> {
  const base = (await onKeystoneHost()) ? "" : "/keystone";
  if (path === "/") return base || "/";
  return `${base}${path}`;
}

export async function ksBase(): Promise<string> {
  return (await onKeystoneHost()) ? "" : "/keystone";
}
