import Link from "next/link";
import { ROLE_LABEL, can } from "@/lib/keystone/config";
import type { KsUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";

export async function TopBar({ user, on }: { user: KsUser; on?: "home" | "items" | "upload" | "export" }) {
  const b = await ksBase();
  const links: { key: typeof on; href: string; label: string }[] = [
    { key: "home", href: b || "/", label: "Overview" },
    { key: "items", href: `${b}/items`, label: "All items" },
    { key: "upload", href: `${b}/upload`, label: "Upload items" },
  ];
  if (can.export(user.role)) links.push({ key: "export", href: `${b}/export`, label: "Approved for SOLARO" });
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
        <div className="ks-who">
          <span>
            {user.name} · {ROLE_LABEL[user.role]}
          </span>
          <a className="ks-btn" style={{ padding: "3px 10px", fontSize: 13 }} href="/api/keystone/signout">
            Sign out
          </a>
        </div>
      </div>
    </header>
  );
}
