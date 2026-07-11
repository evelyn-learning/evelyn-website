#!/usr/bin/env bash
#
# Ship AP English Language — the deferred live-DB steps, in one guarded run.
#
# RUN THIS YOURSELF (not via an agent) AFTER:
#   1. the Unit-1 live-test gate passes, and
#   2. you've merged eng-lang-vertical-slice + eng-lang-units-2-9 to main
#      (or run it from the eng-lang-units-2-9 worktree pre-merge — set ENGINE_DIR).
#
# It performs TWO live-DB writes (both idempotent, safe to re-run):
#   A. Seed the 99 AP-English-Language MCQs into the engine Mongo (evelyn).
#   B. Regenerate the academy mappings + ingest the course into academy_portal.
# It prints both Mongo targets and requires you to type 'ship' before writing.
#
# Overridable:  ENGINE_DIR=<engine repo>  ACADEMY_DIR=<academy repo>  ./scripts/ship-ap-english-language.sh
#
set -euo pipefail

ENGINE_DIR="${ENGINE_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
ACADEMY_DIR="${ACADEMY_DIR:-/Users/luke/Dev/academy}"
COURSE="ap-english-language"

mask() { sed -E 's#://([^:/@]+):[^@]*@#://\1:****@#'; }   # hide password in a mongo URI

echo "──────────────────────────────────────────────────────────"
echo " Ship AP English Language — LIVE DB writes"
echo "──────────────────────────────────────────────────────────"

# ── Preconditions ────────────────────────────────────────────
[ -d "$ENGINE_DIR" ]  || { echo "✗ ENGINE_DIR not found: $ENGINE_DIR"; exit 1; }
[ -d "$ACADEMY_DIR" ] || { echo "✗ ACADEMY_DIR not found: $ACADEMY_DIR"; exit 1; }
[ -f "$ENGINE_DIR/.env.local" ] || { echo "✗ $ENGINE_DIR/.env.local missing (needs MONGODB_URI + ANTHROPIC_API_KEY)"; exit 1; }

BANK_DIR="$ENGINE_DIR/src/data/problem-bank/$COURSE"
BANK_FILES=$(ls "$BANK_DIR"/u*.json 2>/dev/null | wc -l | tr -d ' ')
[ "$BANK_FILES" -ge 1 ] || { echo "✗ no $COURSE bank JSON found under $BANK_DIR"; exit 1; }

ENGINE_MONGO=$(grep -E '^MONGODB_URI=' "$ENGINE_DIR/.env.local" | head -1 | cut -d= -f2- | tr -d '"' | mask)
ACAD_MONGO=$( (grep -hE '^MONGODB_URI=' "$ACADEMY_DIR"/.env "$ACADEMY_DIR"/.env.local 2>/dev/null || true) | head -1 | cut -d= -f2- | tr -d '"' | mask)

echo "  Engine repo : $ENGINE_DIR"
echo "  Bank files  : $BANK_FILES unit file(s) in $BANK_DIR"
echo "  Engine Mongo: ${ENGINE_MONGO:-<unset>}   ← the 99 MCQs write here (confirm this is the intended DB / tunnel!)"
echo "  Academy repo: $ACADEMY_DIR"
echo "  Acad. Mongo : ${ACAD_MONGO:-<from academy env>}   ← Course/CourseNodes write here"
echo ""
read -r -p "  These are LIVE writes. Type 'ship' to proceed: " CONFIRM
[ "$CONFIRM" = "ship" ] || { echo "  aborted — nothing written."; exit 1; }

# ── A. Engine: MCQ bank ──────────────────────────────────────
echo ""
echo "── A. MCQ bank → engine Mongo ────────────────────────────"
cd "$ENGINE_DIR"
echo "  [1/2] dry-run validate + Sonnet verify (no write)…"
npm run seed:problem-bank -- --course="$COURSE" --dry-run
echo "  [2/2] seeding (verify-at-ingest → provenance stamp)…"
# (add --no-verify for a faster re-seed of already-verified content)
npm run seed:problem-bank -- --course="$COURSE"

# ── B. Academy: mappings + ingest ────────────────────────────
echo ""
echo "── B. Academy course → academy_portal ───────────────────"
cd "$ACADEMY_DIR"
echo "  [1/2] regenerate mappings (from ENGINE_DIR)…"
ENGINE_REPO="$ENGINE_DIR" npm run seed:gen
echo "  [2/2] ingest (idempotent upsert; published state from mappings)…"
npm run ingest

# ── Manual follow-ups ────────────────────────────────────────
cat <<EOF

──────────────────────────────────────────────────────────
 ✅ DB writes done. Manual follow-ups (academy web is a PROD build):
   1. Rebuild + restart academy web so the new course shows:
        (cd "$ACADEMY_DIR" && npm run build:web) && restart the :3011 process
   2. Enroll your test account in "AP English Language & Composition"
      (same enrollments step as the Calc BC build).
   3. Verify: the course shows all 9 units with Notes / Practice / Quiz,
      and submitting an FRQ exercises the passage-aware 6-pt rubric.
──────────────────────────────────────────────────────────
EOF
