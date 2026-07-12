/**
 * AP World History — Unit 8 CED 8.1-8.4: The Cold War as a Global Conflict.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.cold-war-global.v1`. Covers the bipolar bloc system
 * (NATO/Warsaw Pact), containment's globalization beyond Europe, the major
 * proxy wars, the nuclear arms race/MAD, and the space race.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U8_COLD_WAR: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.cold-war-global.v1',
  course: 'AP World History',
  cedUnit: 8,
  cedTopic: '8.1-8.4',
  cedTitle: 'The Cold War as a Global Conflict',
  planId: 'evelyn.ap.apworld.cold-war-global.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.cold-war-global.v1' }],
  theory: [
    {
      loId: 'apworld.cold-war-global',
      kind: 'definition',
      title: 'bipolar world',
      content:
        'After 1945 the wartime US-Soviet alliance collapsed into a decades-long rivalry between an American-led, capitalist-democratic bloc and a Soviet-led, Communist bloc, each treating the other\'s ideology as an existential threat.',
    },
    {
      loId: 'apworld.cold-war-global',
      kind: 'event',
      title: 'NATO (1949) / Warsaw Pact (1955)',
      content:
        "NATO committed the US and Western European allies to mutual defense, formalizing a permanent American military presence in Europe. The USSR answered by organizing its Eastern European allies into the Warsaw Pact — locking the continent into two armed camps.",
    },
    {
      loId: 'apworld.cold-war-global',
      kind: 'cause',
      title: 'containment went global',
      content:
        'The Truman Doctrine (1947) committed the US to support "free peoples" resisting subjugation, stated in universal terms rather than limited to Greece and Turkey. Policymakers treated that commitment as applying anywhere a Communist or Soviet-aligned movement appeared to be gaining ground.',
    },
    {
      loId: 'apworld.cold-war-global',
      kind: 'event',
      title: 'proxy wars',
      content:
        'Because direct US-Soviet combat risked nuclear war, the superpowers backed opposing sides in conflicts across the decolonizing world instead: Korea (1950-53), Vietnam, Angola, and Afghanistan (from 1979). These conflicts, not direct superpower combat, were where the Cold War\'s real violence and casualties occurred.',
    },
    {
      loId: 'apworld.cold-war-global',
      kind: 'definition',
      title: 'Mutually Assured Destruction (MAD)',
      content:
        'The doctrine that neither superpower would launch a first nuclear strike because the other retained the capacity to respond with equally devastating force — making full-scale nuclear war a form of collective suicide for both sides.',
    },
    {
      loId: 'apworld.cold-war-global',
      kind: 'event',
      title: 'the Cuban Missile Crisis (1962)',
      content:
        'When Soviet offensive missile sites were discovered in Cuba, Kennedy chose a naval "quarantine" on further shipments rather than a military strike on the sites already there — a calibrated response short of direct combat, consistent with MAD\'s logic of avoiding uncontrollable escalation.',
    },
    {
      loId: 'apworld.cold-war-global',
      kind: 'event',
      title: 'the Space Race',
      content:
        "The Soviet Union's 1957 Sputnik launch shocked American confidence and triggered a sustained US technological push (culminating in the 1969 Moon landing) — extending Cold War competition into space as a proxy for military/ideological superiority.",
    },
    {
      loId: 'apworld.cold-war-global',
      kind: 'framework',
      title: 'how the causes combine',
      content:
        'A rivalry organized around AVOIDING direct superpower combat still produced a genuinely global conflict: armed camps in Europe (NATO/Warsaw Pact), a permanent nuclear standoff (MAD), a technological contest (space race), and decades of proxy violence concentrated in Asia, Africa, and Latin America.',
    },
    {
      loId: 'apworld.cold-war-global',
      kind: 'trap',
      title: 'do not conflate "cold between superpowers" with "cold everywhere"',
      content:
        'The US and USSR never fought each other directly, but that avoidance of direct combat is exactly WHY they fought through proxies (Korea, Vietnam, Angola, Afghanistan) instead. Across the Third World, the Cold War was frequently, genuinely hot.',
    },
  ],
  methods: [
    {
      title: 'Analyze a Cold War-era speech or crisis document for deterrence logic',
      when_to_use:
        'Use this when a document (a presidential address, a crisis announcement) describes a superpower response to a nuclear-era confrontation, before concluding what the response reveals about Cold War strategy.',
      steps: [
        'SOURCE IT: who is speaking, to what audience, at what moment in the crisis?',
        'IDENTIFY THE STATED STAKES: does the document explicitly frame the danger in nuclear terms (destructiveness, speed, irreversibility)?',
        'IDENTIFY THE CHOSEN RESPONSE: is it a maximal option (military strike) or a calibrated, lower-escalation option (blockade/quarantine, diplomatic channel)?',
        'CONNECT TO MAD: a calibrated response chosen specifically to avoid uncontrolled escalation is direct evidence of Mutually Assured Destruction shaping superpower behavior.',
      ],
      example: {
        problem:
          'Kennedy, October 22, 1962: "We no longer live in a world where only the actual firing of weapons represents a sufficient challenge to a nation\'s security to constitute maximum peril... a strict quarantine on all offensive military equipment under shipment to Cuba is being initiated." What does the chosen response reveal about nuclear-era strategy?',
        solution:
          'Kennedy explicitly states that even the possibility of missile deployment, not just firing, counts as "maximum peril" — a direct statement of nuclear-raised stakes. He then chooses a naval quarantine (intercepting future shipments) rather than a strike on missiles already in place — the least escalatory option that still forced a Soviet response, exactly the behavior MAD produces.',
      },
      relatedLoIds: ['apworld.cold-war-global'],
    },
  ],
  pointers: [
    { content: 'The Cold War was "cold" only between the US and USSR directly — proxy wars (Korea, Vietnam, Angola, Afghanistan) made it hot across much of the decolonizing world. This is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'The Truman Doctrine (1947) is a European-crisis document that gets APPLIED globally afterward — don\'t treat containment as a policy that started out global.', kind: 'tip' },
    { content: 'MAD explains superpower RESTRAINT, not superpower passivity — crises like Cuba (1962) were managed through calibrated tools (a quarantine, not a strike), not avoided altogether.', kind: 'tip' },
    { content: 'Keep NATO (1949, Western) and the Warsaw Pact (1955, Soviet, six years later) straight on an SAQ — don\'t reverse which came first or which side each represents.', kind: 'tip' },
    { content: 'The Space Race (Sputnik 1957) is Cold War competition by another means — frame it as ideological/technological proxy competition, not a separate unrelated topic.', kind: 'tip' },
  ],
};
