"""Final ranking from 24-month metrics (deduped, non-brand)."""
import re, json, math, sys, warnings
import pandas as pd
warnings.filterwarnings("ignore")
exec(open("analyze.py").read().split("def load")[0])  # BRANDS, CATS, cat()

def load(geo):
    m = pd.read_csv(f"out/metrics24-{geo}.csv")
    m["geo"] = geo
    m["sig"] = m.avg_monthly_searches.astype(str) + "|" + m.history
    m["klen"] = m.keyword.str.len()
    # collapse variant groups again (metrics endpoint also returns grouped volumes)
    m = m.sort_values("klen").groupby("sig").agg(
        keyword=("keyword", "first"), variants=("keyword", lambda s: " | ".join(list(s)[:4])),
        avg_monthly_searches=("avg_monthly_searches", "first"), competition_index=("competition_index", "first"),
        high_top_bid=("high_top_bid", "first"), growth=("growth_3m_vs_3m", "first"), history=("history", "first"),
        geo=("geo", "first")).reset_index(drop=True)
    return m

df = pd.concat([load(g) for g in ["WORLD", "US", "IN"]], ignore_index=True)
df = df[~df.keyword.str.contains(BRANDS, regex=True)]
df["ai"] = df.keyword.str.contains(r"\b(ai|artificial intelligence|chatgpt|gpt)\b", regex=True)
df["cat"] = df.keyword.map(cat)
df["growth"] = df.growth.fillna(0).clip(-0.9, 5)
def last3_yoy(h):
    v = [x[1] for x in json.loads(h)]
    if len(v) < 24: return None
    a, b = sum(v[-15:-12]), sum(v[-3:])
    return round((b - a) / a, 2) if a else None
df["yoy_last3m"] = df.history.map(last3_yoy)
def prior_ok(h):
    v = [x[1] for x in json.loads(h)]
    return len(v) >= 24 and sum(v[-24:-12]) >= 0.2 * sum(v[-12:]) and min(v[-24:-12]) > 0
df["growth_ok"] = df.history.map(prior_ok)
df.loc[~df.growth_ok, ["growth", "yoy_last3m"]] = [0, None]  # regrouped/new variants: growth unknowable, treat as flat
df["opp"] = (df.avg_monthly_searches.map(lambda v: math.log10(v + 1))
             * (1 - df.competition_index / 100 * 0.7)
             * (1 + df.growth.clip(-0.5, 2)))
df.to_csv("out/ranked.csv", index=False)

pd.set_option("display.width", 250)
cols = ["keyword", "cat", "avg_monthly_searches", "competition_index", "growth", "yoy_last3m", "high_top_bid"]
for geo in ["WORLD", "US", "IN"]:
    g = df[df.geo == geo]
    roll = g.groupby("cat").agg(groups=("keyword", "count"), total_vol=("avg_monthly_searches", "sum"),
                                med_comp=("competition_index", "median"), vol_w_growth=("growth", lambda s: round((s * g.loc[s.index, "avg_monthly_searches"]).sum() / g.loc[s.index, "avg_monthly_searches"].sum(), 2)),
                                ai_vol=("ai", lambda s: int(g.loc[s.index][s].avg_monthly_searches.sum()))).sort_values("total_vol", ascending=False)
    print(f"\n=== {geo}: category rollup (deduped, non-brand, >=2k) ===\n{roll.to_string()}")
    print(f"\n--- {geo}: top 40 by volume ---\n{g.sort_values('avg_monthly_searches', ascending=False).head(40)[cols].to_string(index=False)}")
    print(f"\n--- {geo}: top 40 by opportunity (vol>=10k) ---\n{g[g.avg_monthly_searches>=10000].sort_values('opp', ascending=False).head(40)[cols].to_string(index=False)}")
    print(f"\n--- {geo}: fastest YoY growth (vol>=10k) ---\n{g[g.avg_monthly_searches>=10000].sort_values('growth', ascending=False).head(30)[cols].to_string(index=False)}")
    print(f"\n--- {geo}: AI-flavoured top 30 ---\n{g[g.ai].sort_values('avg_monthly_searches', ascending=False).head(30)[cols].to_string(index=False)}")
    for c in ["tutoring", "test_prep", "teacher_tools", "homework_solver", "study_tools", "k12_kids", "language_learning", "coding_data_ai_skills"]:
        print(f"\n--- {geo}: {c} top 15 by volume ---\n{g[g.cat==c].sort_values('avg_monthly_searches', ascending=False).head(15)[cols].to_string(index=False)}")
