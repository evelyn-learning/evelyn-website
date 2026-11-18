import Link from "next/link";
import { ROLE_LABEL, can } from "@/lib/keystone/config";
import type { KsUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { waitingForOwnerCount } from "@/lib/keystone/queries";

export async function TopBar({ user, on }: { user: KsUser; on?: "home" | "queue" | "animated" | "items" | "upload" | "export" | "account" }) {
  const b = await ksBase();
  const links: { key: typeof on; href: string; label: string }[] = [
    { key: "home", href: b || "/", label: "Overview" },
    // Evelyn only (decided here on the server; the count query also returns 0 for any other role).
    ...(user.role === "evelyn" ? [{ key: "queue" as const, href: `${b}/queue`, label: `Queue · ${await waitingForOwnerCount(user.role)}` }] : []),
    ...(user.role === "evelyn" ? [{ key: "animated" as const, href: `${b}/animated`, label: "Animated" }] : []),
    { key: "items", href: `${b}/items`, label: "All items" },
    { key: "upload", href: `${b}/upload`, label: "Upload items" },
  ];
  if (can.export(user.role)) links.push({ key: "export", href: `${b}/export`, label: "Download for SOLARO" });
  return (
    <header className="ks-top">
      <div className="ks-top-in">
        <Link href={b || "/"} className="ks-brand">
          Keystone<small>Castle Rock × Evelyn</small>
        </Link>
        <nav className="ks-nav">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={l.key === on ? "on" : ""}>
              {l.label}
            </Link>
          ))}
        </nav>
        <form method="get" action={`${b}/items`} className="ks-find" role="search">
          <input type="search" name="q" placeholder="Find item #" aria-label="Find an item by number" inputMode="search" />
        </form>
        <div className="ks-who">
          <span>
            {user.name} · {ROLE_LABEL[user.role]}
          </span>
          <Link href={`${b}/account`} style={{ fontSize: 13, fontWeight: on === "account" ? 700 : 400 }}>
            Change password
          </Link>
          <a className="ks-btn" style={{ padding: "3px 10px", fontSize: 13 }} href="/api/keystone/signout">
            Sign out
          </a>
        </div>
      </div>
    </header>
  );
}
