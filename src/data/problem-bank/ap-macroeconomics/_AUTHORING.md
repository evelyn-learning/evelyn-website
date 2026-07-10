# AP Macroeconomics — ProblemBank authoring spec

Scaffold for the Phase-B item bank. Fill the empty `u1.json … u6.json` arrays with
original MCQ/numeric items, then seed. Recipe + status: memory `project_problem_bank_seeding`.
(This `.md` is ignored by the seeder — only `*.json` files are loaded.)

**Precedent:** ap-statistics (236 items, 39 LOs) and ap-calculus-bc (422, 70 LOs) were
built this exact way — mirror their `src/data/problem-bank/<course>/*.json` files.

## SeedItem schema (each `uN.json` = a JSON **array** of these)
```json
{
  "id": "apmacro.<lo-slug>.<mcq|numeric>.<NN>",   // stable, globally unique
  "loId": "apmacro.<lo-slug>",                     // MUST match the LO tables below
  "cedCode": "AP-MACRO-<x.y>",                      // from the tables below
  "difficulty": 1,                                  // 1..4
  "responseFormat": "mcq",                          // "mcq" | "numeric"
  "problemText": "…",                               // ≥10 chars; NO $<digit> (see gotcha)
  "choices": ["…","…","…","…"],                     // mcq only: 3–5 options, no letter prefixes
  "answer": "C",                                    // mcq: LETTER A..E (index into choices); numeric: a number string e.g. "4" or "1.5"
  "hints": ["…"]                                    // optional, 1–2 short hints
}
```

## Conventions (match Stats/Calc exactly)
- **id**: `<loId>.mcq.01`, `<loId>.mcq.02`, `<loId>.numeric.01`, … — zero-padded, unique across the whole course.
- **Original content**, modeled on the CED topic (license is stamped `internal-original` at seed). Do NOT transcribe released CB questions.
- **Target ≈ 6 items/LO** (Stats/Calc density) → ~250 items total. Vary **difficulty 1→4** within each LO (e.g. two easy, two medium, two hard).
- **MCQ-dominant** (AP Macro §I is all MCQ) + **numeric** where the topic is computational: spending/tax **multipliers** (1/(1−MPC), −MPC/(1−MPC)), **GDP/CPI/real-vs-nominal**, **unemployment rate**, **money multiplier** (1/RRR) & deposit expansion, **exchange-rate** conversions.
- **Skip the `*-frq-practice` LOs** — they're free-response, not bank items.
- Primary source for correctness: OpenStax *Principles of Macroeconomics for AP* (per AP Plans Initiative). Graphical concepts (PPC, AD-AS, money market, loanable funds, Phillips, FX) → describe the scenario in text and ask the MCQ; the bank is text-only (no diagrams).

## Validation (the seeder is STRICT — a single bad item aborts the whole run)
Per item: unique `id`; `loId`+`cedCode` present; `difficulty` ∈ 1..4; `problemText` ≥10 chars;
mcq → 3–5 `choices` and `answer` a letter within range; numeric → `answer` parses as a number.
**KaTeX $-digit trap:** never write `$<digit>` (e.g. `$5 billion`) — the currency renderer eats it.
Write `\$5` (escaped) or "5 billion dollars", and use `$…$` only for real math like `$\frac{1}{1-MPC}$`.

## Seed commands (writes to the engine's Mongo — confirm the target DB first)
```
# validate + Sonnet verify-at-ingest, NO write:
npm run seed:problem-bank -- --course=ap-macroeconomics --dry-run
# per-unit while authoring incrementally (avoids other units' emptiness blocking):
npm run seed:problem-bank -- --course=ap-macroeconomics --file=u1.json
# full course once all 6 files are complete:
npm run seed:problem-bank -- --course=ap-macroeconomics
```
Then verify: aggregate `ProblemBank` by `topic` → `ap-macroeconomics` rows, all with a `verifiedAt` stamp.

---

## LO skeleton — author items for every row (content LOs only; 42 total)

### Unit 1 — Basic Economic Concepts (6 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apmacro.scarcity` | AP-MACRO-1.1 | Scarcity |
| `apmacro.resource-allocation` | AP-MACRO-1.2 | Resource Allocation and Economic Systems |
| `apmacro.ppc` | AP-MACRO-1.3 | Production Possibilities Curve |
| `apmacro.comparative-advantage` | AP-MACRO-1.4 | Comparative Advantage and Gains from Trade |
| `apmacro.cost-benefit` | AP-MACRO-1.5 | Cost-Benefit Analysis |
| `apmacro.marginal-analysis-consumer` | AP-MACRO-1.6 | Marginal Analysis and Consumer Choice |

### Unit 2 — Economic Indicators & the Business Cycle (7 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apmacro.circular-flow-gdp` | AP-MACRO-2.1 | The Circular Flow and GDP |
| `apmacro.gdp-limitations` | AP-MACRO-2.2 | Limitations of GDP |
| `apmacro.unemployment` | AP-MACRO-2.3 | Unemployment |
| `apmacro.price-indices-inflation` | AP-MACRO-2.4 | Price Indices and Inflation |
| `apmacro.costs-of-inflation` | AP-MACRO-2.5 | Costs of Inflation |
| `apmacro.real-vs-nominal-gdp` | AP-MACRO-2.6 | Real vs. Nominal GDP |
| `apmacro.business-cycle` | AP-MACRO-2.7 | The Business Cycle |

### Unit 3 — National Income & Price Determination (9 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apmacro.aggregate-demand` | AP-MACRO-3.1 | Aggregate Demand |
| `apmacro.multipliers` | AP-MACRO-3.2 | Multipliers |
| `apmacro.short-run-aggregate-supply` | AP-MACRO-3.3 | Short-Run Aggregate Supply |
| `apmacro.long-run-aggregate-supply` | AP-MACRO-3.4 | Long-Run Aggregate Supply |
| `apmacro.equilibrium-ad-as` | AP-MACRO-3.5 | Equilibrium in the AD-AS Model |
| `apmacro.changes-ad-as-short-run` | AP-MACRO-3.6 | Changes in the AD-AS Model in the Short Run |
| `apmacro.long-run-self-adjustment` | AP-MACRO-3.7 | Long-Run Self-Adjustment |
| `apmacro.fiscal-policy` | AP-MACRO-3.8 | Fiscal Policy |
| `apmacro.automatic-stabilizers` | AP-MACRO-3.9 | Automatic Stabilizers |

### Unit 4 — Financial Sector (7 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apmacro.financial-assets` | AP-MACRO-4.1 | Financial Assets |
| `apmacro.nominal-vs-real-interest-rates` | AP-MACRO-4.2 | Nominal vs Real Interest Rates |
| `apmacro.functions-of-money` | AP-MACRO-4.3 | Definition, Measurement, and Functions of Money |
| `apmacro.banking-money-creation` | AP-MACRO-4.4 | Banking and the Expansion of the Money Supply |
| `apmacro.money-market` | AP-MACRO-4.5 | The Money Market |
| `apmacro.monetary-policy` | AP-MACRO-4.6 | Monetary Policy |
| `apmacro.loanable-funds-market` | AP-MACRO-4.7 | The Loanable Funds Market |

### Unit 5 — Long-Run Consequences of Stabilization Policies (7 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apmacro.fiscal-monetary-short-run` | AP-MACRO-5.1 | Fiscal and Monetary Policy Actions in the Short Run |
| `apmacro.phillips-curve` | AP-MACRO-5.2 | The Phillips Curve |
| `apmacro.money-growth-inflation` | AP-MACRO-5.3 | Money Growth and Inflation |
| `apmacro.deficits-debt` | AP-MACRO-5.4 | Government Deficits and the National Debt |
| `apmacro.crowding-out-long-run` | AP-MACRO-5.5 | Crowding Out |
| `apmacro.economic-growth` | AP-MACRO-5.6 | Economic Growth |
| `apmacro.public-policy-growth` | AP-MACRO-5.7 | Public Policy and Economic Growth |

### Unit 6 — Open Economy: International Trade & Finance (6 LOs)
| loId | cedCode | cedTitle |
|---|---|---|
| `apmacro.balance-of-payments` | AP-MACRO-6.1 | Balance of Payments |
| `apmacro.exchange-rates` | AP-MACRO-6.2 | Exchange Rates |
| `apmacro.fx-market` | AP-MACRO-6.3 | The Foreign Exchange Market |
| `apmacro.fx-determinants` | AP-MACRO-6.4 | Determinants of Exchange Rates |
| `apmacro.fx-effects-on-economy` | AP-MACRO-6.5 | Effects of Exchange Rate Changes |
| `apmacro.trade-capital-flows` | AP-MACRO-6.6 | Trade and Capital Flow Relationships |

---

## Worked example (mirror this shape)
```json
[
  {
    "id": "apmacro.multipliers.numeric.01",
    "loId": "apmacro.multipliers",
    "cedCode": "AP-MACRO-3.2",
    "difficulty": 2,
    "responseFormat": "numeric",
    "problemText": "In an economy with a marginal propensity to consume of 0.8, the government increases spending. What is the value of the spending multiplier?",
    "answer": "5",
    "hints": ["Spending multiplier = 1 / (1 − MPC)."]
  },
  {
    "id": "apmacro.multipliers.mcq.01",
    "loId": "apmacro.multipliers",
    "cedCode": "AP-MACRO-3.2",
    "difficulty": 3,
    "responseFormat": "mcq",
    "problemText": "An economy has an MPC of 0.75. A tax cut of 40 billion dollars is enacted. By how much does aggregate demand ultimately change, all else equal?",
    "choices": ["Increases by 120 billion dollars", "Increases by 160 billion dollars", "Increases by 40 billion dollars", "Decreases by 120 billion dollars"],
    "answer": "A",
    "hints": ["Tax multiplier = −MPC / (1 − MPC).", "A tax cut raises AD, so the sign flips to positive."]
  }
]
```
