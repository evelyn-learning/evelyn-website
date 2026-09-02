# Grade 6 Math — Curriculum Table (Task 1.1, Step 1)

Course: **m6math** · Title: **Grade 6 Math** · `exam: 'MS'` · `gradeLabel: 'Grade 6'`
Plan-id template: `evelyn.ms.m6math.<slug>.v1` · Export symbol: `SEED_M6MATH_U<N>_<SLUG>`
LO id: `m6math.<slug>` · Standard code (LO): `M6MATH-<unit>.<topic>` (e.g. `M6MATH-1.1`)
`metadata`: `{ cedUnit: '<N>', cedTopic: '<N>.<t>', cedTitle: '<Topic Title>' }`
Bank dir: `src/data/problem-bank/grade-6-math/` · Portal key: `GRADE_6_MATH`
`tryFormat`: two-mcq-one-numeric · Bank item ids: `m6math-<slug>-NNN` · difficulty spread per LO: `1,2,2,3,3,4`
Segment recipe (fixed, 1 LO/plan): hook, concept, worked_example ×2, try_yourself ×3, misconception_check, recap · `source: MS_SOURCE` · `pacingThresholds: MS_PACING_THRESHOLDS`

Standards: CCSS Grade 6 Mathematics — 6.RP, 6.NS, 6.EE, 6.G, 6.SP.
Grounding: shipped `grade-7-math` unit titles (`unit-titles.ts`) + `m7math-u*.ts` seeds (40 files, read `m7math-u3-ratios-and-unit-rates.ts` in full for granularity/format). Salvage scan: `grep -rl 'g7-' apps/tutor/src/lib/tutor/lesson-plan/seeds/` → 8 `g7-math-*.ts` legacy files (pre-`m7math` convention, salvage-only, never imported).

---

## Unit 1 — Understanding Ratios & Rates

| Slug | Title | Standard | Scope | Salvage |
|---|---|---|---|---|
| `ratio-language-and-notation` | Ratio Language & Notation | 6.RP.A.1 | Read, write, and interpret ratio language and notation (a:b, a to b, a/b) to describe a relationship between two quantities. | none |
| `representing-ratios-with-tables-and-diagrams` | Representing Ratios with Tables & Diagrams | 6.RP.A.3a | Build ratio tables, tape diagrams, and double number lines to generate equivalent ratios. | none |
| `solving-missing-value-ratio-problems` | Solving Missing-Value Ratio Problems | 6.RP.A.3a | Use a ratio table or double number line to solve a missing-value problem and plot the ratio pairs on the coordinate plane. | none |
| `unit-rates-and-unit-pricing` | Unit Rates & Unit Pricing | 6.RP.A.2 | Compute the unit rate a/b for a ratio a:b (b≠0) and use it to compare unit prices between two offers. | none — closest match is the shipped `m7math-u3-ratios-and-unit-rates.ts` (not a legacy `g7-*` file; that seed's own LO description cites 6.RP.A.2 as the prerequisite this lesson teaches) |

## Unit 2 — Percent & Measurement Conversion

| Slug | Title | Standard | Scope | Salvage |
|---|---|---|---|---|
| `percent-as-rate-per-100` | Percent as a Rate per 100 | 6.RP.A.3c | Understand percent as a rate per 100; convert between a percent, its fraction, and its decimal form. | none |
| `finding-the-percent-of-a-quantity` | Finding the Percent of a Quantity | 6.RP.A.3c | Find the percent of a whole-number quantity (e.g., 30% of 60) using rate-per-100 reasoning. | `g7-math-percent-applications.ts` ("Percent applications: tip, tax, discount, interest") — adjacent ground one level up; salvage only for word-problem phrasing/context, not for the applied-percent skill itself (tax/tip/discount/interest stay G7) |
| `finding-the-whole-given-a-part-and-percent` | Finding the Whole Given a Part & Percent | 6.RP.A.3c | Given a part and the percent it represents, find the whole quantity. | none |
| `converting-measurement-units` | Converting Measurement Units | 6.RP.A.3d | Use ratio reasoning to convert measurement units within a system (e.g., feet to inches, grams to kilograms). | none |

## Unit 3 — Dividing Fractions

| Slug | Title | Standard | Scope | Salvage |
|---|---|---|---|---|
| `meaning-of-fraction-division` | The Meaning of Fraction Division | 6.NS.A.1 | Build meaning for dividing a fraction by a fraction using visual models (area models, number lines) before any algorithm. | none |
| `dividing-fractions-by-fractions` | Dividing Fractions by Fractions | 6.NS.A.1 | Fluently divide a fraction by a fraction using the invert-and-multiply algorithm. | none |
| `dividing-mixed-numbers` | Dividing Mixed Numbers | 6.NS.A.1 | Convert mixed numbers to improper fractions, then divide fluently. | none |
| `word-problems-with-fraction-division` | Word Problems with Fraction Division | 6.NS.A.1 | Solve real-world word problems that require dividing a fraction (or mixed number) by a fraction. | none |

## Unit 4 — Multi-Digit & Decimal Operations

| Slug | Title | Standard | Scope | Salvage |
|---|---|---|---|---|
| `dividing-multi-digit-whole-numbers` | Dividing Multi-Digit Whole Numbers | 6.NS.B.2 | Fluently divide multi-digit whole numbers using the standard algorithm. | none |
| `adding-and-subtracting-decimals` | Adding & Subtracting Decimals | 6.NS.B.3 | Fluently add and subtract multi-digit decimals using the standard algorithm. | none |
| `multiplying-and-dividing-decimals` | Multiplying & Dividing Decimals | 6.NS.B.3 | Fluently multiply and divide multi-digit decimals using the standard algorithm. | none |
| `gcf-lcm-and-the-distributive-property` | GCF, LCM & the Distributive Property | 6.NS.B.4 | Find the GCF and LCM of two whole numbers ≤100/≤12; use the distributive property to express a sum of two whole numbers with a common factor. | none |

## Unit 5 — Negative Numbers & Absolute Value

| Slug | Title | Standard | Scope | Salvage |
|---|---|---|---|---|
| `negative-numbers-in-context` | Negative Numbers in Context | 6.NS.C.5 | Understand that positive and negative numbers describe quantities with opposite directions or values (elevation, temperature, credit/debit). | none |
| `rational-numbers-on-the-number-line` | Rational Numbers on the Number Line | 6.NS.C.6a | Place integers and other rational numbers on a number line; understand that the opposite of the opposite of a number is the number itself. | `g7-math-integer-operations.ts` ("Operations with Integers") — one level up (adds +,−,×,÷ on integers); salvage only for number-line visuals/framing, not for arithmetic operations, which stay G7 |
| `absolute-value` | Absolute Value | 6.NS.C.7c/d | Interpret absolute value as a number's magnitude/distance from zero; distinguish an absolute-value comparison from an order comparison. | none |
| `ordering-rational-numbers` | Ordering Rational Numbers | 6.NS.C.7a/b | Write, interpret, and order statements of inequality about rational numbers in real-world contexts. | none |

## Unit 6 — The Coordinate Plane

| Slug | Title | Standard | Scope | Salvage |
|---|---|---|---|---|
| `plotting-points-in-all-four-quadrants` | Plotting Points in All Four Quadrants | 6.NS.C.6b/c | Extend number-line understanding to plot ordered pairs of rational numbers in all four quadrants of the coordinate plane. | none |
| `reflecting-points-across-the-axes` | Reflecting Points Across the Axes | 6.NS.C.6b | Find and interpret the reflection of a plotted point across one or both axes using sign changes in its coordinates. | none |
| `finding-distance-between-points` | Finding Distance Between Points | 6.NS.C.8 | Find the distance between two points that share a first or second coordinate, using absolute value. | none |
| `solving-real-world-coordinate-plane-problems` | Real-World Coordinate Plane Problems | 6.NS.C.8 | Solve real-world and mathematical problems by graphing points in all four quadrants of the coordinate plane. | none |

## Unit 7 — Expressions & Exponents

| Slug | Title | Standard | Scope | Salvage |
|---|---|---|---|---|
| `numerical-expressions-with-exponents` | Numerical Expressions with Exponents | 6.EE.A.1 | Write and evaluate numerical expressions involving whole-number exponents. | none |
| `writing-and-evaluating-algebraic-expressions` | Writing & Evaluating Algebraic Expressions | 6.EE.A.2a/c | Write an algebraic expression from a word phrase and evaluate expressions (including formulas) for given variable values. | none |
| `parts-of-an-expression` | Parts of an Expression | 6.EE.A.2b | Identify parts of an expression — terms, factors, coefficients — using correct mathematical vocabulary. | none |
| `equivalent-expressions` | Equivalent Expressions | 6.EE.A.3/A.4 | Apply properties of operations (distributive property, combining like terms) to generate and identify equivalent expressions with nonnegative whole-number coefficients. | `g7-math-distributive-combine.ts` ("Distributive Property and Combining Like Terms") — directly adjacent; G7 escalates to negative/rational coefficients. Salvage for example shapes only; keep G6 coefficients nonnegative whole numbers. NOTE (corrected 2026-09-02): factoring a numeric GCF out of an algebraic expression IS Grade 6 — it is 6.EE.A.3's own illustrative example (24x + 18y = 6(4x + 3y)) — and this row teaches it as the distributive move run backward |

## Unit 8 — Equations, Inequalities & Relationships

| Slug | Title | Standard | Scope | Salvage |
|---|---|---|---|---|
| `what-it-means-to-solve-an-equation` | What It Means to Solve an Equation | 6.EE.B.5 | Understand solving an equation or inequality as finding the values from a set that make it true; use substitution to check a candidate solution. | none |
| `solving-one-step-equations` | Solving One-Step Equations | 6.EE.B.6/B.7 | Write and solve one-step equations of the form x+p=q and px=q for nonnegative rational numbers. | `g7-math-one-step-equations.ts` ("Solving One-Step Equations") — directly adjacent; G7 extends to negative/rational coefficients. Salvage for problem structure only; keep G6 examples nonnegative |
| `writing-and-graphing-inequalities` | Writing & Graphing Inequalities | 6.EE.B.8 | Write an inequality to represent a real-world constraint and represent its infinitely many solutions on a number line. | `g7-math-inequalities.ts` ("Solving and graphing inequalities") — adjacent; G7 adds solving multi-step/negative-coefficient inequalities. Salvage for number-line graphing convention only |
| `dependent-and-independent-variables` | Dependent & Independent Variables | 6.EE.C.9 | Use variables to represent two quantities in a real-world relationship, write an equation expressing one in terms of the other, and analyze the relationship with tables and graphs. | none |

## Unit 9 — Area, Surface Area & Volume

| Slug | Title | Standard | Scope | Salvage |
|---|---|---|---|---|
| `area-of-triangles-and-quadrilaterals` | Area of Triangles & Quadrilaterals | 6.G.A.1 | Find the area of triangles and special quadrilaterals by composing/decomposing into rectangles and triangles. | none |
| `polygons-in-the-coordinate-plane` | Polygons in the Coordinate Plane | 6.G.A.3 | Draw a polygon in the coordinate plane given the coordinates of its vertices; find a side length using coordinates (connects to Unit 6). | none |
| `volume-of-rectangular-prisms` | Volume of Rectangular Prisms | 6.G.A.2 | Find the volume of a right rectangular prism with fractional edge lengths by packing unit cubes and applying V = lwh. | none |
| `nets-and-surface-area` | Nets & Surface Area | 6.G.A.4 | Represent a 3D figure using a net of rectangles and triangles; use the net to find surface area. | `g7-math-volume-prisms-pyramids.ts` ("Volume of prisms and pyramids") — adjacent; G7 adds pyramids and composite solids. Salvage for prism example shapes only; G6 never reaches pyramids |

## Unit 10 — Statistics: Distributions, Center & Spread

| Slug | Title | Standard | Scope | Salvage |
|---|---|---|---|---|
| `statistical-questions` | Statistical Questions | 6.SP.A.1 | Recognize and formulate a statistical question as one that anticipates variability in the data collected to answer it. | none |
| `dot-plots-and-histograms` | Dot Plots & Histograms | 6.SP.B.4 | Display a numerical data set using dot plots and histograms on a number line. | none |
| `measures-of-center` | Measures of Center | 6.SP.A.3/B.5 | Find and interpret the mean and median of a data set as measures of center; choose the more appropriate measure given the data's shape. | none |
| `measures-of-spread-and-summarizing-data` | Measures of Spread & Summarizing Data | 6.SP.A.2/B.4/B.5 | Describe the spread (range, interquartile range, box plots) and overall shape of a distribution, and summarize a data set in the context it was collected. | none |

---

## Progression rationale (feeds Grade 7)

- **Ratios → proportional relationships**: Unit 1–2 build ratio language, tables, unit rate, and rate-per-100 percent — G7 U3 (`Ratios & Proportional Relationships`) opens by citing 6.RP.A.2 directly and escalates to constant of proportionality and fraction-valued unit rates, which G6 never touches.
- **Number system → rational numbers**: Unit 5–6 build the number line, absolute value, ordering, and the four-quadrant coordinate plane with rational-number *values* but no negative-number *arithmetic* — G7 U1–U2 (`Rational Numbers` / `Operations with Rational Numbers`) is exactly where +,−,×,÷ on signed numbers is introduced.
- **Percent basics → percent applications**: Unit 2 stops at rate-per-100 and part/whole percent — G7 U4 (`Percent & Applications`) is where tax, tip, discount, markup, percent change, and simple interest live.
- **Expressions/equations → their two-step, signed-coefficient forms**: Unit 7–8 stay nonnegative, one-step, one-variable — G7 U5–U6 add negative/rational coefficients and two-step equations. Factoring a numeric GCF out is Grade 6 (6.EE.A.3) and lives in row 7.4; what G7 adds is factoring with negative and rational coefficients.
- **Geometry**: Unit 9 covers polygon area, rectangular-prism volume, and nets/surface area — G7 U8 adds circles and pyramid/composite-solid volume and surface area; G7 U7 (angles, scale drawings, cross-sections) has no G6 antecedent by design (new in 7th grade).
- **Statistics**: Unit 10 establishes a single data set's center and spread — G7 U9 (`Statistics & Sampling`) moves to populations, random sampling, and comparing two data sets.

## Explicitly excluded (reserved for G7/G8, not covered here)

- Arithmetic operations (+, −, ×, ÷) on negative/rational numbers — G7 U1–U2.
- Constant of proportionality, proportional-relationship equations (y = kx), graphing proportionality tests, complex-fraction unit rates — G7 U3.
- Percent increase/decrease, simple interest, percent error, tax/tip/discount/markup — G7 U4.
- Two-step equations, inequalities with negative coefficients, factoring with negative or rational coefficients — G7 U5–U6. (CORRECTED 2026-09-02: this line previously read "factoring expressions" wholesale, which under-covered 6.EE.A.3 — pulling a numeric GCF out of an algebraic expression is a Grade 6 skill and is taught in row 7.4.)
- Angle relationships, scale drawings, triangle side/angle conditions, cross-sections of solids — G7 U7 (no G6 antecedent).
- Circumference/area of circles, surface area and volume of pyramids and composite solids — G7 U8.
- Random sampling, inference from samples, comparing two populations — G7 U9.
- Probability (all forms) — no CCSS Grade 6 probability standard; begins at 7.SP.C (G7 U10).
