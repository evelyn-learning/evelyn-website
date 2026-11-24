# Fonts

## NotoSansJP-Regular-subset.ttf

- **Used by:** the session PDF exporter (`src/lib/utils/export/pdf-tutor-session.ts`).
  Fetched lazily (`/fonts/NotoSansJP-Regular-subset.ttf`) only when the session's
  text contains Japanese (or CJK that is not recognisably Chinese — see the
  Chinese files below), then embedded in the PDF via jsPDF `addFont`.
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

## NotoSansTC-Regular-subset.ttf and NotoSansSC-Regular-subset.ttf

- **Used by:** the session PDF exporter, for a lesson in Traditional Chinese
  (Taiwan, `zh-TW`) or Simplified Chinese (`zh-CN`). The JP file above has no
  說 嗎 吧 呢 你 您 这 们 …, so Chinese printed in it shows empty boxes.
  `pickCjkFont` in `src/lib/utils/export/pdf-cjk-font.ts` names ONE file per
  document (by the session's language when the exporter is given it, by the
  text otherwise); only that file is fetched, and none for a Latin-only session.
- **Family:** Noto Sans TC / Noto Sans SC, Regular (weight 400 static instance),
  TrueType outlines (`glyf`; jsPDF cannot embed CFF).
- **Licence:** SIL Open Font License 1.1 — full text in `OFL-NotoSansTC.txt` and
  `OFL-NotoSansSC.txt` (the upstream `OFL.txt` of each family; Copyright
  2014-2021 Adobe, with Reserved Font Name 'Source'). Same terms as the JP file.
- **Source:** Google Fonts repo, downloaded 2026-11-24:
  - `ofl/notosanstc/NotoSansTC[wght].ttf`
    (https://github.com/google/fonts/raw/main/ofl/notosanstc/NotoSansTC%5Bwght%5D.ttf),
    11,941,968 bytes, sha256 `864727d210d54f2537bbe23b3a839436c3992af72de9322af5270897246bd44f`
  - `ofl/notosanssc/NotoSansSC[wght].ttf`
    (https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf),
    17,772,300 bytes, sha256 `a3041811a78c361b1de50f953c805e0244951c21c5bd412f7232ef0d899af0da`
- **Built with:** fontTools 4.53, same options as the JP file (`varLib.instancer`
  wght=400, then `subset`; no hinting, no layout features, layout tables dropped).
- **Coverage, both files:** ASCII + Latin-1, general punctuation U+2010–2027 /
  2030–203B, arrows U+2190–2193, CJK symbols U+3000–303F, kana U+3040–30FF and
  U+31F0–31FF, Bopomofo U+3100–312F and U+31A0–31BF, half/fullwidth forms
  U+FF00–FFEF, and every non-hanzi code point the JP file keeps (its maths,
  Greek and symbol rows) — each where the source font has it.
- **NotoSansTC (6,520 code points, 5,411 hanzi):** plus Big5 level 1, the 5,401
  frequently used characters (Big5 0xA440–0xC67E; a superset in practice of
  Taiwan's 4,808 常用國字), and the Big5 symbol area 0xA140–0xA3BF (which adds
  10 unit characters such as 瓩 糎). No source hanzi was missing.
  **Size:** 1,977,124 bytes, sha256 `52e75a64e1886a63465dceb64a0ca4e77df0fb378976fb40ebcb0dfd95164d88`.
- **NotoSansSC (7,895 code points, 6,763 hanzi):** plus GB2312 level 1 + level 2
  (rows 16–87, 6,763 characters) and the GB2312 symbol rows 1–9. No source
  hanzi was missing.
  **Size:** 2,250,032 bytes, sha256 `6b29d2648300e9aa4f239deb8b8d302fe7939540b6d741737fe51e84420f4f73`.
- **Not covered:** Big5 level 2 (7,652 less common characters) and anything
  outside GB2312; such a character prints as an empty box. Add it to `WATCH`
  below and rebuild.

Rebuild recipe (Python 3 + fontTools; run with `python3 -I build.py tc|sc <source.ttf> <out.ttf> NotoSansJP-Regular-subset.ttf`,
keeping the downloaded source outside the repo):

```python
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

which, src, out, jp = sys.argv[1:5]
# Characters each file must carry whatever the lists say (checked after the build).
WATCH = {
 'tc': '說嗎吧呢啊妳您喔哪步這們時間問題聯立方程式加減消去法代入驗算國中數學老師請對錯麼為什麼學習練習題目答案分數小數公分，。！？：；「」『』（）、…',
 'sc': '这说们时间问题联立方程组加减消元法代入验算初中数学老师请对错么为什么学习练习题目答案分数小数厘米，。！？：；“”（）、…',
}[which]

def decode_range(codec, b1s, b2s):
    found = set()
    for b1 in b1s:
        for b2 in b2s:
            try:
                ch = bytes([b1, b2]).decode(codec)
                if len(ch) == 1: found.add(ord(ch))
            except Exception: pass
    return found

cps = set()
for a, b in [(0x20,0x7E),(0xA0,0xFF),(0x2010,0x2027),(0x2030,0x203B),(0x2190,0x2193),
             (0x3000,0x303F),(0x3040,0x30FF),(0x31F0,0x31FF),(0x3100,0x312F),(0x31A0,0x31BF),(0xFF00,0xFFEF)]:
    cps.update(range(a, b + 1))
is_han = lambda c: 0x3400 <= c <= 0x9FFF or 0xF900 <= c <= 0xFAFF or c >= 0x20000
cps.update(c for c in TTFont(jp).getBestCmap() if not is_han(c))   # the JP file's maths / Greek / symbol rows
if which == 'tc':
    B2 = list(range(0x40, 0x7F)) + list(range(0xA1, 0xFF))
    cps |= decode_range('big5', range(0xA1, 0xA4), B2)             # Big5 symbol area 0xA140-0xA3BF
    cps |= decode_range('big5', range(0xA4, 0xC7), B2)             # Big5 level 1, 0xA440-0xC67E
else:
    cps |= decode_range('gb2312', range(0xA1, 0xAA), range(0xA1, 0xFF))   # GB2312 rows 1-9 (symbols)
    cps |= decode_range('gb2312', range(0xB0, 0xF8), range(0xA1, 0xFF))   # rows 16-87: level 1 + level 2
cps |= {ord(c) for c in WATCH}

f = instancer.instantiateVariableFont(TTFont(src), {"wght": 400}, updateFontNames=True)
cmap = f.getBestCmap()
cps = sorted(c for c in cps if c in cmap)
o = subset.Options()
o.layout_features = []; o.hinting = False; o.notdef_outline = True
o.drop_tables += ['BASE','GSUB','GPOS','GDEF','STAT','vhea','vmtx','VORG','DSIG','meta']
o.name_IDs = [0, 1, 2, 3, 4, 5, 6]
s = subset.Subsetter(o); s.populate(unicodes=cps); s.subset(f)
f.save(out)
got = TTFont(out).getBestCmap()
assert all(ord(ch) in got for ch in WATCH), [ch for ch in WATCH if ord(ch) not in got]
```

Checked 2026-11-24: every `WATCH` character is in its file; a zh-TW and a zh-CN
session exported in Node (`npm run test:pdf-cjk-font`) and rendered with
`pdftoppm` show every glyph.
