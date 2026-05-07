/**
 * TEST PLAN — G7 Social Studies (cross-domain) — The Apollo Missions.
 *
 * QA harness, not production content. Designed to invite:
 *   - show_timeline — Apollo program dates 1961-1972 (events with year
 *     parsing).
 *   - show_map — USA preset, pinned at Cape Canaveral (Florida) and
 *     Houston (Texas); also a world preset for the Pacific splashdown
 *     zones.
 *   - show_diagram(kind: "hierarchy_pyramid") — once with `tiers` (the
 *     canonical field) and once with `levels` (the brain-shaped alias
 *     the solver also accepts). The lesson explicitly invites both
 *     across two segments so the test verifies both shapes render.
 *   - show_labeled_image with LEGACY src path — passes a known-good
 *     NASA images-assets URL plus brain-placed callouts at coordinates
 *     the brain reasons about (LEM, footprint, flag, Earth in distance).
 *     The image-search interceptor only strips callouts on the `query`
 *     path; the `src` path keeps them.
 *
 * Coverage gap this fills: existing g8-ss-american-revolution and
 * g9-ss-constitution plans cover early American history; Apollo is in
 * the post-1877 / Cold War era and not directly covered.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G7_SS_APOLLO_MISSIONS: LessonPlan = {
  id: 'evelyn.test.g7.ss.apollo-missions.v1',
  title: '[TEST] G7 Social Studies — The Apollo Missions',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'social-studies',
  topic: 'us-history-1877-present',
  locale: 'en',
  los: [
    {
      id: 'evelyn.g7.ss.cold-war.space-race',
      description: 'Explain how the Space Race shaped U.S. policy, science investment, and national identity during the Cold War.',
      standard: 'CCSS.ELA-LITERACY.RH.6-8.2',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hook with the scale: in eight years (1961-1969), the United States went from never having put a person in orbit to landing two people on the Moon and bringing them home alive.',
      script: 'In 1961, the United States had launched exactly one human into space — for fifteen minutes. Eight years later, in 1969, two Americans walked on the Moon. Eight years. From "fifteen minutes in a tin can" to "footprints on another world." How that happened — the choices, the people, the cost — is today\'s lesson.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-timeline',
      kind: 'concept',
      goal: 'The Apollo program ran from 1961 (Kennedy\'s announcement) to 1972 (Apollo 17, the last crewed Moon landing). Key milestones along the way.',
      keyIdeas: [
        '1961 — President Kennedy announces the goal: "land a man on the Moon" by the end of the decade.',
        '1967 — Apollo 1 fire kills three astronauts during a ground test. The program is overhauled.',
        '1968 — Apollo 8 orbits the Moon. First humans to leave Earth\'s gravity.',
        '1969 — Apollo 11 lands. Armstrong + Aldrin walk on the Moon (Collins stays in orbit).',
        '1970 — Apollo 13 — explosion en route; crew returns alive after a worldwide-watched rescue.',
        '1972 — Apollo 17 — last crewed lunar mission to date.',
      ],
      vocabulary: [
        { term: 'Space Race', definition: 'Cold War-era competition between the U.S. and USSR for spaceflight achievements.' },
        { term: 'Lunar Module (LM)', definition: 'the small craft that detached from the main spacecraft and landed on the Moon.' },
      ],
      suggestedTools: ['show_timeline'],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-geography',
      kind: 'concept',
      goal: 'Apollo missions launched from Cape Canaveral (Florida), were managed from Houston (Texas), and splashed down in the Pacific Ocean for recovery.',
      keyIdeas: [
        'KENNEDY SPACE CENTER — Cape Canaveral, Florida. Launch site for the Saturn V rocket.',
        'JOHNSON SPACE CENTER — Houston, Texas. Mission Control. ("Houston, we have a problem.")',
        'SPLASHDOWN — capsules returned to the Pacific Ocean, recovered by U.S. Navy ships.',
      ],
      suggestedTools: ['show_map'],
      estimatedMinutes: 3,
    },
    {
      id: 'concept-mission-tiers',
      kind: 'concept',
      goal: 'NASA designed the program in tiered phases — each Apollo mission proved a piece needed for the next.',
      keyIdeas: [
        'TIER 1: Spacecraft test flights (Apollo 4, 5, 6) — unmanned, prove the rockets and capsules.',
        'TIER 2: Crewed Earth-orbit (Apollo 7) — life support and mission systems with people aboard.',
        'TIER 3: Lunar orbit (Apollo 8, 10) — fly to the Moon, orbit it, return.',
        'TIER 4: Lunar landing (Apollo 11-17) — descent to the surface and return.',
      ],
      suggestedTools: ['show_diagram'],
      teacherNote: 'Brain should call show_diagram({ type: "hierarchy_pyramid", params: { tiers: [...four entries with label/description...], baseFirst: true, title: "Apollo Mission Phases" } }). Use the canonical `tiers` field on this segment.',
      estimatedMinutes: 3,
    },
    {
      id: 'concept-rocket-stages',
      kind: 'concept',
      goal: 'The Saturn V rocket itself was a tiered structure — three stages, each dropped after burning out, leaving a smaller rocket to continue.',
      keyIdeas: [
        'STAGE 1 (S-IC) — five massive engines, lifted the rocket off the pad.',
        'STAGE 2 (S-II) — five smaller engines, pushed the rocket through the upper atmosphere.',
        'STAGE 3 (S-IVB) — single engine, sent the spacecraft toward the Moon.',
        'COMMAND/SERVICE MODULE + LUNAR MODULE — what actually went to the Moon.',
      ],
      suggestedTools: ['show_diagram'],
      teacherNote: 'Brain should call show_diagram({ type: "hierarchy_pyramid", params: { levels: [...four entries...], title: "Saturn V Stages" } }) — use the `levels` alias on this segment to verify the solver accepts both names.',
      estimatedMinutes: 3,
    },
    {
      id: 'concept-image',
      kind: 'concept',
      goal: 'Show a real Apollo photograph and walk the student through what each visible feature is.',
      keyIdeas: [
        'A real photo from the lunar surface lets the student place names on visible features.',
        'Callouts mark: the Lunar Module, an astronaut\'s footprint, the U.S. flag, and the lunar surface texture.',
      ],
      suggestedTools: ['show_labeled_image'],
      teacherNote: 'Use the LEGACY src path here (not the query path) so callouts are kept. Suggested URL: https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~orig.jpg (Aldrin on the Moon, Apollo 11). Brain emits show_labeled_image({ src: "<url>", alt: "Aldrin on the lunar surface", callouts: [{x:50,y:60,text:"Lunar Module"}, {x:30,y:80,text:"Footprint"}, ...] }). The image-search interceptor only strips callouts on the query path; src-path callouts pass through.',
      references: [
        { kind: 'image', content: 'src: https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~orig.jpg' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why was Apollo 8 historically important even though it didn\'t land on the Moon?',
      expectedAnswer: 'Apollo 8 was the first mission to take humans beyond Earth\'s gravity and orbit the Moon. It proved the Saturn V could send people to lunar distance and return them safely — a critical step before any landing attempt.',
      responseFormat: 'free',
      hints: [
        'What happened on Apollo 8 that had never happened before?',
        'Think about each "first" you need before you can land — first to leave Earth\'s gravity? First to orbit another world?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Apollo ran from 1961 (announcement) to 1972 (Apollo 17).',
        'Launches from Florida; Mission Control in Texas; splashdowns in the Pacific.',
        'NASA designed in tiered phases — each mission proved a piece.',
        'The Saturn V was a 3-stage rocket; only the small Command Module returned home.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn QA', org: 'Evelyn', license: 'test-only' },
  schemaVersion: 1,
};
