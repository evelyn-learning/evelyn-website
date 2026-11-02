# nginx AI-agent log (US box, applied 2026-11-02)

Beacon (academy `apps/api/src/services/beacon/ai-visibility.ts`) parses this log to
count AI assistants fetching our pages. Rotation: covered by `/etc/logrotate.d/nginx`
(`/var/log/nginx/*.log`, daily, 14 kept) — `ai-fetch.log.1` is yesterday's.

`/etc/nginx/conf.d/ai-fetch.conf`:

    map $http_user_agent $is_ai_agent {
        default 0;
        ~*(ChatGPT-User|OAI-SearchBot|GPTBot|Claude-User|Claude-SearchBot|ClaudeBot|Perplexity-User|PerplexityBot|meta-externalagent|Applebot-Extended|bingbot) 1;
    }
    log_format ai_fetch '$time_iso8601 $host $remote_addr "$request" $status "$http_user_agent"';

In `/etc/nginx/sites-available/evelynlearning`, first `server {` block, after `server_name`:

    access_log /var/log/nginx/ai-fetch.log ai_fetch if=$is_ai_agent;

Backup of the site file before the change: `/root/nginx-evelynlearning.bak-2026-11-02`.
Crimsora / evelyntutor: add the same `access_log` line to their server blocks at their rollout.
User-agents are spoofable (scanners send "ChatGPT-User" at `/api/.env`) — Beacon verifies IPs
against the vendors' published lists and drops non-pages.
