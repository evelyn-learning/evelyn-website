/**
 * Grade 6 ELA — Research & Citation: Evaluating Source Credibility.
 *
 * PROCEDURE-LED row for the m6ela fan-out (CCSS W.6.8, gathering/assessing
 * half). There is one repeatable move and the whole lesson makes it
 * reliable: given several sources on one research question, reason through
 * three questions — WHO wrote it, HOW WOULD THEY KNOW, and WHAT WOULD THEY
 * GAIN — rather than judging a source by how official or polished it looks.
 * A student who only learns "look for a fancy logo" or "trust the .gov
 * site" has learned a heuristic that fails the moment a source is designed
 * to exploit it; this lesson is built so that shortcut never works. Every
 * item plants at least one plain-looking-but-solid source and one
 * good-looking-but-hollow one specifically to break that shortcut.
 *
 * SCOPE GUARD: Grade 6 row 10.2 teaches ONE reasoning move: given several
 * sources about the same research question, decide which are credible by
 * asking who wrote it, how would they know, and what would they gain, and
 * by treating a professional look or a memorized checklist word as no
 * evidence at all. DELIBERATELY EXCLUDED: choosing or narrowing a research
 * question, which is row 10.1 and this row's own prerequisite; quoting a
 * source's exact words or paraphrasing its ideas without copying them,
 * which is row 10.3; recording a source's title, author and where it was
 * found, and any formal citation format, which is row 10.4 and the shipped
 * Grade 7 "Citing Sources" lesson (W.7.8); and the primary-versus-secondary
 * source distinction together with the idea that one source can be
 * credible for one question and not credible for a different question,
 * both of which belong to the shipped Grade 7 depth of this same standard
 * in `m7ela-u10-evaluating-sources.ts` and are not attempted here — every
 * source in this file is simply judged credible or not credible for the
 * one question it is offered against. DELIBERATELY ALLOWED, because the two
 * rows sit close: every source in this file is named in full (a person, a
 * department, a company, or a screen name), because a student cannot reason
 * about WHO WROTE IT without seeing a name to evaluate. That is not the same
 * skill as row 10.4's task of writing that name down into a source record.
 *
 * Every organization, town, department and screen name in this file —
 * Fernbrook, its library, its Public Works office, its Sanitation
 * Department, Cedarline Youth Sports Center, BrightBuild Construction,
 * Crosswalk Solutions Inc., HydroBoost Sports Drinks, EcoBin Systems,
 * TownPride Media, and every screen name — is invented for this lesson. No
 * real school, company, publication, government office or person is named
 * or judged anywhere in this file; every credibility judgment in every item
 * is about an invented source only.
 *
 * NOTE FOR FUTURE AUTHORS: every source description, quote, name, number
 * and organization in this file is original invented material written for
 * this lesson. This course carries no passage machinery — no passageId, no
 * shared texts — so every item must be answerable from the words printed
 * inside it alone. This file contains no contractions anywhere, in the
 * tutor's own voice or inside any quoted source, because none were needed
 * to make the invented voices read naturally; if a future edit adds one, it
 * must fall inside quoted reported speech and must not appear in the
 * tutor's own explaining sentences.
 *
 * CLAIM LEDGER:
 *   Claim                                  | Where             | Kind        | Grounds
 *   Aida Torres's library sign-in sheets   | worked ex. 1 & 2  | STIPULATED  | Invented library and
 *   show about 120 visitors last month,    |                   |             | numbers for this item;
 *   up from about 80 a year ago            |                   |             | worked ex. 2 correctly
 *                                          |                   |             | treats 80->120 as a rise,
 *                                          |                   |             | not a tripling.
 *   BrightBuild Construction claims        | worked example 2  | STIPULATED  | Invented claim, deliberately
 *   Saturday visits tripled in the last    |                   |             | inconsistent with Aida
 *   year                                   |                   |             | Torres's own count — the
 *                                          |                   |             | mismatch is the point.
 *   Marcus Diallo's logbooks show          | try-1 problem     | STIPULATED  | Invented engineer and
 *   near-miss incidents dropping from      |                   |             | counts for this item;
 *   about 9 a month to about 2 a month     |                   |             | nothing elsewhere in the
 *                                          |                   |             | item contradicts it.
 *   Renata Kwan's three-week test found    | try-2 problem     | STIPULATED  | Invented trainer and
 *   no measurable difference in sprint     |                   |             | result, framed as one
 *   times after ice-cold water             |                   |             | small test, not a claim
 *                                          |                   |             | about all athletes.
 *   Fernbrook's Sanitation Department      | try-3 problem     | STIPULATED  | Invented department and
 *   scale shows tonnage rising from about  |                   |             | figures for this item;
 *   6 to about 9 tons a month              |                   |             | internally consistent.
 *   A person who keeps their own records   | concept keyIdea 3 | REAL-WORLD  | Basic, settled principle
 *   because of their job has firsthand,    |                   |             | of evidentiary reasoning,
 *   checkable access to that information   |                   |             | not a claim that could
 *                                          |                   |             | turn out false.
 *   Having a reason to want a particular   | concept keyIdea 4 | REAL-WORLD  | Standard, settled
 *   answer believed is a reason to check   | & misconception   |             | media-literacy principle.
 *   a claim, not proof it is false         |                   |             |
 *   A polished, professional-looking page  | concept keyIdea 5 | REAL-WORLD  | Settled principle: page
 *   is not evidence its claims are         | & misconception   |             | design and factual
 *   accurate                               |                   |             | accuracy are unrelated.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U10_EVALUATING_SOURCE_CREDIBILITY: LessonPlan = {
  id: 'evelyn.ms.m6ela.evaluating-source-credibility.v1',
  title: 'Evaluating Source Credibility',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.evaluating-source-credibility',
      standard: 'M6ELA-10.2',
      description:
        'Gather information about one research question from more than one print or digital source, and decide which sources are credible by asking who wrote it, whether that person or group could actually know what they claim, and what they would gain if the reader believed it, reasoning through each source rather than judging it by its design or by a memorized checklist word (CCSS W.6.8).',
    },
  ],
  prerequisites: ['m6ela.asking-a-research-question'],
  followUps: ['m6ela.quoting-and-paraphrasing-without-plagiarizing'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already meets conflicting sources constantly, and name the three questions that replace a guess.',
      script:
        'Your class is arguing about whether the school should get rid of paper hall passes and switch to a phone app instead. You go looking for information to settle it, and in about ten minutes you find three pages that each sound completely sure of themselves, and they do not agree with each other. One is written by a teacher, one is an ad for a hall-pass app company, and one is just a comment somebody left with no name attached. Right now you might trust whichever page sounds most confident, or whichever one has the nicest-looking design. Today you get three questions that work every time instead: who wrote it, how would they know, and what would they gain if you believed them. None of those questions care what the page looks like.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-who-how-what',
      kind: 'concept',
      goal: 'Install the three-question test for source credibility, the idea that design proves nothing, and the idea that disagreement between sources is itself a clue.',
      keyIdeas: [
        'GATHER FROM MORE THAN ONE SOURCE. One page that sounds confident is a starting point, not proof. Before you decide what to believe about a research question, look for a second source that can corroborate the first one, meaning it confirms the same information independently, rather than settling for whichever page you found first.',
        'ASK WHO WROTE IT. Look for an actual name, a specific person or a named group, standing behind the claim. If nobody is willing to put a name on what is written, there is nobody to hold responsible if it turns out to be wrong, and that alone is a real weakness.',
        'ASK HOW WOULD THEY KNOW. A name is not enough by itself. Ask whether this exact person or group has direct, firsthand access to the information, such as their own job, their own records, or a test they actually ran, rather than a guess passed along from somewhere else. A worker who reads a town office\'s own logbooks knows something firsthand. A stranger\'s comment that starts with "everyone knows" does not.',
        'ASK WHAT WOULD THEY GAIN. Every source was written for a reason. Ask what happens for the writer if the reader believes the claim: does someone make money, win an argument, or look good? A reason to want one particular answer believed does not automatically make a claim false, but it means checking that specific claim more carefully instead of taking it on trust.',
        'A CHECKLIST WORD OR A NICE DESIGN PROVES NOTHING BY ITSELF. A page can look official, use serious colors, or end in an address that sounds trustworthy, and still fail all three questions. A page can look plain and homemade and pass all three. Reasoning through who wrote it, how would they know, and what would they gain works every time; judging a page by its look does not.',
        'WHEN SOURCES DISAGREE, THE DISAGREEMENT ITSELF IS A CLUE. If two sources give different numbers for the same fact, run the three questions on each one and compare the answers. The source that cannot explain how it would know, or that gains the most from a particular answer, is usually the one that does not match the source with real records behind it.',
      ],
      vocabulary: [
        { term: 'source', definition: 'a person, an organization, or a piece of writing where information comes from.' },
        { term: 'credible', definition: 'worth believing, based on who wrote something, how they would know it, and what they would gain if it were believed.' },
        { term: 'firsthand', definition: 'coming directly from a person\'s own experience, records, or work, rather than passed along from someone else.' },
        { term: 'motive', definition: 'the reason a person or group has for wanting readers to believe a particular claim.' },
        { term: 'corroborate', definition: 'to have a second, independent source confirm the same information.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-library-hours-one-source',
      kind: 'worked_example',
      problem:
        'Your class is researching this question: should Fernbrook\'s public library stay open later on Saturdays? You find a page on the library\'s own website, signed by Aida Torres, the Head Librarian. It says: "Our Saturday sign-in sheets show about 120 visitors last month, compared with about 80 visitors on Saturdays a year ago." Run the three questions on this claim.',
      steps: [
        'WHO WROTE IT? Aida Torres, the Head Librarian, is named right at the top. This is not an anonymous post.',
        'HOW WOULD SHE KNOW? She runs the library and keeps the sign-in sheets herself. The numbers come from records inside her own building, not from a rumor or a guess.',
        'WHAT WOULD SHE GAIN? A busier library might help her argue for a bigger budget or more staff later, so that is worth keeping in mind. But she is quoting counted sign-ins, a specific and checkable kind of record, not just an opinion about how busy the library feels.',
        'Weigh the three answers together. A named person, with direct access to the actual records, reporting a specific and checkable number: that is a strong basis for the claim, even though she does have a small reason to hope the numbers look good.',
        'Notice what this does not prove yet. One strong source about the library\'s own numbers is a solid start, but a full research report would still need a second, independent source before treating the case as fully settled.',
      ],
      answer:
        'Strong for this claim. Aida Torres is named, she has firsthand access to the library\'s own sign-in sheets, and the number she gives is specific and checkable, which outweighs the small reason she might have to want the library to look busy.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-library-hours-two-more-claims',
      kind: 'worked_example',
      problem:
        'Two more sources turn up about the same Saturday library numbers. Source B is a comment on the FernNet neighborhood app from an account called QuietStreets22: "The library is always empty on Saturdays, everyone knows that." Source C is a flyer from BrightBuild Construction, a company that builds building additions: "Saturday visits have tripled in the last year, so Fernbrook needs a bigger library, and we build the best additions in the county." Run the three questions on each, and compare both against Aida Torres\'s numbers from before.',
      steps: [
        'Source B. WHO wrote it? QuietStreets22 is a screen name, not an identified person. HOW WOULD THEY KNOW? The comment offers nothing except "everyone knows," which is not a record of anything at all.',
        'WHAT WOULD QuietStreets22 GAIN? Unclear, but with no name and no explanation of how they would know, there is nothing here to weigh against a librarian\'s actual sign-in count.',
        'Source C. WHO wrote it? BrightBuild Construction is named, so this one is not anonymous. HOW WOULD THEY KNOW? A construction company does not run the library and does not keep its sign-in sheets, so nothing in the flyer explains how BrightBuild arrived at a number at all.',
        'WHAT WOULD BrightBuild GAIN? They get paid if the town decides to build an addition. Making the current library sound too small and too crowded is exactly the claim that helps their own business, which is a direct financial reason to want the tripled number believed.',
        'Now compare the numbers directly. Aida Torres\'s own sign-in sheets show visits going from about 80 to about 120, a real increase, but nowhere near tripling. BrightBuild\'s number does not match the one source in this set that actually keeps the records, and BrightBuild is also the one source with a financial reason to exaggerate.',
        'Verdict: Source B fails because there is no name and no way it could know. Source C fails for a different reason: a real name, but no access to the actual records, a financial motive to inflate the number, and a claim that contradicts the source closest to the actual sign-in sheets.',
      ],
      answer:
        'Neither B nor C is credible for this claim. B has no identified author and no explanation for how it would know. C is named but has no access to the library\'s own records, has a financial reason to want a bigger number, and its number does not match Aida Torres\'s sign-in sheets.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-crosswalk-safety',
      kind: 'try_yourself',
      problem:
        'Your class is researching this question: did the new crosswalk near Fernbrook Elementary actually make Oak Street safer to cross? Which source below is the most credible for that question?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'A report on the town Public Works website, written by Marcus Diallo, the town traffic engineer, stating that his office reviewed the crossing-guard logbooks and counted about 9 reported near-miss incidents a month before the new crosswalk went in, compared with about 2 a month in the four months since.',
          correct: true,
        },
        {
          id: 'b',
          text: 'A comment on a driving app from a user named DriveFast22, who does not live near the school and has never actually walked through the intersection at drop-off time, saying the new crosswalk is obviously way safer now because everyone can just tell by looking at it.',
        },
        {
          id: 'c',
          text: 'A flyer from Crosswalk Solutions Inc., the company that installed the new paint and signs, claiming that its crosswalk designs cut accidents in half at every single location it has ever installed one, without giving a specific number for Fernbrook Elementary or explaining who counted the accidents at any of those other locations.',
        },
        {
          id: 'd',
          text: 'A post from an account called SafeStreetsFan, sharing a brightly colored infographic with the headline "Proven Safer!" that does not say who made it, where any of its numbers came from, or how anyone would have measured whether the street actually got safer.',
        },
      ],
      expectedAnswer:
        'A report on the town Public Works website, written by Marcus Diallo, the town traffic engineer, stating that his office reviewed the crossing-guard logbooks and counted about 9 reported near-miss incidents a month before the new crosswalk went in, compared with about 2 a month in the four months since.',
      hints: [
        'Ask who is actually speaking behind each choice, and whether that person or group would have any real, firsthand way of knowing the answer.',
        'One choice keeps an actual logbook count from the town\'s own crossing guards, one is a guess from an anonymous screen name, one comes from a company that profits from being seen as effective everywhere, and one is only a good-looking graphic with no source named at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cold-water-sprinting',
      kind: 'try_yourself',
      problem:
        'Your class is researching this question: does drinking ice-cold water right before a race really slow a sprinter down? Which source below is the most credible for that question?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'A comment on a sports forum with no name attached, insisting that cold water definitely slows every runner down and that this is just common knowledge among athletes, without describing a single test, measurement, or specific runner this idea is based on, or saying where that common knowledge supposedly came from.',
        },
        {
          id: 'b',
          text: 'An article by Renata Kwan, a certified athletic trainer at the Cedarline Youth Sports Center, describing a small test she ran with her own track team over three separate weeks of practice, in which drinking ice-cold water right before a sprint made no measurable difference in their stopwatch times.',
          correct: true,
        },
        {
          id: 'c',
          text: 'An advertisement from HydroBoost Sports Drinks, claiming that its specially formulated room-temperature drink is the only proven way to keep a sprinter from slowing down, without describing any test or comparison that actually measured a difference.',
        },
        {
          id: 'd',
          text: 'A poster in the school gym with a coach\'s name attached and a bold claim that cold water definitely hurts sprint times, without explaining what, if anything, was ever measured, timed, or compared to reach that claim.',
        },
      ],
      expectedAnswer:
        'An article by Renata Kwan, a certified athletic trainer at the Cedarline Youth Sports Center, describing a small test she ran with her own track team over three separate weeks of practice, in which drinking ice-cold water right before a sprint made no measurable difference in their stopwatch times.',
      hints: [
        'A name attached to a claim is a start, not the whole answer. Ask whether that particular person actually tested or measured anything, or is just repeating an assumption.',
        'One choice has no name at all, one is selling a product and benefits from a particular answer, one borrows a coach\'s name without explaining any actual test, and one describes a specific test someone ran and measured herself.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-recycling-tonnage',
      kind: 'try_yourself',
      problem:
        'Your class is researching this question: did Fernbrook\'s new recycling bins actually increase how much the town recycles? Which source below is the most credible for that question?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'A post from an account called GreenGuy claiming that recycling has "basically doubled" since the new bins went in, without saying how he would know that, where the number came from, or whether he ever compared any actual weights or records.',
        },
        {
          id: 'b',
          text: 'A flyer from EcoBin Systems, the company that manufactures and sells the new bins, stating that towns that install its bins typically see large increases in recycling, without giving any specific numbers for Fernbrook itself or saying who measured those other towns\' results.',
        },
        {
          id: 'c',
          text: 'A monthly report from Fernbrook\'s Sanitation Department, posted on the town website, showing the weight of recycling collected each month on the depot\'s own scale: about 6 tons a month before the new bins, rising to about 9 tons a month in the six months since.',
          correct: true,
        },
        {
          id: 'd',
          text: 'A short video from TownPride Media featuring three residents saying on camera that they feel like they recycle so much more since the new bins arrived, set to upbeat music, without weighing, counting, or measuring anything about the town\'s actual recycling totals.',
        },
      ],
      expectedAnswer:
        'A monthly report from Fernbrook\'s Sanitation Department, posted on the town website, showing the weight of recycling collected each month on the depot\'s own scale: about 6 tons a month before the new bins, rising to about 9 tons a month in the six months since.',
      hints: [
        'Ask which of these four is measuring something specific and keeping a record of it, rather than describing a feeling, a guess, or a general pattern from somewhere else.',
        'One choice never explains how its number was reached, one talks about other towns instead of Fernbrook, one is three people\'s personal impressions, and one weighs every load on the town\'s own scale and reports the actual tonnage.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-look-and-motive',
      kind: 'misconception_check',
      question:
        'A student is weighing two sources for a report on school fundraisers. One is a page with bright colors and a professional-looking logo. The other is a flyer from a company that sells fundraiser supplies. The student says: "The colorful page has to be right, since it looks so professional. And the flyer from the supply company cannot be trusted at all, since they are obviously trying to sell something." What has gone wrong here?',
      commonErrors: [
        {
          answer: 'A professional-looking design means the information is accurate.',
          misconception:
            'Judging a page by how polished it looks instead of asking who wrote it and how they would know. A serious color scheme, a clean logo, and confident wording cost nothing to produce and prove nothing about whether anyone actually checked the facts.',
          correctsTo:
            'Design says nothing about credibility. Ask the same three questions on a beautiful page that you would ask on a plain one: who wrote it, how would they know, and what would they gain. A plain page with a named expert quoting her own measured records, like the trainer at Cedarline Youth Sports Center, can be far more credible than a glossy page with no author listed at all.',
        },
        {
          answer: 'A source with something to sell can never be trusted about anything.',
          misconception:
            'Treating a motive as automatic proof that every claim from that source is false. Having a reason to want a particular answer believed is a reason to double-check a claim, not a reason to throw out the whole source without reading it.',
          correctsTo:
            'A source with a motive can still report something true, especially about facts that are easy to check. Look at Aida Torres, the head librarian: she does have a small reason to want the library to look busy, but her sign-in sheet numbers are specific and checkable, and a motive alone does not erase that. Weigh the motive alongside who wrote it and how they would know, instead of letting the motive decide everything by itself.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Gather more than one source on a research question, and look for a second source that corroborates the first before treating anything as settled.',
        'Ask WHO WROTE IT: a real, identified name or group, not an anonymous screen name.',
        'Ask HOW WOULD THEY KNOW: does the writer have firsthand access to the information, such as their own records or a test they ran, rather than a secondhand guess.',
        'Ask WHAT WOULD THEY GAIN: does believing the claim make the writer money, win an argument, or make them look good. A motive means double-check the claim, not throw the source away.',
        'A professional-looking page or a serious-sounding name proves nothing on its own. Reasoning through the three questions is what actually decides.',
        'When two sources disagree, run the three questions on each one. The source that cannot explain how it would know, or that gains the most from its answer, is usually the one that does not match the source with real records behind it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Evaluating Source Credibility' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
