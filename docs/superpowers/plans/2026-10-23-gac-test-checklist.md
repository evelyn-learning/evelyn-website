# GAC test checklist — session-2 work (2026-10-23)

Text only (no voice). Sign in as a GAC test student. Where: the local stack http://localhost:3016 after `bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh restart`, or the GAC sandbox after the deploy. The local stack writes the LIVE databases.

Tick each box. When something fails, write down the problem's text, the time, and what you saw. A screenshot helps.

---

## 1. Typed problems become a homework set (A1)

Home → **Ask a question** → type the text exactly → submit.

For every problem below, unless the row says otherwise:
- [ ] You land on the problem's preview page (**Problem 1** with **Start tutoring**), not in a live session.
- [ ] The set appears under **Your homework**.
- [ ] Admin → Usage: the student's minutes go up by 1 per problem (typed sets bill like uploads).

### 1a. Problems that should get a figure

The figure must show only the numbers the problem states. It must never show the answer.

| # | Type this | Expected figure | ✓ |
|---|---|---|---|
| T1 | `Triangle ABC has a right angle at C. AC = 6 cm and BC = 8 cm. Find the length of AB.` | Right triangle with 6 and 8 marked; AB has no length | [ ] |
| T2 | `The graph of f(x) = x^2 - 4x + 3 is shown. Find the x-intercepts of the graph.` | Parabola graph; intercepts not labelled | [ ] |
| T3 | `A box plot of test scores has minimum 52, first quartile 64, median 71, third quartile 80 and maximum 95. What is the interquartile range?` | Box plot with those five values; no IQR | [ ] |
| T4 | `Points A(1, 2), B(5, 2) and C(5, 6) are the vertices of a triangle on a coordinate plane. Find the area of triangle ABC.` | Coordinate plane, three points joined; no area | [ ] |
| T5 | `A cylinder has a radius of 3 cm and a height of 10 cm. Find its volume. Leave your answer in terms of pi.` | Cylinder labelled r = 3, h = 10 | [ ] |
| T6 | `The table shows x = 1, 2, 3, 4 and y = 5, 8, 11, 14. Write an equation for y in terms of x.` | Two-column table with those values | [ ] |
| T7 | `In a Venn diagram of 30 students, 5 students are in both the Soccer and Basketball circles, 13 are in Soccer only and 7 are in Basketball only. How many students are in neither club?` | Two-circle Venn with 13, 5, 7; the "neither" region empty | [ ] |
| T8 | `A circle has center O. Points A and B are on the circle and angle AOB = 70 degrees. Find the measure of the inscribed angle ACB, where C is another point on the circle.` | Circle with O, A, B, C; 70° marked; angle ACB not given | [ ] |

### 1b. Problems where the figure must hold back

| # | Type this | Expected | ✓ |
|---|---|---|---|
| T9 | `Solve 3x - 5 > 7 and graph the solution on a number line.` | No figure, or an empty number line. The solution x > 4 must never be drawn. | [ ] |
| T10 | `Maria has 3 times as many stickers as Leo. Together they have 48 stickers. How many stickers does Leo have?` | No tape diagram drawn with Leo's 12 (lengths are not stated) | [ ] |

### 1c. Routing cases

| # | Type this | Expected | ✓ |
|---|---|---|---|
| T11 | `Solve 2x + 3 = 11.` | Set of one problem, no figure, preview page | [ ] |
| T12 | `1. Solve 2x + 3 = 11.  2. Solve 5x - 4 = 16.` | Set of TWO problems; opens the set list (not a preview) | [ ] |
| T13 | `7. Solve 4x + 1 = 21.` | Set of one problem; the preview opens (no "not found") | [ ] |
| T14 | `quadratic equations` | NOT a set: a normal lesson session starts (see section 3) | [ ] |
| T15 | A long paste (over 300 characters). Use the text of T1, T4 and T5 together in one box. | Set of three problems; the list opens | [ ] |

For T1, open the problem and run one tutoring pass:
- [ ] The tutor's first message shows the figure on the board in the same turn it describes it (B6). It does not ask you to picture a figure that isn't there.
- [ ] Give the right answer (`10 cm`): accepted.

---

## 2. Confirmed parts carry over a pause (A2)

Ask a question → type:

`A rectangle has a length of (x + 5) cm and a width of 4 cm. (a) Write an expression for the perimeter of the rectangle. (b) The perimeter is 34 cm. Find x. (c) Find the area of the rectangle.`

1. [ ] Start tutoring. Answer **(a)** correctly (`2(x + 5) + 8`, or `2x + 18`) and wait until the tutor confirms it.
2. [ ] Click **← Back to list**. The card reads "Checking your work…", then settles on **In progress**.
3. [ ] Open the problem again → **Start tutoring**. The tutor does NOT ask for (a) again. It moves on to (b), or says (a) is already done.
4. [ ] Answer **(b)** correctly (`x = 4`). Click **← Back to list** again and wait for **In progress**.
5. [ ] Reopen. The tutor goes straight to (c). It does not re-check (a) or (b).
6. [ ] Answer **(c)** (`36 cm²`), then **I've finished this problem**. The card ends on **Done**.
7. [ ] Control run: type the same problem again (a new set). Pause before answering anything, then reopen. The tutor starts at (a), so nothing was carried in from the other set.

---

## 3. Typed topics → a lesson (lesson path unchanged; checks B8 + B7)

Ask a question → type each topic. Each should start a normal lesson session, not a set.

| # | Type this | Check | ✓ |
|---|---|---|---|
| L1 | `quadratic equations` | Lesson starts. When the lesson moves to its next section, the tutor's message introduces that section. It is never just "Here we go." (B8) | [ ] |
| L2 | `slope of a line` | Same as L1 | [ ] |
| L3 | `photosynthesis` | Same as L1 | [ ] |
| L4 | `graphing linear inequalities` | When asked where the solutions lie, answer in words, e.g. `the points above the line` or `they stay above the line`. It should be accepted when correct (B7). | [ ] |
| L5 | `Pythagorean theorem` | If the opener talks about a picture, the picture is on the board in that same turn (B6) | [ ] |

---

## 4. Upload sheets (also covers the figure vocabulary)

Make each sheet in Claude Web as a one-page worksheet image (PNG) or PDF. Ask for a clean, printed look: black on white, numbered problems, each figure drawn with its labels.

Two rules hold for every sheet:
- Every number a figure shows must also be printed in the problem text, or clearly labelled on the figure.
- No figure may show the answer.

Paste each description into Claude Web as written.

**Sheet U1 — Statistics charts (box plot, histogram, dot plot, bar, pie)**
> Make a printable 5-problem statistics worksheet with one chart per problem. (1) A box plot of quiz scores with minimum 40, Q1 55, median 62, Q3 75, maximum 90, each value labelled on the axis; ask for the range and the IQR. (2) A histogram of heights with bins 150–155: 3, 155–160: 7, 160–165: 10, 165–170: 6, 170–175: 2, counts printed on the bars; ask how many students are 160 cm or taller. (3) A dot plot of the number of pets per student for 12 students: 0,1,1,1,2,2,2,2,3,3,4,5; ask for the median. (4) A bar chart of favourite fruit: Apple 8, Banana 5, Orange 6, Grape 3, values printed above bars; ask what fraction chose Apple. (5) A pie chart with sectors labelled Rent 40%, Food 25%, Transport 15%, Savings 20%; ask how much goes to Food from a $2,000 budget.

**Sheet U2 — Tables, scatter plot, number line**
> Make a printable 4-problem worksheet. (1) An input–output table x: 0, 1, 2, 3 and y: 2, 5, 8, 11; ask for the rule. (2) A two-way frequency table of 50 students by grade (9th, 10th) and club (Yes, No) with all four cells and totals printed; ask for the probability a random 10th grader is in a club. (3) A scatter plot of hours studied vs test score with 8 labelled points (1,55), (2,60), (3,62), (4,70), (5,74), (6,78), (7,85), (8,88), no trend line; ask whether the correlation is positive or negative. (4) A number line from −5 to 5 with a closed dot at −2 and an open dot at 3 and the segment between them shaded; ask the student to write the inequality shown.

**Sheet U3 — 3D solids**
> Make a printable 4-problem geometry worksheet, one labelled 3D solid per problem: (1) rectangular prism 5 cm × 3 cm × 4 cm, find the volume; (2) cone with radius 4 in and height 9 in, find the volume in terms of π; (3) square pyramid with base side 6 m and height 4 m, find the volume; (4) sphere with radius 2.5 cm, find the surface area. Label each dimension on the drawing.

**Sheet U4 — Probability and sets (Venn, tree)**
> Make a printable 3-problem probability worksheet. (1) A two-circle Venn diagram for 40 students: Music only 12, Art only 9, both 6, neither 13, each number printed in its region; ask P(Music or Art). (2) A three-circle Venn diagram (A, B, C) with every region's count printed; ask how many are in exactly two sets. (3) A probability tree for flipping a coin twice, with 1/2 printed on every branch and outcomes HH, HT, TH, TT at the leaves (no leaf probabilities printed); ask for P(at least one head).

**Sheet U5 — Middle-school models (fraction bars, tape diagram, area model)**
> Make a printable 3-problem worksheet. (1) Two fraction bars, one with 3 of 4 parts shaded and one with 5 of 8 parts shaded; ask which fraction is larger. (2) A tape diagram with three equal parts labelled 12 each and one part labelled "?" to show the total; ask for the total. (3) An area model for 23 × 14 split into 20 + 3 by 10 + 4, with partial products left blank; ask the student to fill them in and find the product.

**Sheet U6 — Coordinate geometry and inequalities**
> Make a printable 3-problem worksheet. (1) A coordinate plane from −6 to 6 with quadrilateral PQRS at P(−3, 1), Q(2, 1), R(2, −3), S(−3, −3), each vertex labelled with its coordinates; ask for the perimeter. (2) A number line showing the inequality x ≤ −1 (closed dot at −1, arrow to the left), with the inequality "x ≤ −1" printed beside it; ask for two numbers that satisfy it. (3) A blank coordinate grid from −5 to 5; ask the student to plot (2, 3) and (−1, −4) and find the distance between them.

**Sheet U7 — Mixed geometry (the hard case)**
> Make a printable 4-problem geometry worksheet. (1) Two parallel lines cut by a transversal with one angle labelled 65°; ask for the alternate interior angle. (2) A square of side 10 cm with two quarter circles drawn from its two bottom corners, the region between them shaded; ask for the shaded area. (3) A circle with a central angle of 110° and an inscribed angle on the same arc; ask for the inscribed angle. (4) A right triangle with legs 9 and 12 and the hypotenuse unlabelled; ask for the hypotenuse.

For each sheet:
- [ ] Every card becomes ready. Each problem with a figure on the sheet shows a thumbnail.
- [ ] Each figure matches the sheet: values, labels, which side angles and shading are on. Note any mismatch with the problem number.
- [ ] No figure shows an answer. U1 (1) shows no IQR; U6 (2) is drawn only because the inequality is printed; U5 (3) leaves the partial products blank.
- [ ] Open one problem per sheet → **Start tutoring** → the tutor knows the figure. Give one right answer and one wrong answer.
- [ ] Admin → Usage: +1 minute per problem on the sheet.
- [ ] U7 (2): the quarter circles are drawn from the BOTTOM corners (the arc read fix).

---

## 5. Self Study

Self Study is not charged: no minutes should move for anything in this section.

Path: Home → **Self Study** → the subject pill (the course) → under **Unit 1** click the skill card (the "lesson") → the 3-question practice drill starts on its own.

The student must have finished or skipped the placement check first. A course pill shows only if that course is in the live catalog.

For each skill, answer one question right and one wrong. The drill should grade both; a figure item should show its figure.

| Course (pill) | Unit 1 skills to open | ✓ |
|---|---|---|
| Algebra 1 | Real Numbers & Operations · Order of Operations & Evaluating Expressions · Simplifying Expressions: Distributive Property & Like Terms | [ ] |
| Geometry | Points, Lines & Planes · Segment Measure, Distance & Midpoint · Angles & Angle Measure | [ ] |
| Biology | Characteristics of Life & Levels of Organization · Scientific Inquiry & Experimental Design in Biology · Water, pH & the Four Macromolecules | [ ] |
| Chemistry | Classifying Matter: Elements, Compounds & Mixtures · Physical & Chemical Properties and Changes · Measurement, SI Units & Significant Figures | [ ] |
| AP Statistics | U1.1 Variables and Categorical Data · U1.5 Quantitative Graphs (Dotplot, Stemplot, Histogram) · U1.6 Describing a Distribution (SOCS) | [ ] |
| AP Calculus BC | U1.1 Introducing Calculus: Can Change Occur at an Instant? · U1.2 Defining Limits and Using Limit Notation · U1.3 Estimating Limits from Graphs and Tables | [ ] |
| AP Environmental Science | U1.1 Ecosystems and Biomes · U1.2 Carbon and Water Cycles · U1.3 Nitrogen and Phosphorus Cycles | [ ] |
| AP Psychology | Scientific Foundations: Research Methods and Statistics (Unit 0) · U1.1 Nervous System Overview, Endocrine, and Heredity · U1.3 The Neuron and Neural Firing | [ ] |
| AP Macroeconomics | U1.1 Scarcity, Choice, and Trade-offs · U1.2 Resource Allocation and Economic Systems · U1.3 Production Possibilities Curve | [ ] |
| AP US Government & Politics | U1.1 Ideals of Democracy & Types of Democracy · U1.4-1.5 The Articles of Confederation, the Convention & Ratification · U1.6 Separation of Powers & Checks and Balances | [ ] |
| AP United States History | U1.2 Native American Societies Before European Contact · U1.4 The Columbian Exchange · U1.6 Spanish Colonization and Labor Systems | [ ] |
| AP World History: Modern | U1.1 Developments in East Asia · U1.2 Developments in Dar al-Islam · U1.3 Developments in South and Southeast Asia | [ ] |
| AP English Language & Composition | U1.1 The Rhetorical Situation · U1.2 Reading for the Writer's Claim · U1.3 Writing a Defensible Thesis | [ ] |
| HS English | Parts of Speech in Action · Subject-Verb Agreement · Pronouns: Agreement, Case & Clarity | [ ] |
| World History | From Foragers to Farmers: The Neolithic Revolution · What Makes a Civilization? · Mesopotamia & Egypt: River Valley Civilizations | [ ] |

The six generated courses may also show up, but the repo cannot confirm they have practice. If a skill card opens with no questions, note it.

| Course | First skills | ✓ |
|---|---|---|
| Physics | Distance, Displacement, Speed, and Velocity · Position-Time and Velocity-Time Graphs | [ ] |
| Precalculus | Determine domain and range of functions · Analyze function behavior from a graph | [ ] |
| Algebra 2 | Solve Two-Variable Linear Systems · Solve Three-Variable Linear Systems | [ ] |
| AP Calculus AB | Estimate limits from graphs and tables · Evaluate limits using algebraic properties | [ ] |
| AP Biology | Water's Properties and Hydrogen Bonding · Elements in Macromolecules | [ ] |
| AP Chemistry | Convert between mass, moles, and particles · Calculate average atomic mass from isotopes | [ ] |

In AP US Gov, AP US History and AP World History, later units have skills with no practice yet. Stay in Unit 1 there.

---

## 6. Billing

- [ ] Typed set: +1 min per problem (section 1).
- [ ] Upload: +1 min per problem (section 4).
- [ ] 5-minute minimum: start a tutoring session, send one message, end it within a minute. Admin Usage shows 5 minutes for that session. Do this check only after the A3 change is deployed.
- [ ] 80 % warning email (B9): an automated test covers it. A manual check needs a student set close to their allowance, so skip it unless one is set up.

---

## 7. Teacher / admin glance

- [ ] Teacher view lists the student's typed and uploaded sets.
- [ ] Admin Usage roster, Students roster and daily report agree for the test student.
