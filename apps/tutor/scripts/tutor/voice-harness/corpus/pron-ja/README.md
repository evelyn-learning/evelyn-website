# pron-ja — pronunciation bake-off clips (Azure vs Speechace)

Fourteen recordings for `npm run voice:pron` (GDI trial: Japanese professionals
learning English). `clips.json` lists each one: `id`, `file`, `referenceText`
(what the vendor scores against) and `planted` (the error the katakana-style
take deliberately contains: `th`, `bv`, `katakana`, or `none` for a clear take).

## How to record

- **Format:** WAV, **16 kHz, mono, 16-bit**. (Other WAVs are converted with
  ffmpeg at run time, but record 16 kHz mono if you can.)
- **One item per file**, ~1–5 s, about 0.5 s of silence before and after.
  Quiet room; the laptop mic is fine.
- **Filename = the `file` value in `clips.json`**, saved in this folder.
- Say exactly the `referenceText` — no extra words.

Each word / sentence twice:

| take | how to say it |
|---|---|
| `-katakana` | Japanese-English habit on purpose: vowel after every consonant (`re-su-pon-shi-bi-ri-tii-zu`, `de-be-ro-ppu-do`), even stress on every syllable, `v` → `b` ("deBeloped", "seBeral", "haBe"), `th` → `s`/`z` ("wiz", "za"), `l` ↔ `r` |
| `-clear` | your normal, careful English |

Words: responsibilities, international, communicate, customers, developed.
Sentences: "I have worked with international customers for several years." and
"I was responsible for communicating with our customers."

macOS one-liner per take (QuickTime works too, then convert):

```bash
cd apps/tutor/scripts/tutor/voice-harness/corpus/pron-ja
ffmpeg -f avfoundation -i ":0" -ac 1 -ar 16000 -sample_fmt s16 -t 5 w-developed-katakana.wav
```

The recordings are personal voice data: `*.wav` in this folder is gitignored
(`.gitignore` here) — only `clips.json` and this README belong in git.

## Run

Keys in `apps/tutor/.env.local`: `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`
(e.g. `eastus`), `SPEECHACE_KEY` (plus `SPEECHACE_HOST` if the Speechace
subscription is not US West). Then, from `apps/tutor`:

```bash
npm run voice:pron -- --vendor azure --clip w-developed-katakana   # one-request smoke test
npm run voice:pron                                                  # full run: 14 clips × 2 vendors = 28 requests (free tier)
```

Read `artifacts/voice-harness/pron/<runId>/compare.md`. Missing files are
skipped with a log line.
