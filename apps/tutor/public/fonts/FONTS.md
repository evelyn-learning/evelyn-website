# Fonts

## NotoSansJP-Regular-subset.ttf

- **Used by:** the session PDF exporter (`src/lib/utils/export/pdf-tutor-session.ts`).
  Fetched lazily (`/fonts/NotoSansJP-Regular-subset.ttf`) only when the session's
  text contains Japanese / CJK, then embedded in the PDF via jsPDF `addFont`.
- **Family:** Noto Sans JP, Regular (weight 400 static instance).
- **Licence:** SIL Open Font License 1.1 — full text in `OFL-NotoSansJP.txt`
  (Copyright 2014-2021 Adobe, with Reserved Font Name 'Source'). OFL permits
  subsetting and redistribution; the subset keeps the upstream family name,
  which is allowed because 'Noto' is not a Reserved Font Name.
- **Source:** Google Fonts repo, `ofl/notosansjp/NotoSansJP[wght].ttf`
  (https://github.com/google/fonts/raw/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf),
  downloaded 2026-11-02, sha256 `c2f3b4d4…fc68f` (9.6 MB variable TTF).
- **Built with:** fontTools 4.53 (`varLib.instancer` wght=400, then `subset`;
  no hinting, no layout features, BASE/GSUB/GPOS/GDEF/STAT/vhea/vmtx dropped).
- **Coverage (7,271 code points):** ASCII + Latin-1, general punctuation
  U+2010–2027 / 2030–203B, arrows U+2190–2193, CJK symbols U+3000–303F,
  hiragana + katakana U+3040–30FF, U+31F0–31FF, half/fullwidth forms
  U+FF00–FFEF, and every character of JIS X 0208 (JIS level-1 + level-2
  kanji and its symbol rows), enumerated by decoding every EUC-JP two-byte code.
- **Size:** 2,645,848 bytes, sha256 `03a2f19c…833bab2`.

Rebuild recipe (Python 3 + fontTools):

```python
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset
f = instancer.instantiateVariableFont(TTFont('NotoSansJP[wght].ttf'), {"wght": 400}, updateFontNames=True)
cps = set()
for a, b in [(0x20,0x7E),(0xA0,0xFF),(0x2010,0x2027),(0x2030,0x203B),(0x2190,0x2193),
             (0x3000,0x303F),(0x3040,0x30FF),(0x31F0,0x31FF),(0xFF00,0xFFEF)]:
    cps.update(range(a, b + 1))
for b1 in range(0xA1, 0xFF):
    for b2 in range(0xA1, 0xFF):
        try:
            ch = bytes([b1, b2]).decode('euc_jp')
            if len(ch) == 1: cps.add(ord(ch))
        except Exception: pass
cmap = f.getBestCmap()
cps = sorted(c for c in cps if c in cmap)
o = subset.Options()
o.layout_features = []; o.hinting = False; o.notdef_outline = True
o.drop_tables += ['BASE','GSUB','GPOS','GDEF','STAT','vhea','vmtx','VORG','DSIG','meta']
o.name_IDs = [0, 1, 2, 3, 4, 5, 6]
s = subset.Subsetter(o); s.populate(unicodes=cps); s.subset(f)
f.save('NotoSansJP-Regular-subset.ttf')
```
