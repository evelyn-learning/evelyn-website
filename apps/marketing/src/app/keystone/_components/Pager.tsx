import Link from "next/link";

export const PAGE_SIZE = 50;

/** Clamps a requested page to 1…pages. */
export function pageOf(raw: string | undefined, total: number, size = PAGE_SIZE) {
  const pages = Math.max(1, Math.ceil(total / size));
  const page = Math.min(pages, Math.max(1, Number(raw) || 1));
  return { page, pages, skip: (page - 1) * size, from: total ? (page - 1) * size + 1 : 0, to: Math.min(total, page * size) };
}

/** Compact page links: ‹ Previous 1 … 4 5 [6] 7 8 … 20 Next ›. Renders nothing for a single page. */
export function Pager({ page, pages, href }: { page: number; pages: number; href: (page: number) => string }) {
  if (pages <= 1) return null;
  const nums: (number | "…")[] = [];
  for (let n = 1; n <= pages; n++) {
    if (n === 1 || n === pages || Math.abs(n - page) <= 2) nums.push(n);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  return (
    <nav className="ks-pager" aria-label="Pages">
      {page > 1 ? <Link href={href(page - 1)}>‹ Previous</Link> : <span className="off">‹ Previous</span>}
      {nums.map((n, i) =>
        n === "…" ? (
          <span key={`e${i}`} className="gap">…</span>
        ) : n === page ? (
          <span key={n} className="cur" aria-current="page">{n}</span>
        ) : (
          <Link key={n} href={href(n)}>{n}</Link>
        ),
      )}
      {page < pages ? <Link href={href(page + 1)}>Next ›</Link> : <span className="off">Next ›</span>}
    </nav>
  );
}
