import time, json, sys, pandas as pd
from pytrends.request import TrendReq
anchors = ["ai tutor","online tutoring","homework help","sat prep","lms","lesson plan generator","ai grading","learn python","ielts preparation","study app","flashcards","online courses","quiz maker","math solver","homeschool curriculum"]
p = TrendReq(hl='en-US', tz=0, timeout=(10,25))
rows=[]
for a in anchors:
    for attempt in range(3):
        try:
            p.build_payload([a], timeframe="today 12-m")
            rq = p.related_queries()[a]
            for kind in ("rising","top"):
                df = rq.get(kind)
                if df is not None:
                    for _,r in df.head(15).iterrows():
                        rows.append({"anchor":a,"kind":kind,"query":r["query"],"value":r["value"]})
            print("ok", a, file=sys.stderr); break
        except Exception as e:
            print("retry", a, e, file=sys.stderr); time.sleep(20*(attempt+1))
    time.sleep(8)
pd.DataFrame(rows).to_csv("out/trends-rising.csv", index=False)
print("wrote", len(rows))
