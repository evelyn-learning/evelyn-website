import Link from "next/link";
import { ITEM_TYPE_LABEL, STAGE_LABEL, type Stage } from "@/lib/keystone/config";
import type { ActivityDoc } from "@/lib/keystone/db";
import type { ItemRow } from "@/lib/keystone/queries";

export function StageChip({ stage }: { stage: Stage }) {
  return <span className={`ks-chip s-${stage}`}>{STAGE_LABEL[stage]}</span>;
}

export function ago(d: Date | string | undefined): string {
  if (!d) return "";
  const t = new Date(d).getTime();
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  if (s < 7 * 86400) return `${Math.round(s / 86400)} d ago`;
  return new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

/** Whether the item still needs Castle Rock to confirm something (no key, or our note). */
export function needsConfirm(r: Pick<ItemRow, "keySource" | "reviewNote" | "evelynAnswer">): string | null {
  if (!r.evelynAnswer && r.keySource === "evelyn") return "Item incomplete";
  if (r.keySource === "evelyn") return "Answer to confirm";
  return null;
}

export function ItemsTable({
  rows,
  base,
  verdicts,
  showStage = true,
}: {
  rows: ItemRow[];
  base: string;
  verdicts?: Map<string, { verdict: string; body?: string }>;
  showStage?: boolean;
}) {
  if (!rows.length) return <div className="ks-empty">Nothing here.</div>;
  return (
    <div className="ks-table">
      <table className="ks-list">
        <thead>
          <tr>
            <th>Item</th>
            <th>Subject</th>
            <th>Type</th>
            <th>Topic</th>
            {showStage && <th>Status</th>}
            <th>Version</th>
            {verdicts && <th>Last review note</th>}
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const flag = needsConfirm(r);
            const v = verdicts?.get(r.itemId);
            return (
              <tr key={r.itemId}>
                <td>
                  <Link href={`${base}/item/${r.itemId}`}>
                    <b>{r.itemId}</b>
                  </Link>
                  {r.showcase && <span className="ks-chip" style={{ marginLeft: 6 }}>Showcase</span>}
                  {r.player?.entry && (
                    <div>
                      <span className="ks-chip" title="Has an animated, voiced version">▶ Animated</span>
                    </div>
                  )}
                </td>
                <td>
                  {r.subject}
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>{r.course}</div>
                </td>
                <td>{ITEM_TYPE_LABEL[r.itemType] ?? r.itemType}</td>
                <td>
                  {r.topic}
                  {flag && (
                    <div>
                      <span className="ks-chip flag">{flag}</span>
                    </div>
                  )}
                </td>
                {showStage && (
                  <td>
                    <StageChip stage={r.stage} />
                  </td>
                )}
                <td>{r.version ? `v${r.version}` : "–"}</td>
                {verdicts && (
                  <td style={{ maxWidth: 280, color: "var(--muted)", fontSize: 13 }}>
                    {v?.body ? v.body.slice(0, 140) + (v.body.length > 140 ? "…" : "") : "–"}
                  </td>
                )}
                <td style={{ color: "var(--muted)", fontSize: 13, whiteSpace: "nowrap" }}>{ago(r.lastActivityAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const VERB: Record<string, string> = {
  verdict: "",
  comment: "commented on",
  revision: "updated the solution for",
  stage: "changed the status of",
  upload: "added",
};

export function Feed({ rows, base, empty = "No activity yet." }: { rows: ActivityDoc[]; base: string; empty?: string }) {
  if (!rows.length) return <div className="ks-empty">{empty}</div>;
  return (
    <ul className="ks-feed">
      {rows.map((a, i) => (
        <li key={i}>
          <b>{a.name}</b>{" "}
          {a.type === "verdict"
            ? a.verdict === "approved"
              ? "approved"
              : "asked for changes on"
            : a.type === "revision" && a.version === 1
              ? "wrote the solution for"
              : a.type === "stage" && a.body?.startsWith("Downloaded")
                ? "downloaded"
                : a.type === "stage" && a.body?.startsWith("Delivered")
                  ? "marked as delivered to SOLARO"
                  : a.type === "stage" && a.body
                    ? `${a.body.replace(/\.$/, "").replace(/^Stage set to/, "set the status to").toLowerCase()} on`
                    : VERB[a.type]}{" "}
          <Link href={`${base}/item/${a.itemId}`}>item {a.itemId}</Link>
          {a.version ? <span style={{ color: "var(--muted)" }}> (v{a.version})</span> : null}{" "}
          <span className="when">· {ago(a.createdAt)}</span>
          {a.body && (a.type === "verdict" || a.type === "comment") && <div className="ks-quote">{a.body}</div>}
        </li>
      ))}
    </ul>
  );
}
