#!/bin/bash
# Deploy the tutor engine to GreenApple's OWN instance on the US box.
#
#   this script -> apps/tutor -> /root/evelyn-tutor-gac -> pm2 evelyn-tutor-gac -> :3008
#   served at https://session.evelynlearning.com (GreenApple's ENGINE_BASE_URL / ENGINE_EMBED_URL)
#
# Why a separate instance: GAC accepts a named build and it must not move when
# the shared engine (:3007) is deployed for other partners. Same mechanism as
# deploy-tutor-demo.sh; every safety step of deploy-tutor.sh still runs.
#
# GAC's env differs from the shared engine's in three keys, and deploy-tutor.sh
# uploads ./.env.local.production verbatim, so for the length of this deploy
# that file is a GAC copy:
#   ENABLE_LEARNER_MODEL_SNAPSHOT=false   (no learner-model snapshots for GAC)
#   PRACTICE_DRAWN_ANSWER_PARTNERS=greenapple   (student-drawn answer items)
#   TUTOR_PARTNER_BRAIN_FALLBACK=off   (student content goes to the primary provider only;
#                                       the privacy note names one provider — 2026-10-27)
# The original (usually a symlink to the main checkout's file) is put back on exit.
set -euo pipefail
cd "$(dirname "$0")"

ENV_FILE=".env.local.production"
SAVED=".env.local.production.pre-gac"
[ -e "$ENV_FILE" ] || { echo "ERROR: $ENV_FILE missing"; exit 1; }
[ -e "$SAVED" ] && { echo "ERROR: $SAVED exists — a previous GAC deploy did not restore it. mv $SAVED $ENV_FILE first."; exit 1; }

mv "$ENV_FILE" "$SAVED"
restore() { rm -f "$ENV_FILE"; mv "$SAVED" "$ENV_FILE"; echo "Restored $ENV_FILE"; }
trap restore EXIT

grep -vE '^(ENABLE_LEARNER_MODEL_SNAPSHOT|PRACTICE_DRAWN_ANSWER_PARTNERS|TUTOR_PARTNER_BRAIN_FALLBACK)=' "$SAVED" > "$ENV_FILE"
printf '\n# GreenApple instance (deploy-tutor-gac.sh)\nENABLE_LEARNER_MODEL_SNAPSHOT=false\nPRACTICE_DRAWN_ANSWER_PARTNERS=greenapple\nTUTOR_PARTNER_BRAIN_FALLBACK=off\n' >> "$ENV_FILE"

export TUTOR_DEPLOY_REMOTE_DIR="/root/evelyn-tutor-gac"
export TUTOR_DEPLOY_ZIP_FILE="evelyn-tutor-gac.zip"
export TUTOR_DEPLOY_PM2_NAME="evelyn-tutor-gac"
export TUTOR_DEPLOY_PM2_PORT="3008"
export TUTOR_DEPLOY_TMP_TAG="tutor-gac"

./deploy-tutor.sh "$@"
