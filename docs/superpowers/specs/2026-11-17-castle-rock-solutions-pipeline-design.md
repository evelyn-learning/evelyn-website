# Castle Rock solutions pipeline — design

Date: 2026-11-17 (Pacific). For Praveen's approval. Nothing here is built yet.

## 1. What this is for

Castle Rock (SOLARO) sends us questions. For each one we return a written
five-section solution and an animated, voiced version of it (Praveen,
2026-11-17: all 4,000 are enhanced, and enhanced means animated; that is what
sets these apart from what is already in the market). Julie May's team reviews
them on Keystone (https://keystone.evelynlearning.com). The MOU's first target
is 4,000, with a prototype set of about 100 first.

Today each solution is written by hand in a Claude Code session, with whatever
checks the session happens to do. The three solutions made on 2026-11-17 had a
key match, hand arithmetic and a look at the rendered page, and nothing else.
That does not scale to 4,000 and it is not good enough for the bar Praveen has
set: **no error of ours should reach Castle Rock.**

No pipeline can promise zero errors. This one is built so that an error has to
get past several independent checks to escape, and so that every escape is
counted and turned into a new check.

## 2. Goals, non-goals, anti-goals

**Goals**

1. Every solution is created, checked and corrected by AI before any person
   looks at it.
2. A wrong answer has to fool two solvers from different vendors, the key
   (when there is one) and a code check before it can pass.
3. Julie's format and style rules are checked on every solution, by a model
   that did not write it.
4. Problems that are Castle Rock's to fix (an incomplete question, a key we
   disagree with) are found before a solution is written and are shown to them
   under their own status.
5. Praveen sees only what needs him: flagged solutions and a random sample.
   Everything else goes to review by itself after a fixed wait.
6. Praveen knows the state every morning without opening anything.
7. Every item has a record of what each check said, so a mistake can be traced.

**Non-goals (this build)**

- Running unattended. A batch is started by hand from a session (§4). Moving
  the trigger to the server comes later, after two or three clean batches.
- Building the animated stage in the first build. It is part of this design
  (§11) and every item gets one, but it is built second: it starts from an
  approved written solution, and one format question is with Julie (email of
  2026-11-17).
- Fingerprinting the delivered batches (agreed 2026-11-05; done at export).
- Driving cost down. Cost is measured per item from the first batch.

**Anti-goals: these would make it a failure even if it runs**

- A solution visible to Castle Rock before it is released to review.
- Our answer bent to match a key we could not reproduce.
- A solution released while any solver disagreement or failed check is open.
- The pipeline changing a solution Julie has approved.
- Any model name, tool name or "how this was made" wording in a solution.
- Telling Castle Rock a person checked every solution when one did not.

## 3. Approaches considered

| | How it runs | Why / why not |
|---|---|---|
| A. In Claude Code sessions | Solutions written and checked in a session with sub-agents | No API cost. But nothing happens unless a session is open, there is no repeatable record, and every checker is the same model family, so they share blind spots. |
| B. Fully on the server | A server process sees an upload and runs everything | Hands-off. But a lot to build before the first batch, and hard to steer while Julie's rules are still changing. |
| **C. Scripts started by hand + two server jobs** | Pipeline scripts in the repo call the model APIs; a session starts and supervises each batch; the server only does the timed release and the daily email | **Chosen (Praveen, 2026-11-17).** Repeatable, a record per item, different vendors as checkers, easy to adjust. Weakness: someone must start the run; the daily email says when items are waiting. |

Model calls in the pipeline use the API keys (Anthropic, OpenAI, DeepSeek),
not the subscription.

## 4. How a batch flows

```
Castle Rock uploads items (QTI zips + spreadsheet)
        │
        ▼
[1] Intake check ──── incomplete ──────────► Item data needed · with Castle Rock technical
        │ complete
        ▼
[2] Course known? ─── no ──────────────────► stays Received, listed in the daily email + a draft to Julie
        │ yes
        ▼
[3] Two blind solves (different vendors), then compare with the key
        │
        ├─ both agree, and differ from the key ─► Key query · with Castle Rock review
        ├─ they disagree ─► third solver ─► still no clear answer ─► held for Praveen
        │ agreed answer
        ▼
[4] Write the five-section solution from the agreed answer
[5] Code check of numbers, units, rounding, option letter
[6] Line-by-line working check (a model that did not write it)
[7] Rules audit against Julie's format and style (a model that did not write it)
[8] Render + SOLARO export check
        │
        ├─ any check fails ─► one automatic correction ─► fails again ─► held for Praveen
        │ all pass
        ▼
Ready (hidden from Castle Rock)
        │
        ├─ flagged, or picked for the sample ─► waits for Praveen ─► he sends it to review
        └─ clean ─► released to Julie's review 2 days after the items arrived
```

Started by hand: `npx tsx apps/marketing/scripts/keystone-pipeline.ts`
from a session, on the laptop, against the live Keystone database through the
tunnel. It works on every item in **Received**, plus items Julie sent back as
"Fix solution". It can be stopped and started again without redoing finished
steps.

## 5. The checks, one by one

**[1] Intake check: can this question be answered as it reached us?**
- Code: the QTI parses; every image and passage it refers to is in the
  package; a blank has its choices; a matching item has its premises;
  auto-marked types have a key.
- Keystone's reader handles choice items today. Reading and showing the other
  types Castle Rock uses (numerical and text entry, drop-down, drag and drop,
  matching) is part of this build, added as each type turns up in a batch. A
  type we cannot yet read is **our** problem: the item is held for Praveen as
  "type not supported yet" and is never sent back to Castle Rock as incomplete.
- Model: given the question exactly as Keystone will show it (text and
  images), "is anything missing that a student would need? name it."
- Fail → **Item data needed**, with a note that names what is missing. No
  solution is written. Julie's first review found three of these the hard way.

**[2] Course**
The course comes from the spreadsheet that arrives with the batch, never from
the item's own metadata (Vance, 2026-10-30: it is only a hint). An item with
no course is not solved, because "course-level methods only" cannot be checked
without it.

Today the upload always fills the course from the metadata and overwrites it
on a re-send. That changes: each item records where its course came from
(sheet or metadata), a re-send never overwrites a sheet value, and only a
sheet value counts.

The second section's heading is fixed today as "Diploma-style answer". It
becomes a property of the course: that wording for Alberta diploma courses
(Math 30-1, Math 30-2, Biology 30, Chemistry 30, Physics 30, Science 30), and
for any other course the wording Julie chooses (asked 2026-11-17). Until she
answers, items for other courses are held.

**What a batch is.** A batch is one spreadsheet: the items it lists. Its
arrival time is when the spreadsheet was uploaded (or an item's own upload, if
later). A re-sent item starts its own clock.

**[3] Two blind solves, then the key**
- Solver 1 (Anthropic) and solver 2 (OpenAI) each get the question, with its
  images, and nothing else: no key, no Castle Rock solution, not each other's
  answer. Each returns a final answer in a fixed form and short working.
- Answers are compared in code after normalising (option letters, sets of
  letters, numbers to the asked precision, label lists).
- Outcomes:

| Solver 1 vs solver 2 | Key | Result |
|---|---|---|
| agree | same as theirs | pass |
| agree | different | **Key query** to Castle Rock, with our answer and working. No solution written. |
| agree | none supplied | pass, marked "answer to confirm" for Julie, and a third solver must also agree |
| disagree | any | third solver. Two of three agree **and** match the key → pass but **flagged for Praveen**. Anything else → held for Praveen, nothing written. |

- The third solver is DeepSeek for text-only items. DeepSeek cannot read
  images. For an item with an image the third solver is Google's Gemini if
  Praveen agrees to a fourth vendor (a key is already in the project);
  otherwise a different OpenAI model, which is weaker because it shares a
  vendor with solver 2.
- **Written-response items** have no key and no single right wording. The two
  solvers' answers are compared by a third model against the points a full
  answer must contain. These always carry "answer to confirm" for Julie and
  are always held for Praveen.
- **Held before a solution exists** (solvers disagree, type not supported):
  Castle Rock sees "Drafting · with Evelyn".

**[4] Writing**
The author model writes the five sections to the rules in
`docs/whitelabel/castle-rock/keystone/FORMAT.md`, for the batch's course, from
the agreed answer. Castle Rock's own worked solution (it comes inside the QTI)
is given to the author only so that ours adds something different, as Julie
asked on 2026-10-08. It is never given to the solvers.

**[5] Code check**
For anything numeric the author also returns the calculation as expressions.
Code evaluates them (a small Python helper on the laptop using sympy's parser
with a whitelist; model output is never run as code)
and checks: the result equals the stated answer at the asked rounding;
rounding happens only at the last step; the number in the Short answer, the
Diploma answer's last sentence and the recorded answer are the same; the
option letter named is the key; units are present and consistent.

**[6] Working check**
A model that did not write the solution reads the working line by line and
must name the first line that does not follow, or say there is none. It also
solves any alternate method independently and confirms it ends at the same
answer.

**[7] Rules audit**
A model that did not write it marks each rule pass or fail, quoting the
offending text. The rule list moves into the repo, next to the pipeline code,
as the single source for the author's instructions and the audit (today's
FORMAT.md is on the laptop only and is not in git; it becomes a pointer).
Every new note from the reviewer becomes a rule there, with its date:
- section order and presence; Extended and Alternate only when warranted
- Short answer: a direct answer to the stem in the stem's words, no plan
- Diploma answer: lean, the plan for multi-part questions, one final-answer
  sentence, course-level methods only, rounding at the end
- no tour of the wrong options; Common errors at most two
- no "diploma" or jurisdiction wording unless the course is a diploma course
- Canadian spelling, SI spacing, italic variables, capitalised compass words
- figure rules (240 px, line weights, labels), table rules, alt text
- nothing about how the content was made

**[8] Render and export check (code)**
The page renders with no equation errors and every image resolves. The SOLARO
export builds: well-formed XHTML, every equation a PNG with alt text, and for
QTI items the package going back is well-formed with every file it names.

**Correction loop.** When [5], [6], [7] or [8] fails, the author gets the
finding and corrects once; the failed check and everything after it run again.
A second failure holds the item for Praveen. The answer itself is never
changed in a correction; a finding that the answer is wrong sends the item
back to [3].

## 6. Statuses

Existing statuses stay. Two are added.

| Status | Who sees it | With | Meaning |
|---|---|---|---|
| Received | all | Evelyn | uploaded, not yet through the pipeline |
| Item data needed | all | Castle Rock technical | exists; now also set by our intake check |
| **Key query** (new) | all | Castle Rock review | our two solvers agree with each other and not with the key |
| Drafting | all | Evelyn | in the pipeline, or sent back and being corrected |
| **Ready** (new) | Evelyn only; Castle Rock sees "Drafting" | Evelyn | passed, waiting for its release time or for Praveen |
| In review → Approved → Delivered, Solution changes, Rejected | all | as today | unchanged |

**Key query, on Castle Rock's side.** The item page shows our answer, their
key and our working. The reviewer has three choices: **The key is right**
(reason required), **Item data** (they correct and re-send the item; it
returns to us by itself, as today), or **Reject**.

After "The key is right", both solvers run again with the reviewer's reason in
front of them as an argument to weigh, not as the answer. If both now reach
the key, the solution is written and held for Praveen. If they still do not,
nothing is written and it is held for Praveen to settle with Julie. We never
write a solution to a key no solver can reproduce.

**Hidden until released.** Today a reviewer who opens a Drafting item can see
the draft solution. That changes: reviewer and technical roles see no solution
text for any version that has not been released to review. Every version that
exists today on the 28 items counts as released.

**The 28 items already on Keystone.** The solutions still in review are run
through the audit and working checks once, as a report for Praveen. Nothing is
changed on them by the pipeline.

## 7. Release and Praveen's look

- A clean solution is released **2 days after its batch arrived**, and only on
  a weekday between 8 am and 5 pm Mountain time (Castle Rock's working day),
  spread out and not all in the same minute. If a run starts late and the 2
  days have already passed, a solution still waits at least 4 working hours
  after it passes.
- A corrected solution (after Julie's "Fix solution") waits **1 day**.
- Held for Praveen, never released by the timer:
  - anything flagged in §5;
  - a random sample: **10% of each batch, at least 3**.
- Praveen's queue is a page on Keystone for the Evelyn role: each held
  solution with why it is held, what each solver answered, the key, and the
  audit findings. Three actions: **Send to review**, **Send back to the
  pipeline** (with a note the author must address), **Keep holding**.
- The release job runs on the server once an hour. It only moves items whose
  time has come; it calls no model.

## 8. Learning from Julie

- Every "Fix solution" from Julie is recorded with its cause (answer, working,
  format, style, other). The pipeline proposes the cause from her note; a
  session confirms it. A send-back about the answer re-runs the blind solves;
  any other cause re-runs writing and the checks with her note as an
  instruction the author must address. A session then turns the note into a
  rule in the rule file and re-audits every solution not yet approved against
  it. Approved solutions that would fail it are listed for Praveen, not
  changed.
- The count that matters: **send-backs caused by us, per batch.** Target zero.
  It is in the daily email with the cause of each.

## 9. Emails

**Daily status to Praveen.** Sent by a server job at 7 am Pacific to
praveen@evelynlearning.com through the existing Resend account. No model
involved. It says:
- how many items are in each status, grouped by whose move it is;
- what is waiting on Praveen, with links;
- what is received and not yet solved, and when its 2 days are up;
- what will be released today;
- what Castle Rock did in the last day (approvals, send-backs with the note);
- send-backs caused by us, this batch and in total;
- yesterday's pipeline cost and the cost per item so far;
- anything that failed (a run that stopped, a job that did not fire);
- replies waiting to be drafted (below).

**Drafts to Julie, Vance and Markus.** The Gmail connector exists only inside
a session, so the server cannot create a draft. The pipeline therefore records
a *suggested message* when one is called for (batch received; these items need
data; these keys are queried; this batch is in review; a course is missing).
The daily email lists them. In a session they are turned into Gmail drafts as
replies on the right thread, and marked done. Nothing is ever sent by the
pipeline; Praveen sends from his inbox.

## 10. Records, safety, cost

- **Run record per item:** which models, what each solver answered, each
  check's verdict and evidence, corrections made, time and cost. Kept in
  Keystone's database in a new collection; shown on Praveen's queue page.
- **Untrusted text.** Questions and reviewer notes are passed to models as
  data. Model replies must match a fixed shape or the step fails. Pipeline
  models have no tools. Calculations are evaluated by a whitelisted
  expression parser, never run as code.
- **Database.** New optional fields on items, one new collection for run
  records and one for suggested messages, all in `castle_rock_review`.
  Additive only.
- **Cost.** Recorded per call. Reported per item after the first batch; no
  estimate is promised before that.

## 11. Animated solutions: every item, built second

Every one of the 4,000 gets an animated, voiced version (Praveen, 2026-11-17).

**The shape, from the four Julie approved in October:** a voice explains each
move while a board draws the working, steps fold away as the next one plays,
and the written steps sit alongside. Open with Julie since the email of
2026-11-17: whether the folding and movement stay, given her later "no
collapsing sections" note for the written solution.

**Settled with Vance (October):** a self-contained page with its audio inside
the package and no calls outside it, shown in a frame whose height we set per
item; class names prefixed so they cannot clash with SOLARO's; 12 pt Arial;
explicit background; must work in Legacy Edge. He is not integrating it yet.

**Where it sits in the pipeline:** after Julie approves the written solution.

```
Written solution approved by Julie
        │
        ▼
[A1] Storyboard: the approved sections turned into spoken lines and board cues
[A2] Storyboard checks: every spoken number and step matches the written
     solution; narration follows the write-for-the-ear rules; nothing new is
     claimed that the written solution does not say
[A3] Voice recorded (paid per character)
[A4] Page built from the one player template
[A5] Page checks: plays start to finish; captions match the audio; no outside
     request; Vance's fit list; opens correctly inside Keystone
        │
        ▼
Ready (animated) ─► same hold, sample and timed release as §7 ─► Julie reviews the animated version
```

**Why after approval, not alongside:** the animated version repeats the written
one. Building it first would mean re-recording voice every time Julie asks for
a change to the text. Built from an approved solution, its answer and working
are already settled, so its checks only have to prove it says the same thing.

**Before any volume:** one sample (234035) is rebuilt on the current template
for Julie's approval of the format. The four October samples were built by
hand; the single player template they share is the thing to build.

**Voice.** Cartesia, the voices already chosen per subject. About 1,200
characters an item, so the 4,000 are in the region of 5 million characters.
The cost is not yet priced. Recording needs Praveen's go for each batch, and
is never part of an automated test.

**On Keystone:** an approved item gains a second track, "Animated", with the
same statuses and the same three ways to send it back. Delivery to SOLARO
carries both.

## 12. Calls I made that Praveen can change

1. Sample rate 10% of a batch, at least 3.
2. Release only on weekdays, 8 am to 5 pm Mountain time.
3. Corrected solutions wait 1 day (new ones 2 days).
4. Daily email at 7 am Pacific to praveen@evelynlearning.com.
5. The solvers never see the key; the key is compared afterwards.
6. A key we cannot reproduce goes to Castle Rock as a question; we never write
   a solution to a key we believe is wrong.
7. The animated version is built only after the written one is approved (§11).
8. Exact model versions are chosen at build time from each vendor's current
   documentation and kept in one config file: the strongest Anthropic model as
   author, the strongest OpenAI reasoning model as second solver, and the
   audit and working checks on a vendor other than the author's.

## 13. What this needs from Praveen

The pipeline writes to the live Keystone database from the laptop. The rule is
that writes through the tunnel need Praveen's go-ahead. This design asks for a
**standing go-ahead for pipeline runs on the `castle_rock_review` database
only**, each run started in a session.

Two more decisions: whether Gemini may be used as a fourth vendor for
questions with images (§5 [3]); and the go for voice recording when the
animated stage is built (§11).

## 14. Left to the builder

- File layout under `apps/marketing/src/lib/keystone/pipeline/` and the script
  names; prompt wording; the exact answer-normalising rules per item type.
- How the hourly job and the daily email are scheduled on the server (the box
  already runs dated jobs from crontab).
- The layout of Praveen's queue page and of the Key query view.
- Unit tests for every code check and for the outcome table in §5 [3]; a walk
  on the live site with a throwaway item, as `keystone-routing-e2e.ts` does.
