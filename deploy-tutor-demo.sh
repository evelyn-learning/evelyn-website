#!/bin/bash
# Deploy the tutor engine to the SEPARATE DEMO instance on the US box.
#
#   this script -> apps/tutor -> /root/evelyn-tutor-demo -> pm2 evelyn-tutor-demo -> :3009
#   served at https://tutor-demo.evelynlearning.com (nginx site tutor-demo.evelynlearning.com)
#
# Why a separate instance: demo work (bilingual tutor, partner-preview
# features) has to run on prod infrastructure before it is merged to main,
# while the shared engine (:3007, every live partner) and the pinned
# GreenApple engine (:3008) stay untouched. This script only re-points
# deploy-tutor.sh at its own dir / pm2 process / port / tmp files; every
# safety step of that script (lock, env preflight, prune) still runs.
#
# It never touches /root/evelyn-tutor or /root/evelyn-tutor-gac, and never
# restarts any pm2 process but evelyn-tutor-demo.
set -euo pipefail
cd "$(dirname "$0")"

export TUTOR_DEPLOY_REMOTE_DIR="/root/evelyn-tutor-demo"
export TUTOR_DEPLOY_ZIP_FILE="evelyn-tutor-demo.zip"
export TUTOR_DEPLOY_PM2_NAME="evelyn-tutor-demo"
export TUTOR_DEPLOY_PM2_PORT="3009"
export TUTOR_DEPLOY_TMP_TAG="tutor-demo"

exec ./deploy-tutor.sh "$@"
