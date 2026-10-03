#!/usr/bin/env python3
"""Google Ads Keyword Planner research CLI.

Pulls real monthly search volume, 12-month history, competition and
top-of-page bids for seed keywords, either as exact metrics or expanded
into Google's related-keyword ideas.

Auth reuses the Google Ads MCP setup: the authorized-user ADC json at
~/.config/google/ads_adc.json and the developer token from the MCP env
in ~/.claude.json (or GOOGLE_ADS_DEVELOPER_TOKEN).

Usage:
  .venv/bin/python keyword_planner.py ideas   --seeds seeds.txt --geo US,IN,GB --out out/ideas.csv
  .venv/bin/python keyword_planner.py metrics --seeds seeds.txt --geo WORLD   --out out/metrics.csv
  .venv/bin/python keyword_planner.py ideas   --url https://example.com --geo US

--geo WORLD (default) = no geo filter = worldwide volume.
--lang defaults to English (1000).
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import time
from pathlib import Path
from typing import Iterable

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable, DeadlineExceeded
from google.oauth2.credentials import Credentials

ADC_PATH = Path(os.environ.get("GOOGLE_ADS_ADC_PATH", "~/.config/google/ads_adc.json")).expanduser()
CLAUDE_JSON = Path("~/.claude.json").expanduser()
DEFAULT_LOGIN_CID = "6864372380"  # Evelyn Learning Manager Account (MCC)
DEFAULT_CUSTOMER_ID = "4310769015"  # Stayfari India (INR) — bids come back in the account currency
LANG = {"en": 1000, "hi": 1023, "es": 1003, "fr": 1002, "de": 1001, "pt": 1014, "ar": 1019}
# Keyword Planner geo target ids (country level)
GEO = {
    "US": 2840, "IN": 2356, "GB": 2826, "CA": 2124, "AU": 2036, "AE": 2784,
    "SG": 2702, "PH": 2608, "NG": 2566, "ZA": 2710, "PK": 2586, "BD": 2050,
    "DE": 2276, "FR": 2250, "BR": 2076, "MX": 2484, "ID": 2360, "MY": 2458,
    "KE": 2404, "SA": 2682, "EG": 2818, "VN": 2704, "JP": 2392, "KR": 2410,
}
COMPETITION = {0: "UNSPECIFIED", 1: "UNKNOWN", 2: "LOW", 3: "MEDIUM", 4: "HIGH"}
IDEAS_SEED_BATCH = 20          # API max seed keywords per generate_keyword_ideas call
METRICS_BATCH = 500            # conservative batch for generate_keyword_historical_metrics


def _dev_token() -> str:
    tok = os.environ.get("GOOGLE_ADS_DEVELOPER_TOKEN")
    if tok:
        return tok
    cfg = json.loads(CLAUDE_JSON.read_text())
    return cfg["mcpServers"]["google-ads"]["env"]["GOOGLE_ADS_DEVELOPER_TOKEN"]


def make_client(login_cid: str = DEFAULT_LOGIN_CID) -> GoogleAdsClient:
    adc = json.loads(ADC_PATH.read_text())
    creds = Credentials(
        token=None,
        refresh_token=adc["refresh_token"],
        client_id=adc["client_id"],
        client_secret=adc["client_secret"],
        token_uri="https://oauth2.googleapis.com/token",
        scopes=["https://www.googleapis.com/auth/adwords"],
    )
    return GoogleAdsClient(credentials=creds, developer_token=_dev_token(), login_customer_id=login_cid)


def _geo_constants(client: GoogleAdsClient, geo: str) -> list[str]:
    if not geo or geo.upper() == "WORLD":
        return []
    svc = client.get_service("GeoTargetConstantService")
    out = []
    for code in geo.split(","):
        code = code.strip().upper()
        if code not in GEO:
            sys.exit(f"unknown geo {code}; known: {', '.join(sorted(GEO))}")
        out.append(svc.geo_target_constant_path(GEO[code]))
    return out


def _metrics_row(text: str, m) -> dict:
    months = list(m.monthly_search_volumes)
    hist = [(f"{mv.year}-{int(mv.month):02d}", int(mv.monthly_searches)) for mv in months]
    # enum month values are 1-indexed with JANUARY=2 in the proto; normalise
    hist = [(f"{y_m.split('-')[0]}-{int(y_m.split('-')[1]) - 1:02d}", v) for y_m, v in hist]
    vols = [v for _, v in hist]
    growth = None
    if len(vols) >= 24:
        prev, last = sum(vols[-24:-12]), sum(vols[-12:])
        growth = round((last - prev) / prev, 2) if prev else None
    elif len(vols) >= 6:
        first, last = sum(vols[:3]) / 3, sum(vols[-3:]) / 3
        growth = round((last - first) / first, 2) if first else None
    return {
        "keyword": text,
        "avg_monthly_searches": int(m.avg_monthly_searches),
        "competition": COMPETITION.get(int(m.competition), str(m.competition)),
        "competition_index": int(m.competition_index),
        "low_top_bid": round(m.low_top_of_page_bid_micros / 1e6, 2),
        "high_top_bid": round(m.high_top_of_page_bid_micros / 1e6, 2),
        "growth_3m_vs_3m": growth,
        "history": json.dumps(hist),
    }


def _chunks(xs: list, n: int) -> Iterable[list]:
    for i in range(0, len(xs), n):
        yield xs[i:i + n]


def _call_with_retry(fn, *a, **kw):
    for attempt in range(8):
        try:
            return fn(*a, **kw)
        except (ResourceExhausted, ServiceUnavailable, DeadlineExceeded) as e:
            wait = 10 * (attempt + 1)
            print(f"  {type(e).__name__}, sleeping {wait}s", file=sys.stderr)
            time.sleep(wait)
            continue
        except GoogleAdsException as e:
            msg = " | ".join(err.message for err in e.failure.errors)
            if "RESOURCE_EXHAUSTED" in str(e) or "rate" in msg.lower():
                wait = 15 * (attempt + 1)
                print(f"  rate limited, sleeping {wait}s", file=sys.stderr)
                time.sleep(wait)
                continue
            raise SystemExit(f"Google Ads error: {msg}")
    raise SystemExit("gave up after rate-limit retries")


def ideas(client: GoogleAdsClient, customer_id: str, seeds: list[str], url: str | None,
          geo: str, lang: str, include_adult: bool = False) -> list[dict]:
    svc = client.get_service("KeywordPlanIdeaService")
    lang_svc = client.get_service("GoogleAdsService")
    geo_res = _geo_constants(client, geo)
    seen: dict[str, dict] = {}
    batches = list(_chunks(seeds, IDEAS_SEED_BATCH)) if seeds else [[]]
    for i, batch in enumerate(batches, 1):
        req = client.get_type("GenerateKeywordIdeasRequest")
        req.customer_id = customer_id
        req.language = lang_svc.language_constant_path(LANG[lang])
        req.geo_target_constants.extend(geo_res)
        req.include_adult_keywords = include_adult
        req.keyword_plan_network = client.enums.KeywordPlanNetworkEnum.GOOGLE_SEARCH
        if batch and url:
            req.keyword_and_url_seed.url = url
            req.keyword_and_url_seed.keywords.extend(batch)
        elif batch:
            req.keyword_seed.keywords.extend(batch)
        elif url:
            req.url_seed.url = url
        else:
            sys.exit("ideas needs --seeds and/or --url")
        print(f"ideas batch {i}/{len(batches)} ({len(batch)} seeds, geo={geo or 'WORLD'})", file=sys.stderr)
        resp = _call_with_retry(svc.generate_keyword_ideas, request=req)
        time.sleep(2)
        for r in resp:
            row = _metrics_row(r.text, r.keyword_idea_metrics)
            row["seed_batch"] = i
            seen.setdefault(r.text, row)
    return list(seen.values())


def metrics(client: GoogleAdsClient, customer_id: str, keywords: list[str], geo: str, lang: str,
            months: int = 12) -> list[dict]:
    svc = client.get_service("KeywordPlanIdeaService")
    lang_svc = client.get_service("GoogleAdsService")
    geo_res = _geo_constants(client, geo)
    out: list[dict] = []
    batches = list(_chunks(keywords, METRICS_BATCH))
    for i, batch in enumerate(batches, 1):
        req = client.get_type("GenerateKeywordHistoricalMetricsRequest")
        req.customer_id = customer_id
        req.keywords.extend(batch)
        req.language = lang_svc.language_constant_path(LANG[lang])
        req.geo_target_constants.extend(geo_res)
        req.keyword_plan_network = client.enums.KeywordPlanNetworkEnum.GOOGLE_SEARCH
        if months != 12:
            # history window: proto month enum is JANUARY=2 .. DECEMBER=13
            import datetime as _dt
            end = _dt.date.today().replace(day=1) - _dt.timedelta(days=1)   # last full month
            start_idx = end.year * 12 + (end.month - 1) - (months - 1)
            sy, sm = divmod(start_idx, 12)
            rng = req.historical_metrics_options.year_month_range
            rng.start.year, rng.start.month = sy, sm + 2
            rng.end.year, rng.end.month = end.year, end.month + 1
        print(f"metrics batch {i}/{len(batches)} ({len(batch)} kws, geo={geo or 'WORLD'})", file=sys.stderr)
        resp = _call_with_retry(svc.generate_keyword_historical_metrics, request=req)
        time.sleep(2)
        for r in resp.results:
            row = _metrics_row(r.text, r.keyword_metrics)
            row["close_variants"] = json.dumps(list(r.close_variants))
            out.append(row)
    return out


def write_csv(rows: list[dict], out: Path) -> None:
    if not rows:
        print("no rows", file=sys.stderr)
        return
    rows.sort(key=lambda r: -r["avg_monthly_searches"])
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {len(rows)} rows -> {out}", file=sys.stderr)


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("mode", choices=["ideas", "metrics"])
    p.add_argument("--seeds", help="file with one keyword per line (# comments ok)")
    p.add_argument("--kw", nargs="*", help="inline keywords instead of --seeds")
    p.add_argument("--url", help="ideas mode: expand from a landing page URL")
    p.add_argument("--geo", default="WORLD", help="comma list of country codes, or WORLD")
    p.add_argument("--lang", default="en", choices=sorted(LANG))
    p.add_argument("--customer", default=DEFAULT_CUSTOMER_ID)
    p.add_argument("--months", type=int, default=12, help="metrics mode: months of history (max 48)")
    p.add_argument("--out", help="csv path (default: out/<mode>-<geo>.csv)")
    p.add_argument("--print", action="store_true", help="also print the top 40 to stdout")
    a = p.parse_args()

    kws: list[str] = []
    if a.seeds:
        kws += [l.strip() for l in Path(a.seeds).read_text().splitlines() if l.strip() and not l.startswith("#")]
    if a.kw:
        kws += a.kw
    kws = list(dict.fromkeys(k.lower() for k in kws))

    client = make_client()
    if a.mode == "ideas":
        rows = ideas(client, a.customer, kws, a.url, a.geo, a.lang)
    else:
        if not kws:
            sys.exit("metrics needs --seeds or --kw")
        rows = metrics(client, a.customer, kws, a.geo, a.lang, a.months)

    out = Path(a.out) if a.out else Path(__file__).parent / "out" / f"{a.mode}-{a.geo.replace(',', '_')}.csv"
    write_csv(rows, out)
    if a.print:
        for r in rows[:40]:
            print(f"{r['avg_monthly_searches']:>9,}  {r['competition_index']:>3}  ${r["high_top_bid"]:<6} "
                  f"{(r['growth_3m_vs_3m'] if r['growth_3m_vs_3m'] is not None else ''):>6}  {r['keyword']}")


if __name__ == "__main__":
    main()
