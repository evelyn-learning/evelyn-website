/**
 * AP Psychology — Unit 2 CED 2.7: Forgetting and Other Memory Challenges.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.memory-forgetting.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_MEMORY_FORGETTING: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.memory-forgetting.v1',
  course: 'AP Psychology',
  cedUnit: 2,
  cedTopic: '2.7',
  cedTitle: 'Forgetting and Other Memory Challenges',
  planId: 'evelyn.ap.psych.memory-forgetting.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.memory-forgetting.v1' }],
  theory: [
    { loId: 'appsych.memory-forgetting', content: `MEMORY IS NOT A VIDEO RECORDER. It degrades, it suffers interference, and it CHANGES with each retelling. The big AP themes here are the FOUR CAUSES of forgetting and the RECONSTRUCTIVE (constructive) nature of memory that makes eyewitness testimony fragile.` },
    { loId: 'appsych.memory-forgetting', content: `EBBINGHAUS'S FORGETTING CURVE: most forgetting happens RAPIDLY in the first hours and days, then levels off. Roughly half of newly learned material can be lost within an hour and the large majority within a day if it is never reviewed — which is exactly why spaced review matters.` },
    { loId: 'appsych.memory-forgetting', content: `CAUSE 1 — ENCODING FAILURE: the information never got into LTM in the first place. It passed through the senses and STM but was never encoded. Classic demonstration: most people cannot accurately draw a common coin from memory despite seeing thousands — the fine details were never encoded.` },
    { loId: 'appsych.memory-forgetting', content: `CAUSE 2 — STORAGE DECAY: the physical memory trace deteriorates over time. This is LESS SUPPORTED than once thought and mainly applies to sensory and short-term memory; LTM is relatively durable, so decay alone does not fully explain forgetting.` },
    { loId: 'appsych.memory-forgetting', content: `CAUSE 3 — INTERFERENCE: other memories disrupt retrieval. PROACTIVE interference is when OLD information intrudes on NEW (calling a new partner by an ex's name; Spanish learned first intruding on French learned later). RETROACTIVE interference is when NEW information disrupts OLD (later learning French makes previously known Spanish harder to recall). Mnemonic: PRO = prior/old moving forward; RETRO = recent reaching back.` },
    { loId: 'appsych.memory-forgetting', content: `CAUSE 4 — RETRIEVAL FAILURE: the memory exists but cannot be accessed right now. The TIP-OF-THE-TONGUE phenomenon — feeling sure you know something but unable to produce it — is the signature case. It usually resolves once a priming cue arrives, which shows the memory was intact and only the retrieval cue was missing.` },
    { loId: 'appsych.memory-forgetting', content: `CONSTRUCTIVE MEMORY: retrieval is RECONSTRUCTION, not verbatim playback. We fill gaps with reasonable assumptions and SCHEMAS, and each retelling can ALTER the stored memory. Loftus's research established that memories are reconstructive and easily modified.` },
    { loId: 'appsych.memory-forgetting', content: `MISINFORMATION EFFECT (Loftus): exposure to MISLEADING information after an event changes the memory of that event. In the classic study, subjects watched a film of a car accident; those asked how fast the cars were going when they "SMASHED" reported higher speeds — and a week later were more likely to FALSELY remember broken glass — than those asked when the cars "HIT." Implications: eyewitness testimony is unreliable, "recovered" therapy memories risk being implanted, and lineup procedures (sequential vs simultaneous) matter.` },
    { loId: 'appsych.memory-forgetting', content: `SOURCE AMNESIA (source misattribution): forgetting WHERE a memory came from — confusing something imagined, dreamed, or heard with something actually experienced. It underlies much of the misinformation effect and false-memory research.` },
    { loId: 'appsych.memory-forgetting', content: `AMNESIA TYPES: RETROGRADE amnesia is the inability to recall PAST memories formed BEFORE an injury (trauma, ECT, Korsakoff's syndrome from chronic alcohol abuse). ANTEROGRADE amnesia is the inability to form NEW memories AFTER an injury (patient HM; hippocampal damage). Progressive DEMENTIAS such as Alzheimer's cause anterograde loss first and eventually retrograde loss too.` },
    { loId: 'appsych.memory-forgetting', content: `INFANTILE AMNESIA: most adults cannot recall events from before roughly age 3-4, because the hippocampus is not yet fully developed and early encoding strategies differ. Implicit/procedural memories can still form in that period. REPRESSED MEMORIES (a Freudian idea that trauma is pushed into the unconscious) are CONTROVERSIAL — research suggests trauma is usually remembered, sometimes too vividly, and many "recovered" memories are implanted via the misinformation effect.` },
    { loId: 'appsych.memory-forgetting', kind: 'definition', title: 'misinformation effect', content: `leading questions or post-event information alter a person's memory of the original event.` },
    { loId: 'appsych.memory-forgetting', kind: 'definition', title: 'proactive interference', content: `old memories disrupt the retrieval of new information.` },
    { loId: 'appsych.memory-forgetting', kind: 'definition', title: 'anterograde amnesia', content: `inability to form new long-term memories after an injury; associated with hippocampal damage.` },
  ],
  methods: [
    {
      title: 'Diagnose the type of interference',
      steps: [
        `STEP 1 — IDENTIFY WHICH MEMORY IS BEING DISRUPTED (the target the person is trying to retrieve) and WHICH IS INTRUDING.`,
        `STEP 2 — IF OLDER LEARNING intrudes on newer material → PROACTIVE interference (old moves forward).`,
        `STEP 3 — IF NEWER LEARNING disrupts older material → RETROACTIVE interference (new reaches back).`,
        `STEP 4 — RECOMMEND separating the two bodies of material across study sessions to allow consolidation; some interference is unavoidable when the material shares features (e.g., related languages).`,
      ],
      example: {
        problem: `You learned Spanish in high school, then studied French in college, and now write Spanish words while trying to speak French. Which type of interference?`,
        solution: `PROACTIVE interference — the OLDER Spanish learning pushes forward into the newer French. (If years later French made you forget Spanish, that would be RETROACTIVE interference.)`,
      },
      relatedLoIds: ['appsych.memory-forgetting'],
    },
    {
      title: 'Analyze an eyewitness / amnesia scenario',
      steps: [
        `STEP 1 — FOR MEMORY ERRORS, spot the leading input. A question that presupposes a detail ("the broken headlight") can IMPLANT that detail → name the MISINFORMATION EFFECT and cite reconstructive memory.`,
        `STEP 2 — DRAW THE APPLIED IMPLICATION: use open-ended questions, interview witnesses separately, prefer sequential lineups — eyewitness misidentification drives many wrongful convictions.`,
        `STEP 3 — FOR AMNESIA CASES, check the TIMELINE. Can't form NEW memories after the event → ANTEROGRADE (hippocampus/medial temporal lobe). Can't recall the PAST before the event → RETROGRADE.`,
        `STEP 4 — SUGGEST COMPENSATION for anterograde loss: external aids (notes, phones, calendars), reliance on intact PROCEDURAL memory, and structured routines.`,
      ],
      example: {
        problem: `An interviewer asks, "Did you see the broken headlight?" and the witness later "remembers" a broken headlight that was never there. Name the phenomenon and give one implication for law enforcement.`,
        solution: `MISINFORMATION EFFECT — the leading question implants a detail the witness later recalls as seen. Implication: interviewers should ask OPEN-ENDED questions and use cognitive-interview and sequential-lineup procedures, because leading questions make eyewitness testimony unreliable.`,
      },
      relatedLoIds: ['appsych.memory-forgetting'],
    },
  ],
  pointers: [
    { content: 'Four causes: encoding failure, storage decay, interference (proactive/retroactive), retrieval failure.', kind: 'tip' },
    { content: 'PROactive = old (prior) hurts new; RETROactive = new (recent) hurts old.', kind: 'tip' },
    { content: 'Tip-of-the-tongue = retrieval failure — the memory is intact, only the cue is missing.', kind: 'tip' },
    { content: 'Misinformation effect (Loftus): leading questions and post-event info implant false details.', kind: 'tip' },
    { content: 'Anterograde = no NEW memories (HM, hippocampus); retrograde = no PAST memories before injury.', kind: 'tip' },
    { content: 'Repressed/"recovered" memories are controversial and often products of the misinformation effect.', kind: 'tip' },
  ],
};
