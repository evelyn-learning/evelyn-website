#!/usr/bin/env bash
# Is anything still served by the old German box (84.247.185.169) before it is deleted?
# Read-only. Run: bash scripts/ops/germany-traffic-check.sh
#  1. probes every known domain through public DNS/Cloudflare with a unique path and reports which
#     ones land on Germany (should be none) — and confirms they land on the US box instead;
#  2. summarises Germany's nginx traffic for the last 24 h (per hour, Cloudflare-sourced, 200s),
#     with the requested hostname when the log format records it;
#  3. lists running pm2 apps, open listeners, and clients connected to Germany's mongod.
set -u
DE=84.247.185.169
US=85.239.239.134
DOMAINS="crimsora.com www.crimsora.com evelyntutor.com www.evelyntutor.com stayfari.com www.stayfari.com
app.stayfari.com experts.stayfari.com rydovia.com www.rydovia.com api.rydovia.com thesacredtree.org
www.thesacredtree.org evelynedu.com www.evelynedu.com pagevault.us www.pagevault.us api.pagevault.us
admin.pagevault.us platform-api.pagevault.us ayont.store cattlejack.shop crumbleandflow.shop germania.world
oppodusk.shop sandpiperpath.site stage.rydovia.com evelynlearning.com www.evelynlearning.com tutor.evelynlearning.com
session.evelynlearning.com greenapple.evelynlearning.com"

tag="deprobe-$(date +%s)"
for h in $DOMAINS; do
  curl -s -o /dev/null -m 8 "https://$h/$tag-$h"
  curl -s -o /dev/null -m 8 "http://$h/$tag-$h"
done
sleep 3
n=$(echo $DOMAINS | wc -w | tr -d ' ')
echo "== 1. Domain probes ($n domains, tag $tag)"
de=$(ssh -o ConnectTimeout=15 root@$DE "grep -rho '$tag-[a-z.-]*' /var/log/nginx/ 2>/dev/null | sed 's/$tag-//' | sort -u")
us=$(ssh -o ConnectTimeout=15 root@$US "grep -rho '$tag-[a-z.-]*' /var/log/nginx/ 2>/dev/null | sed 's/$tag-//' | sort -u | wc -l")
echo "landed on GERMANY: ${de:-none}"
echo "landed on US box : $us of $n (stayfari.com apex is redirected at Cloudflare, so $((n-1)) is normal)"

echo
echo "== 2. Germany nginx, last 24 h"
ssh -o ConnectTimeout=15 root@$DE 'bash -s' <<'EOF'
L=/var/log/nginx/access.log
since=$(date -d "-24 hours" +%s)
awk -v s="$since" '
  BEGIN{split("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec",m," "); for(i in m) mi[m[i]]=i}
  { t=substr($4,2); split(t,a,"[/:]"); ts=mktime(a[3]" "mi[a[2]]" "a[1]" "a[4]" "a[5]" "a[6]); if (ts>=s) print }' $L > /tmp/de24.log
echo "requests: $(wc -l < /tmp/de24.log)   200s: $(awk '$9==200' /tmp/de24.log | wc -l)"
cf='^(173\.245\.|103\.2[12]\.|103\.31\.|141\.101\.|108\.162\.|190\.93\.|188\.114\.|197\.234\.|198\.41\.|162\.15[89]\.|104\.(1[6-9]|2[0-9]|3[01])\.|172\.(6[4-9]|7[01])\.|131\.0\.72\.)'
echo "via Cloudflare: $(grep -cE "$cf" /tmp/de24.log)  (a Cloudflare-proxied hostname still pointing here, if non-zero)"
echo "per hour (server time):"; awk '{print substr($4,14,2)}' /tmp/de24.log | sort | uniq -c | awk '{printf "%s:%s ",$2,$1} END{print ""}'
if grep -qE '(^| )host=' /tmp/de24.log; then
  echo "top hostnames:"; grep -oE '(^| )host=[^ ]*' /tmp/de24.log | sort | uniq -c | sort -rn | head -15
else
  echo "(hostnames not logged — the default log format omits them)"
fi
echo "top paths returning 200:"; awk '$9==200{print $7}' /tmp/de24.log | cut -c1-70 | sort | uniq -c | sort -rn | head -8
rm -f /tmp/de24.log
echo
echo "== 3. Germany processes"
echo "pm2 online: $(pm2 jlist 2>/dev/null | python3 -c 'import json,sys; print(" ".join(p["name"] for p in json.load(sys.stdin) if p["pm2_env"]["status"]=="online") or "none")')"
echo "listening: $(ss -tlnH | awk '{print $4}' | sort -u | tr '\n' ' ')"
echo "mongod clients (not mongod itself):"; ss -tnpH state established '( sport = :2710 )' | grep -v '"mongod"' | sed -E 's/.*users:\(\("([^"]+)",pid=([0-9]+).*/  \1 pid \2/' | sort | uniq -c
EOF
