# AP Psychology — ProblemBank authoring spec

Scaffold for the item bank. Fill the empty `u0.json … u5.json` arrays with original
MCQ/numeric items, then seed. Recipe + status: memory `project_problem_bank_seeding`.
Mirrors the ap-macroeconomics / ap-statistics banks. Uses the **2025 redesigned
CED** (5 content units + Scientific Foundations). `u0.json` = Scientific Foundations.
(This `.md` is ignored by the seeder — only `*.json` files are loaded.)

## SeedItem schema (each `uN.json` = a JSON **array** of these)
```json
{
  "id": "appsych.<lo-slug>.<mcq|numeric>.<NN>",   // stable, globally unique
  "loId": "appsych.<lo-slug>",                     // MUST match the LO tables below
  "cedCode": "AP-PSYCH-<x.y>",                      // from the tables below
  "difficulty": 1,                                  // 1..4
  "responseFormat": "mcq",                          // "mcq" | "numeric"
  "problemText": "…",                               // ≥10 chars; NO $<digit> (see gotcha)
  "choices": ["…","…","…","…"],                     // mcq only: 3–5 options, no letter prefixes
  "answer": "C",                                    // mcq: LETTER A..E (index into choices); numeric: a number string
  "hints": ["…"]                                    // optional, 1–2 short hints
}
```

## Conventions
- **id**: `<loId>.mcq.01`, … zero-padded, unique course-wide.
- **Target ≈ 6 items/LO**, difficulty spread 1→4 (roughly 1,2,2,3,3,4).
- **Original content** modeled on the CED topic (license stamped `internal-original` at seed). No transcribed CB questions.
- **AP Psych is almost entirely MCQ/conceptual.** The ONLY natural numeric niche is
  Scientific Foundations (`appsych.research-methods`): mean/median/mode, range, reading
  a correlation coefficient's magnitude, percentage/percentile from a normal-ish
  distribution. Give that LO ~2 numeric items; everything else is MCQ.
- Write **application/scenario MCQs** (vignette → concept) as well as definitional ones — that's the modern AP Psych style.
- **Skip the `*-frq-practice` LOs.**
- **KaTeX $-digit trap:** never write `$` directly before a digit. Use `\$50` or "50 dollars"; `$…$` only for real math.

## Validation (seeder is STRICT — one bad item aborts the run)
Per item: unique `id`; `loId`+`cedCode` present; `difficulty` ∈ 1..4; `problemText` ≥10 chars;
mcq → 3–5 `choices` and `answer` a letter within range; numeric → `answer` parses as a number.

## Seed commands
```
npm run seed:problem-bank -- --course=ap-psychology --dry-run
npm run seed:problem-bank -- --course=ap-psychology --file=u0.json
npm run seed:problem-bank -- --course=ap-psychology
```

---

## LO skeleton — author items for every content LO (32 total; skip FRQ)

### Unit 0 (`u0.json`) — Scientific Foundations (1 LO)
| loId | cedCode | cedTitle |
|---|---|---|
| `appsych.research-methods` | AP-PSYCH-SF | Research Methods and Statistics (numeric-friendly) |

### Unit 1 — Biological Bases of Behavior (5 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `appsych.nervous-endocrine` | AP-PSYCH-1.1-1.2 | Nervous System and Heredity |
| `appsych.neurons-neurotransmitters` | AP-PSYCH-1.3 | The Neuron and Neural Firing |
| `appsych.brain-structures` | AP-PSYCH-1.4 | The Brain |
| `appsych.consciousness-sleep` | AP-PSYCH-1.5 | Sleep and Consciousness |
| `appsych.sensation-perception` | AP-PSYCH-1.6+2.1 | Sensation and Perception |

### Unit 2 — Cognition (5 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `appsych.memory-models` | AP-PSYCH-2.3-2.4 | Memory Models and Encoding |
| `appsych.memory-storage-retrieval` | AP-PSYCH-2.5-2.6 | Storing and Retrieving Memories |
| `appsych.memory-forgetting` | AP-PSYCH-2.7 | Forgetting and Memory Challenges |
| `appsych.thinking-language` | AP-PSYCH-2.2+3.5 | Thinking, Problem-Solving, and Language |
| `appsych.intelligence` | AP-PSYCH-2.8 | Intelligence and Achievement |

### Unit 3 — Development and Learning (7 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `appsych.developmental-themes-methods` | AP-PSYCH-3.1 | Themes and Methods in Developmental Psychology |
| `appsych.cognitive-development` | AP-PSYCH-3.2+3.4 | Cognitive and Physical Development |
| `appsych.gender-sexual-orientation` | AP-PSYCH-3.3 | Gender and Sexual Orientation |
| `appsych.social-emotional-moral` | AP-PSYCH-3.6 | Social-Emotional Development |
| `appsych.classical-conditioning` | AP-PSYCH-3.7 | Classical Conditioning |
| `appsych.operant-conditioning` | AP-PSYCH-3.8 | Operant Conditioning |
| `appsych.observational-learning` | AP-PSYCH-3.9 | Social/Cognitive Factors in Learning |

### Unit 4 — Social Psychology and Personality (7 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `appsych.attribution-attitudes` | AP-PSYCH-4.1-4.2 | Attribution, Person Perception, and Attitudes |
| `appsych.prejudice-stereotypes` | AP-PSYCH-4.3 | Prejudice and Discrimination |
| `appsych.social-influence` | AP-PSYCH-4.3 | Psychology of Social Situations (conformity, obedience, group behavior) |
| `appsych.personality-theories` | AP-PSYCH-4.4-4.5 | Personality Theories (psychodynamic, humanistic, trait, social-cognitive) |
| `appsych.personality-assessment` | AP-PSYCH-4.5 | Personality Assessment |
| `appsych.motivation` | AP-PSYCH-4.6 | Motivation |
| `appsych.emotion` | AP-PSYCH-4.7 | Emotion |

### Unit 5 — Mental and Physical Health (7 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `appsych.stress-health` | AP-PSYCH-5.1 | Health Psychology and Stress |
| `appsych.positive-psychology` | AP-PSYCH-5.2 | Positive Psychology |
| `appsych.classifying-disorders` | AP-PSYCH-5.3 | Explaining and Classifying Psychological Disorders |
| `appsych.anxiety-disorders` | AP-PSYCH-5.4 | Anxiety, OCD, and Trauma Disorders |
| `appsych.mood-disorders` | AP-PSYCH-5.4 | Depressive and Bipolar Disorders |
| `appsych.schizo-personality` | AP-PSYCH-5.4 | Schizophrenia and Personality Disorders |
| `appsych.therapy` | AP-PSYCH-5.5 | Treatment of Psychological Disorders |
