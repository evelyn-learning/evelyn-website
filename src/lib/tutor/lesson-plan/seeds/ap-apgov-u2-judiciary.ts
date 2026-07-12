/**
 * AP US Government & Politics — CED Unit 2.8-2.11: The Federal Judiciary.
 *
 * Unit-2 Vertical Slice content plan (follows the Unit-1 calibration
 * template — see ap-apgov-u1-federalism.ts for the shared Passage/rubric
 * infra this plan reuses). Third stop in Unit 2's institutional walk,
 * following directly from ap-apgov-u2-presidency.ts.
 *
 * NOTE ON LO ID: uses the "judiciary-independence" slug, NOT plain
 * "judicial" — this Unit-2 slice is a fresh, standalone LO and does not
 * collide with any existing plan, but the slug is chosen deliberately (per
 * the AP Plans Initiative naming convention) to describe the lesson's
 * actual content — judicial independence and its limits — rather than a
 * bare topic label.
 *
 * Covers Article III (life tenure during good behavior, salary
 * protection); Marbury v. Madison (1803) establishing judicial review;
 * precedent and stare decisis; judicial activism versus restraint; and the
 * checks Congress, the President, and the amendment process hold over the
 * courts.
 *
 * DOCUMENT STIMULUS: the anchor is evelyn.passage.apgov-federalist-78.v1,
 * Hamilton's "least dangerous branch" argument. The seeded excerpt (per
 * that passage's own docblock) covers only two things: (1) the judiciary
 * as the "least dangerous" branch, having "neither FORCE nor WILL, but
 * merely judgment," dependent on the Executive to enforce its judgments;
 * and (2) permanent tenure as the guarantee of judicial independence, plus
 * the courts' duty to void unconstitutional acts. The worked example below
 * contrasts that excerpt with the Marbury v. Madison opinion excerpt
 * (evelyn.passage.apgov-marbury-opinion.v1, seeded in Task 1 but not wired
 * as a passageId on any segment here) — quoting only the text each passage
 * actually contains, per that passage's own docblock: "It is emphatically
 * the province and duty of the judicial department to say what the law
 * is" and "a law repugnant to the constitution is void."
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U2_JUDICIARY: LessonPlan = {
  id: 'evelyn.ap.apgov.judiciary-independence.v1',
  title: 'U2.8-2.11 The Federal Judiciary',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.judiciary-independence',
      description:
        'Explain Article III\'s design for judicial independence (life tenure during good behavior, salary protection); how Marbury v. Madison (1803) established judicial review; the roles of precedent/stare decisis and the judicial-activism-versus-restraint debate; and the checks Congress, the President, and the amendment process hold over the federal courts.',
      standard: 'AP-APGOV-2.8/2.9/2.10/2.11',
    },
  ],
  prerequisites: ['apgov.presidency-power', 'apgov.constitution-ratification'],
  followUps: ['apgov.bureaucracy-accountability'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see judicial review not as text the Founders wrote into the Constitution, but as a power the Supreme Court claimed for itself in 1803 — and to wonder why the weakest-sounding branch ended up with the final word on what the Constitution means.',
      script:
        "We've covered Congress and the Presidency. Now the branch the Constitution's own defenders once called the weakest of the three. In Federalist No. 78, Hamilton argued the judiciary would always be the \"least dangerous\" branch — it has no army to enforce its rulings and no power of the purse to fund anything. And yet: today, when the Supreme Court says a law is unconstitutional, that law is dead. Where did THAT power come from? Here's the twist — it's not in Article III's text at all. The Supreme Court gave itself that power, in a single 1803 case, Marbury v. Madison. Today we look at how a branch with \"neither force nor will\" ended up deciding what the Constitution means — and at the very real limits Congress and the President still hold over it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-judiciary-independence-review-checks',
      kind: 'concept',
      goal: 'Explain Article III\'s independence design, Marbury v. Madison and judicial review, precedent/stare decisis, activism versus restraint, and the checks on the courts.',
      keyIdeas: [
        'ARTICLE III AND JUDICIAL INDEPENDENCE: Article III establishes the Supreme Court and gives Congress the power to create lower federal courts. Federal judges and justices serve during "good Behaviour" — effectively LIFE TENURE, removable only through impeachment — and their salaries cannot be reduced while they hold office. Both protections exist for the same reason: to insulate judges from political pressure so they can rule against Congress, the President, or public opinion without fear of losing their job or pay.',
        'MARBURY V. MADISON (1803) — JUDICIAL REVIEW: outgoing President John Adams made a batch of last-minute judicial appointments; incoming Secretary of State James Madison withheld one commission (to William Marbury). Marbury sued directly in the Supreme Court under a provision of the Judiciary Act of 1789. Chief Justice John Marshall\'s opinion held that the relevant provision of the Judiciary Act was itself UNCONSTITUTIONAL, because it improperly expanded the Supreme Court\'s original jurisdiction beyond what Article III allows. In deciding this, the Court asserted JUDICIAL REVIEW — the power of federal courts to declare an act of Congress void when it conflicts with the Constitution. This power is NOWHERE stated in Article III\'s text; the Court established it for itself, by precedent, in this single case.',
        'PRECEDENT AND STARE DECISIS: once a court decides a legal question, that decision becomes PRECEDENT — a rule future courts are expected to follow in similar cases. STARE DECISIS ("let the decision stand") is the doctrine that courts should generally follow precedent rather than re-litigate settled questions each time, promoting predictability and stability in the law. Courts CAN overturn their own precedent (the Supreme Court has done so), but stare decisis creates a strong presumption against doing so lightly.',
        'JUDICIAL ACTIVISM VS. JUDICIAL RESTRAINT: judicial ACTIVISM describes a judicial philosophy willing to overturn precedent, strike down laws, or read the Constitution in new ways to address current circumstances or societal needs. Judicial RESTRAINT describes a philosophy favoring deference to precedent and to the decisions of the elected branches, overturning laws only when a violation is clear. These are descriptions of judicial PHILOSOPHY, not fixed positions tied to any one political party — judges across the spectrum can be described as more activist or more restrained depending on the case and the era.',
        'CHECKS ON THE COURTS: despite independence, the federal judiciary is not unchecked. APPOINTMENTS: the President nominates, and the SENATE must confirm, every federal judge and justice — a substantial check on who sits on the bench. JURISDICTION: Congress has significant control over the STRUCTURE and JURISDICTION of the federal court system below the Supreme Court, and some scope to regulate the Supreme Court\'s appellate jurisdiction. CONSTITUTIONAL AMENDMENT: if a Supreme Court ruling interprets the Constitution in a way the public or Congress strongly disagrees with, the only way to directly override that interpretation is a constitutional amendment (a high bar, but the Fourteenth Amendment itself effectively displaced parts of the Court\'s Dred Scott reasoning). ENFORCEMENT: courts have no independent means to enforce their own rulings — they depend on the executive branch to carry them out, echoing Hamilton\'s "neither force nor will" argument.',
      ],
      vocabulary: [
        {
          term: 'judicial review',
          definition:
            "the power of federal courts to declare a law or executive action unconstitutional and void; not stated in Article III's text, established by the Supreme Court itself in Marbury v. Madison (1803).",
        },
        {
          term: 'life tenure (good behavior)',
          definition:
            'federal judges and justices serve for life absent impeachment, and their salaries cannot be reduced while in office — designed to insulate the judiciary from political pressure.',
        },
        {
          term: 'precedent',
          definition:
            'a prior court decision that establishes a rule future courts are expected to follow in similar cases.',
        },
        {
          term: 'stare decisis',
          definition:
            'the doctrine that courts should generally follow precedent rather than re-litigate settled legal questions, promoting stability and predictability.',
        },
        {
          term: 'judicial activism',
          definition:
            'a judicial philosophy willing to overturn precedent or strike down laws to address current circumstances, rather than deferring narrowly to precedent and the elected branches.',
        },
        {
          term: 'judicial restraint',
          definition:
            'a judicial philosophy favoring deference to precedent and to the decisions of the elected branches, striking down laws only when a violation is clear.',
        },
      ],
      passageId: 'evelyn.passage.apgov-federalist-78.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-federalist-78-vs-marbury',
      kind: 'worked_example',
      problem:
        'Analyze these two documents together. First, Federalist No. 78 (Alexander Hamilton, 1788): "...the judiciary, from the nature of its functions, will always be the least dangerous to the political rights of the Constitution... It may truly be said to have neither FORCE nor WILL, but merely judgment; and must ultimately depend upon the aid of the Executive arm even for the efficacy of its judgments." Second, the Supreme Court\'s opinion in Marbury v. Madison (Chief Justice John Marshall, 1803), issued fifteen years later: "It is emphatically the province and duty of the judicial department to say what the law is... that a law repugnant to the constitution is void, and that courts, as well as other departments, are bound by that instrument." What did Hamilton claim about the judiciary\'s power in 1788, what power did the Court assert for itself in Marbury, and are the two texts actually in tension with each other?',
      steps: [
        'SOURCE BOTH TEXTS. Federalist No. 78 (Hamilton, 1788) defends Article III\'s design before ratification. Marbury v. Madison (Marshall\'s opinion, 1803) is the Supreme Court\'s own later assertion of a specific power — fifteen years after Hamilton\'s essay, and after the Constitution was already in effect.',
        'HAMILTON\'S CLAIM: THE "LEAST DANGEROUS" BRANCH. Hamilton argues the judiciary is structurally the WEAKEST branch — it has "neither FORCE nor WILL, but merely judgment," and depends on the Executive to actually carry out ("the aid of the Executive arm") whatever it decides. Unlike Congress (which controls the purse and writes the rules) or the President (who commands the military), courts cannot make anyone comply on their own.',
        'MARSHALL\'S CLAIM IN MARBURY: THE POWER OF "JUDGMENT" ITSELF. Marshall asserts that it is "emphatically the province and duty of the judicial department to say what the law is" — and, when a statute conflicts with the Constitution, the Court will treat the statute as VOID. This is the specific power of judicial review: the authority to strike down an act of Congress.',
        'ARE THE TWO IN TENSION? NOT REALLY — THEY DESCRIBE DIFFERENT THINGS. Hamilton\'s claim is about ENFORCEMENT capacity: courts cannot compel compliance themselves. Marshall\'s claim in Marbury is about INTERPRETIVE authority: courts decide what the law IS. Judicial review is the single most powerful form of "merely judgment" a court can exercise — but exercising it doesn\'t give courts force or will; a court ruling still depends on the executive branch (or, in some cases, other actors\' voluntary compliance) to actually take effect.',
        'THE SYNTHESIS. Marbury shows that "merely judgment" can still be enormously consequential — the power to declare a law void reshapes what Congress and the President can do going forward. But Hamilton\'s structural point remains true even after Marbury: the judiciary still cannot enforce its own rulings, which is exactly why the checks-on-the-courts material (appointments, jurisdiction, amendment, and reliance on executive enforcement) still matters even for a branch that holds judicial review.',
      ],
      answer:
        "Hamilton, in Federalist No. 78, argued the judiciary would be the structurally weakest branch — having \"neither FORCE nor WILL, but merely judgment,\" and depending on the executive branch to enforce whatever it decides. Fifteen years later, in Marbury v. Madison (1803), Chief Justice Marshall asserted that it is the judiciary's role \"to say what the law is,\" including declaring a law that conflicts with the Constitution void — the power of judicial review. The two texts are not really in tension: Hamilton's claim is about enforcement capacity (courts can't compel compliance on their own), while Marshall's claim is about interpretive authority (courts decide what the Constitution permits). Judicial review shows that \"merely judgment\" can be an enormously consequential power — but it doesn't give courts force or will; rulings still depend on the executive branch (and other actors) to take effect, which is exactly why real checks on the courts — appointments, jurisdiction, and the amendment process — still matter.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. A civics student argues: "Since Article III never mentions judicial review, the courts don\'t really have much power compared to Congress and the President." (a) Using Marbury v. Madison (1803), explain the power the Supreme Court asserted for itself, and name that power. (b) Explain one specific way the federal judiciary still depends on the other branches even though it holds this power. (c) Identify ONE constitutional or statutory check Congress or the President holds over the federal judiciary, and explain how it limits judicial power.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies that Marbury v. Madison established judicial review — the power of federal courts to declare a law or executive action unconstitutional and void. No credit for a response that misnames the power or omits Marbury.',
            modelResponse:
              "In Marbury v. Madison (1803), the Supreme Court asserted the power of judicial review — the authority of federal courts to declare a law or executive action unconstitutional and therefore void. This power is not stated in Article III's text; the Court established it for itself in this case.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies a real dependency, most directly that courts cannot enforce their own rulings and depend on the executive branch to carry them out (Hamilton\'s "neither force nor will" point). No credit for a vague or unsupported claim of dependency.',
            modelResponse:
              "Even though courts can declare laws unconstitutional, they have no independent way to enforce their own rulings — they depend on the executive branch to actually carry out a decision, since courts control neither the military nor law enforcement. This is the same point Hamilton made in Federalist No. 78: the judiciary has 'neither force nor will, but merely judgment.'",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies one real check (e.g. Senate confirmation of judicial nominees, congressional control over lower-court jurisdiction/structure, the constitutional amendment process, or impeachment of judges) and explains how it limits judicial power. No credit for a check that does not actually exist or is not explained.',
            modelResponse:
              "One check is the Senate's power of advice and consent: the President nominates federal judges and justices, but the Senate must confirm them by majority vote. This gives the elected branches real influence over who sits on the federal bench, limiting the judiciary's independence from the other two branches at the point of appointment.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-marbury-in-constitution-text',
      kind: 'misconception_check',
      question:
        'True or false: judicial review — the Supreme Court\'s power to declare a law unconstitutional — is a power explicitly written into Article III of the Constitution.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming that because judicial review is such a foundational, widely used power today, it must be spelled out somewhere in the Constitution\'s original text, rather than recognizing it as a power the Court claimed for itself through precedent.',
          correctsTo:
            'FALSE. Article III does NOT explicitly grant the power of judicial review. The Supreme Court asserted this power for itself in Marbury v. Madison (1803), when Chief Justice John Marshall\'s opinion held that a provision of the Judiciary Act of 1789 was unconstitutional and therefore void, and declared that it is "the province and duty of the judicial department to say what the law is." Judicial review has operated as settled precedent ever since — but it rests on that 1803 case, not on any explicit constitutional text, which is why the checks Congress and the President hold over the judiciary (appointments, jurisdiction, and the amendment process) remain a meaningful limit on a power the Court itself created.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Article III gives federal judges life tenure ("good Behaviour") and salary protection specifically to insulate the judiciary from political pressure.',
        'Marbury v. Madison (1803): the Supreme Court asserted judicial review — the power to declare a law unconstitutional and void — a power NOT stated in Article III\'s text.',
        'Precedent + stare decisis: courts generally follow prior rulings, though they can overturn precedent. Judicial activism (willing to overturn precedent/laws) vs. judicial restraint (deference to precedent and the elected branches) describe judicial PHILOSOPHY, not a fixed party alignment.',
        'Federalist No. 78: Hamilton called the judiciary the "least dangerous" branch — "neither FORCE nor WILL, but merely judgment," dependent on the executive to enforce its rulings. Marbury shows "merely judgment" can still be an enormously consequential power, but the enforcement dependency Hamilton described remains true today.',
        'Real checks on the courts: Senate confirmation of nominees, congressional control over lower-court structure and jurisdiction, the constitutional amendment process, and dependence on the executive branch for enforcement.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.8-2.11',
    cedTitle: 'The Federal Judiciary',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-federalist-78.v1',
        chapter: '1788',
        note: 'Federalist No. 78 — Hamilton\'s "least dangerous branch"/"neither force nor will" argument; anchor for the concept.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-marbury-opinion.v1',
        chapter: '1803',
        note: 'Marbury v. Madison opinion excerpt — quoted (not wired as a segment passageId) in the worked example, contrasted against Federalist No. 78.',
      },
    ],
  },
};
