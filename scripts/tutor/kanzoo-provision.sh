#!/usr/bin/env bash
# kanzoo-provision.sh — provision the Kanzoo / DUC Academy sandbox partner and
# delete the "Deploy Test (ignore)" sandbox lead. Runs from the laptop.
#
#   ./scripts/tutor/kanzoo-provision.sh            # dry run: shows what it would do
#   ./scripts/tutor/kanzoo-provision.sh --write    # apply, then verify live
#   ./scripts/tutor/kanzoo-provision.sh --sample   # only re-mint the 7-day sample embed URL
#   TEACHER_ID=ms-priya-nair ./scripts/tutor/kanzoo-provision.sh --sample   # with another persona
#
# The partner secret is generated ONCE and kept at ~/.evelyn/partners/kanzoo.secret
# (mode 600). Re-running reuses it, so the script is idempotent. Nothing here
# prints the secret except the final "send via WhatsApp" block on --write.
set -euo pipefail

PARTNER_ID="${PARTNER_ID:-kanzoo}"
PARTNER_NAME="${PARTNER_NAME:-Kanzoo Global (DUC Academy)}"
SERVER="root@84.247.185.169"
REMOTE_DIR="/root/evelyn-tutor/apps/tutor"
ENGINE="https://www.evelynlearning.com"
EMBED="https://tutor.evelynlearning.com/embed"
MODE="${1:---dry-run}"

HERE="$(cd "$(dirname "$0")" && pwd)"
SECRET_DIR="$HOME/.evelyn/partners"
SECRET_FILE="$SECRET_DIR/$PARTNER_ID.secret"
mkdir -p "$SECRET_DIR"; chmod 700 "$SECRET_DIR"
if [ ! -s "$SECRET_FILE" ]; then
  openssl rand -base64 48 | tr -d '\n' > "$SECRET_FILE"   # 64 chars, url-safe enough for JSON
  chmod 600 "$SECRET_FILE"
  echo "generated new partner secret -> $SECRET_FILE"
else
  echo "reusing partner secret from $SECRET_FILE"
fi
SECRET="$(cat "$SECRET_FILE")"
EXAMPLES="$HERE/../../docs/whitelabel/kanzoo/examples"

mint_sample() {
  local teacher="${TEACHER_ID:-ms-elena-vasquez}"
  echo "== mint a sample embed token (valid 7 days, persona $teacher) and print a test URL"
  local token
  token=$(PARTNER_ID="$PARTNER_ID" PARTNER_SECRET="$SECRET" node "$EXAMPLES/sign-embed-token.js" \
    --student_id sandbox-student-1 --student_name Ayaan --subject math --level "Grade 6" \
    --topic "Ratios and unit rates" --session_goal concept-review --max_duration_minutes 20 \
    --teacher "$teacher" --ttl_hours 168)
  echo "$EMBED?token=$token" > "$SECRET_DIR/$PARTNER_ID.sample-embed-url.txt"
  echo "  sample URL saved to $SECRET_DIR/$PARTNER_ID.sample-embed-url.txt"
  echo "  open it in a browser to run a real sandbox session as partner '$PARTNER_ID'."
}

if [ "$MODE" = "--sample" ]; then mint_sample; exit 0; fi   # re-mint only, no remote step

echo "== remote: upload + run provisioning ($MODE)"
REMOTE_JS="$REMOTE_DIR/.kanzoo-provision-remote.js"
echo "== remote preflight"
ssh -o StrictHostKeyChecking=no "$SERVER" "cd $REMOTE_DIR || { echo 'REMOTE_DIR missing'; exit 1; }; \
  test -f .env.local && echo '.env.local: present' || { echo '.env.local: MISSING'; exit 1; }; \
  echo \"node: \$(node -v)\"; \
  node -e \"console.log('mongoose:', require.resolve('mongoose', {paths:['$REMOTE_DIR','$REMOTE_DIR/.next/standalone','/root/evelyn-tutor']}))\" \
    || { echo 'mongoose NOT resolvable from the app tree'; exit 1; }"
ssh -o StrictHostKeyChecking=no "$SERVER" "cat > $REMOTE_JS" < "$HERE/kanzoo-provision-remote.js"
# Secret travels over stdin, never on a command line / in the box's process list.
printf '%s' "$SECRET" | ssh -o StrictHostKeyChecking=no "$SERVER" \
  "cd $REMOTE_DIR && PARTNER_ID='$PARTNER_ID' PARTNER_NAME='$PARTNER_NAME' LEAD_NAME_PATTERN='Deploy Test' PARTNER_SECRET=\"\$(cat)\" node $REMOTE_JS $MODE"

if [ "$MODE" != "--write" ]; then
  echo; echo "dry run finished. Re-run with --write to apply."; exit 0
fi

echo; echo "== verify 1/3: registry resolves the partner for EMBED tokens (garbage-signature probe, no secret needed)"
probe() {  # $1 = partner id → prints the engine's rejection reason
  local hdr payload
  hdr=$(printf '{"alg":"HS256","typ":"JWT"}' | openssl base64 -A | tr '+/' '-_' | tr -d '=')
  payload=$(printf '{"partner_id":"%s","student_id":"probe"}' "$1" | openssl base64 -A | tr '+/' '-_' | tr -d '=')
  curl -sS -H "x-embed-token: $hdr.$payload.deadbeef" "$ENGINE/api/tutor/session-usage?sessionId=probe" | head -c 200; echo
}
echo -n "  $PARTNER_ID            -> "; probe "$PARTNER_ID"                 # expect: bad signature
echo -n "  zzz-not-a-real-partner -> "; probe "zzz-not-a-real-partner"     # expect: unknown partner (negative control)
echo "  (expected: '$PARTNER_ID' says \"bad signature\" = secret resolved; the control says \"unknown partner\". If '$PARTNER_ID' still says unknown partner, wait 60s — registry cache — and re-run.)"

echo; echo "== verify 2/3: a REAL signed portal-API request (expects HTTP 200 + [] )"
for attempt in 1 2 3 4; do
  code=$(PARTNER_ID="$PARTNER_ID" PARTNER_SECRET="$SECRET" node "$EXAMPLES/portal-api-client.js" \
          GET "/api/portal/v1/gaps?studentId=sandbox-probe" --status-only 2>/dev/null || echo "ERR")
  echo "  attempt $attempt: HTTP $code"
  [ "$code" = "200" ] && break
  [ "$attempt" -lt 4 ] && { echo "  waiting 20s for the registry cache..."; sleep 20; }
done

echo; echo "== verify 3/3"; mint_sample

cat <<EOF

== send to Muneeb via WhatsApp (NOT email) ==
Sandbox credentials — DUC Academy / Kanzoo
partner_id: $PARTNER_ID
partner_secret: $SECRET
Use the same secret to sign embed tokens (HS256 JWT) and portal API requests (HMAC-SHA256). Keep it server-side only.
EOF
