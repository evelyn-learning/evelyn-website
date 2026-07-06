# STT Accent Corpus

One directory per accent key: `en-us`, `en-gb`, `en-in`, `en-ar-gulf`, `en-nl`, `en-de`.

Each directory contains:
- source audio files (any format ffmpeg reads) — gitignored
- `clips.json`: `{ "clips": [{ "file": "<name>.16k.wav", "reference": "<exact spoken text>", "source": "<corpus + license note>" }] }`

Target: 10–20 clips per accent, 5–20s each, conversational speech.

## Sourcing (verify license before use; record it in `source`)
- **Mozilla Common Voice** (CC0) — https://commonvoice.mozilla.org/en/datasets — filter by
  self-reported accent (e.g. "India and South Asia", "Germany", "England"). Validated clips
  ship with transcript TSVs; copy sentence text into `reference`.
- **L2-ARCTIC** (non-native English: Hindi, Arabic L1 speakers among others) —
  https://psi.engr.tamu.edu/l2-arctic-corpus/ (free with registration; scripted sentences).
- **VoxPopuli accented English** (CC0, EU Parliament — Dutch- and German-accented English) —
  https://github.com/facebookresearch/voxpopuli (`en_accented` subset with transcripts).
- **EdAcc** (Edinburgh International Accents of English, conversational) — backup;
  check per-file licensing.
- Gulf Arabic English is thinnest in public corpora: Common Voice accent tags + L2-ARCTIC
  Arabic-L1 speakers are the primary sources; top up with consenting self-recordings if needed.

## Workflow
1. Download source clips into the accent directory (any format).
2. Write `clips.json` with references pointing at the INTENDED `.16k.wav` names
   (`<basename>.16k.wav`).
3. Run `npm run voice:corpus` — resamples every listed source file to PCM16 mono 16kHz
   via ffmpeg and validates the result.
