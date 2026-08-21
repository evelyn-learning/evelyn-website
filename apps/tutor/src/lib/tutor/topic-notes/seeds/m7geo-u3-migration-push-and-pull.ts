/**
 * Grade 7 World Geography — Unit 3 CED 3.3: Migration: Push & Pull Factors.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7geo.migration-push-and-pull.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7GEO_U3_MIGRATION_PUSH_AND_PULL: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7geo.migration-push-and-pull.v1',
  course: 'Grade 7 World Geography',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Migration: Push & Pull Factors',
  planId: 'evelyn.ms.m7geo.migration-push-and-pull.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7geo.migration-push-and-pull.v1' }],
  theory: [
    { loId: 'm7geo.migration-push-and-pull', content: `MIGRATION IS MOVING FROM ONE PLACE TO ANOTHER TO LIVE. It is not a vacation and not a day trip. Geographers count somebody as a migrant when they change where they live, whether that is one town over or one continent over.` },
    { loId: 'm7geo.migration-push-and-pull', content: `A PUSH FACTOR IS A REASON TO LEAVE the place someone is in. Examples: a drought that ruins the harvest, a factory closing, a flood, a shortage of housing, a war. A PULL FACTOR IS A REASON TO GO to the new place: jobs, farmland, safety, family already living there, schools. The test is simple -- ask which place the reason is about. If it is about the old place, it pushes. If it is about the new place, it pulls.` },
    { loId: 'm7geo.migration-push-and-pull', content: `THE SAME CONDITION CAN PUSH IN ONE PLACE AND PULL IN ANOTHER. Plenty of work is a pull toward the new town; no work is a push out of the old one. That is not two different factors, it is one factor seen from two ends. Noticing this is what separates naming factors from actually understanding a move.` },
    { loId: 'm7geo.migration-push-and-pull', content: `VOLUNTARY MIGRATION IS A CHOICE; FORCED MIGRATION IS NOT. Somebody moving for a better job is migrating voluntarily. People escaping a war, a disaster, or people being moved against their will are not choosing in any ordinary sense. Historically the largest forced migration was the transatlantic slave trade, in which millions of enslaved people were taken from Africa to the Americas. Do not describe forced migration with the language of choice.` },
    { loId: 'm7geo.migration-push-and-pull', content: `INTERNAL MIGRATION STAYS INSIDE ONE COUNTRY; INTERNATIONAL MIGRATION CROSSES A BORDER. Moving from a farm to a city in the same country is internal. Moving from one country to another is international. A move can be described both ways at once -- voluntary and internal, or forced and international -- because the two questions are separate.` },
    { loId: 'm7geo.migration-push-and-pull', content: `THE BIG TRAP -- PEOPLE ALMOST NEVER MIGRATE FOR ONE REASON. Real decisions stack several pushes and several pulls, and often a barrier that had to be overcome: the cost of moving, distance, or leaving family behind. If your explanation of a move has exactly one reason in it, you have probably stopped reading too early.` },
    { loId: 'm7geo.migration-push-and-pull', kind: 'definition', title: 'migration', content: 'moving from one place to another with the intention of living there.' },
    { loId: 'm7geo.migration-push-and-pull', kind: 'definition', title: 'push factor', content: 'a reason that makes someone want to leave the place where they live.' },
    { loId: 'm7geo.migration-push-and-pull', kind: 'definition', title: 'pull factor', content: 'a reason that attracts someone to a new place.' },
    { loId: 'm7geo.migration-push-and-pull', kind: 'definition', title: 'voluntary migration', content: 'migration a person chooses.' },
    { loId: 'm7geo.migration-push-and-pull', kind: 'definition', title: 'forced migration', content: 'migration in which people have no real choice about leaving.' },
    { loId: 'm7geo.migration-push-and-pull', kind: 'definition', title: 'internal migration', content: 'migration that stays within the borders of one country.' },
  ],
  methods: [
    {
      title: 'Worked sort the factors',
      steps: [
        `List every reason mentioned, without labelling anything yet. Three years of poor rains. Almost nothing to sell. A daughter already in the city. Steady work there. A warehouse hiring.`,
        `Now run the test on each one: is this reason about the OLD place or the NEW place?`,
        `Poor rains and nothing to sell are about the village they are leaving. Those are PUSH factors.`,
        `The daughter already living there, the steady work, and the warehouse hiring are all about the city they are going to. Those are PULL factors.`,
        `Notice there are two pushes and three pulls, not one reason. That is normal, and it is the point of the trap in the concept: a real move stacks reasons.`,
        `Last question: internal or international? The case says the city is in the same country, so this is INTERNAL migration. It is also voluntary -- difficult, but a choice the family made.`,
      ],
      example: { problem: `Sort the reasons in this case into push factors and pull factors, then say whether the move is internal or international.

"The Okonkwo family lived in a small farming village. Three years of poor rains left them with almost nothing to sell. Their eldest daughter had already moved to a large city in the same country, where she found steady work, and she wrote that a warehouse near her was hiring. The family packed up and joined her."`, solution: `Push factors: three years of poor rains, and having almost nothing to sell. Pull factors: a daughter already living in the city, steady work there, and a warehouse hiring. The move is internal and voluntary.` },
      relatedLoIds: ['m7geo.migration-push-and-pull'],
    },
    {
      title: 'Worked same factor both ends',
      steps: [
        `Find the two job-related facts in the case. In Rivertown, the mill closed and the jobs went. In Bell City, a hospital is hiring.`,
        `Run the test on the first one. The lost jobs are about Rivertown, the place people are leaving. So losing work is a PUSH factor.`,
        `Run it on the second. The hospital hiring is about Bell City, the place people are going. So available work is a PULL factor.`,
        `Both facts are about work, and they land in different columns. So the student is wrong that a topic belongs to only one column -- what decides the label is WHICH PLACE the reason is about, not what the reason is about.`,
        `WRONG way to say it: "Jobs are always a pull factor." RIGHT way: "The absence of work pushed people out of Rivertown, and the availability of work pulled them toward Bell City."`,
        `This is worth holding onto, because it is the same for almost every topic in this unit: safety, housing, schools and farmland can each push from one end and pull from the other.`,
      ],
      example: { problem: `A student writes: "Jobs is a pull factor, so it cannot also be a push factor." Explain why that is not quite right, using this case.

"When the paper mill in Rivertown closed, about a third of the jobs in the town went with it. Many families moved to Bell City, where a new hospital was hiring."`, solution: `Work appears in both columns. Losing work is a push factor in Rivertown; available work is a pull factor in Bell City. The label depends on which place the reason describes, not on the topic itself.` },
      relatedLoIds: ['m7geo.migration-push-and-pull'],
    },
  ],
  pointers: [
    { content: `Students often say "They moved because there were jobs in the new city." — A migration decision almost always stacks several reasons, and a full explanation needs both columns. What was happening in the place they LEFT? Rising rent, lost work, a poor harvest, a lack of housing? And what else drew them to the new place besides work -- family already there, schools, safety? The student has one pull factor and no push factors at all, so the explanation only accounts for half the decision. Ask both questions every time: why leave there, and why go here.`, kind: 'common-error' },
    { content: `Students often say "Since the move was long-distance, it must be international migration." — The only test is whether a national border was crossed. A move of a thousand miles inside one large country is INTERNAL migration; a move of twenty miles that crosses a border is INTERNATIONAL. Distance is a barrier that affects how hard a move is, but it does not decide this label.`, kind: 'common-error' },
    { content: 'Migration means moving somewhere to live -- not a trip or a visit.', kind: 'tip' },
    { content: `Push factors are about the place someone LEAVES. Pull factors are about the place they GO. Ask which place the reason describes.`, kind: 'tip' },
    { content: 'One topic can appear in both columns: no work pushes, available work pulls.', kind: 'tip' },
    { content: `Voluntary migration is a choice; forced migration is not. Do not describe forced migration in the language of choice.`, kind: 'tip' },
    { content: `Internal stays inside one country, international crosses a border. Distance does not decide it.`, kind: 'tip' },
    { content: `People almost never move for one reason. A one-reason explanation is an unfinished explanation.`, kind: 'tip' },
    { content: `Don't sort factors by TOPIC — sort them by PLACE. "Jobs" is not automatically a pull factor. No work in the old town = push. Hiring in the new town = pull. Ask: which place is this reason describing?`, kind: 'common-error' },
    { content: `Distance never decides internal vs. international. A 1,000-mile move inside one country is INTERNAL. A 20-mile move across a national border is INTERNATIONAL. The only test is: was a national border crossed?`, kind: 'gotcha' },
    { content: `Voluntary/forced and internal/international are two SEPARATE questions. Answer both. A move can be forced and internal, or voluntary and international, or any other pairing.`, kind: 'common-error' },
    { content: `Never use choice words for forced migration. Don't write that enslaved people "moved to" or "decided to go to" the Americas. Write that they were taken, removed, or forced. Word choice matters here.`, kind: 'vocab-note' },
    { content: `If your explanation of a move has exactly one reason, it's unfinished. Go back and ask BOTH questions: why leave there, and why go here? Most real moves stack two or three pushes and two or three pulls.`, kind: 'tip' },
    { content: `Migration means moving somewhere to LIVE. A vacation, a school trip, or driving to another town for the weekend is not migration — the person never changed where they live.`, kind: 'vocab-note' },
    { content: `Watch for barriers — they're not push or pull factors. Cost of moving, long distance, and leaving family behind are things a migrant must overcome. They belong in your explanation, but not in either column.`, kind: 'edge-case' },
    { content: `Family already living in the new place is a PULL factor, even though it's about people, not jobs or safety. Run the test: the relatives are in the new place, so they pull.`, kind: 'edge-case' },
  ],
};
