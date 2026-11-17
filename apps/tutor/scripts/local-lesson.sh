#!/usr/bin/env bash
# local-lesson.sh — a link to take a seeded lesson on the LOCAL engine as a Crimsora student would.
#
#   scripts/local-lesson.sh "relations functions"        # words from the lesson's title or id
#   scripts/local-lesson.sh evelyn.ap.apgov.federalism-foundations.v1
#   PORT=3019 MODE=text STUDENT=local-praveen scripts/local-lesson.sh federalism
#
# The local engine runs in development, so the v2 flag bar (flag + snapshot) is on; flags are saved under
# apps/tutor/.v2-flags/<session>/. Sessions, profiles and practice rows are written to the database in
# .env.local, which on this laptop is the PROD tunnel: the student id is a test one for that reason.
set -euo pipefail
cd "$(dirname "$0")/.."
q="${1:?words from the lesson title, or its plan id}"
seeds=src/lib/tutor/lesson-plan/seeds
file=$(grep -l -i -E "^\s*id: '${q//./\\.}'" $seeds/*.ts 2>/dev/null | head -1 || true)
if [ -z "$file" ]; then
  pat=$(printf '%s' "$q" | sed -E 's/[[:space:]]+/.*/g')
  matches=$(grep -l -i -E "^  (title|id): '.*${pat}" $seeds/*.ts 2>/dev/null || true)
  n=$(printf '%s\n' "$matches" | grep -c . || true)
  if [ "$n" -eq 0 ]; then echo "no seeded lesson matches \"$q\"" >&2; exit 1; fi
  if [ "$n" -gt 1 ]; then echo "several lessons match \"$q\" — be more specific:" >&2; for f in $matches; do echo "  $(grep -m1 -E "^  id: '" "$f" | cut -d"'" -f2)  —  $(grep -m1 -E "^  title: " "$f" | sed -E "s/^  title: ['\"](.*)['\"],?$/\1/")" >&2; done; exit 1; fi
  file=$matches
fi
field() { grep -m1 -E "^  $1: " "$file" | sed -E "s/^  $1: ['\"](.*)['\"],?$/\1/"; }
plan=$(field id); title=$(field title)
token=$(npx tsx scripts/mint-embed-token.ts --partner crimsora --student "${STUDENT:-local-praveen}" --name "${NAME:-Praveen}" \
  --subject "$(field subject)" --level "$(field grade)" --topic "$(field topic)" --plan "$plan" ${MODE:+--mode "$MODE"})
echo "$title  ($plan)"
echo "http://localhost:${PORT:-3019}/tutor-portal/embed?token=$token"
