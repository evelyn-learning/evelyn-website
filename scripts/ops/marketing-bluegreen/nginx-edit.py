#!/usr/bin/env python3
"""nginx-edit.py <file> <expected count> [--check]

The one edit the marketing blue-green deploy needs in an nginx site file: every

    proxy_pass http://127.0.0.1:3001;

becomes

    proxy_pass http://evelyn_marketing;
    # evelyn_marketing = the live slot, then the other slot as backup (conf.d/evelyn-marketing-upstream.conf).
    # A refused connect is retried on the backup; nothing was sent, so a POST is safe. Never add non_idempotent.
    proxy_next_upstream error timeout;
    proxy_next_upstream_tries 2;

with the line's own indentation. Refuses (exit 2, file untouched) unless exactly <expected count> such lines exist.
Used by apply-nginx.sh on the server, and locally to print the diff first. --check only counts.
"""
import re
import sys

OLD = re.compile(r"^(\s*)proxy_pass http://127\.0\.0\.1:3001;\s*$")


def edit(text: str):
    out, n = [], 0
    for line in text.splitlines(keepends=True):
        m = OLD.match(line)
        if not m:
            out.append(line)
            continue
        n += 1
        ind = m.group(1)
        out.append(f"{ind}proxy_pass http://evelyn_marketing;\n")
        out.append(f"{ind}# evelyn_marketing = the live slot, then the other slot as backup (conf.d/evelyn-marketing-upstream.conf).\n")
        out.append(f"{ind}# A refused connect is retried on the backup; nothing was sent, so a POST is safe. Never add non_idempotent.\n")
        out.append(f"{ind}proxy_next_upstream error timeout;\n")
        out.append(f"{ind}proxy_next_upstream_tries 2;\n")
    return "".join(out), n


def main():
    if len(sys.argv) < 3:
        print(__doc__, file=sys.stderr)
        return 2
    path, want = sys.argv[1], int(sys.argv[2])
    text = open(path, encoding="utf-8").read()
    new, n = edit(text)
    if n != want:
        print(f"nginx-edit: {path}: found {n} line(s) 'proxy_pass http://127.0.0.1:3001;', expected {want}. File untouched.", file=sys.stderr)
        return 2
    if "--check" in sys.argv[3:]:
        return 0
    with open(path, "w", encoding="utf-8") as f:  # in place: the file keeps its inode, owner and mode
        f.write(new)
    print(f"nginx-edit: {path}: {n} line(s) changed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
