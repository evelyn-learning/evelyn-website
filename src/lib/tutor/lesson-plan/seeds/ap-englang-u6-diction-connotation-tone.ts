/**
 * AP English Language & Composition — CED Unit 6.2: Diction, Connotation,
 * and Tone.
 *
 * Builds on Unit 4.3 (diction and tone) at higher sophistication: instead
 * of naming one connotative register that produces a single tone, students
 * now track how a text can LAYER multiple connotative registers (e.g.
 * clinical/statistical alongside heroic/civic-virtue) and how the FRICTION
 * or ESCALATION between registers is itself a sophisticated source of tone
 * and irony — a step up from "the tone is X because of these words."
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows (concept = rhetorical
 * move; worked_example = annotated model; try_yourself MICRO grain:
 * responseFormat 'free', single rubric part worth 6).
 *
 * Anchor text for concept/worked example: Jonathan Swift's "A Modest
 * Proposal" — evelyn.passage.swift-modest-proposal.v1 — pushing past the
 * clinical/statistical register already covered in 4.3 to the SECOND,
 * grandiose civic-virtue register Swift layers on top ("deserve so well of
 * the publick... statue set up for a preserver of the nation"). Try-yourself
 * uses Frederick Douglass's escalating catalog of connotative indictments —
 * evelyn.passage.douglass-fourth-of-july.v1 — for passage variety. Quotes
 * are limited to the short structural/rhetorical phrases per content-safety
 * guidance; no graphic content is referenced.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U6_DICTION_CONNOTATION_TONE: LessonPlan = {
  id: 'evelyn.ap.englang.diction-connotation-tone.v1',
  title: 'U6.2 Diction, Connotation, and Tone',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.diction-connotation-tone',
      description:
        "Analyze precise word choices and their connotations at a higher level of sophistication than introductory diction work — naming the specific connotative register a cluster of words belongs to, tracking escalating diction, and explaining how multiple registers combine or collide to construct (or complicate) an overall tone.",
      standard: 'AP-ENGLANG-6.2',
    },
  ],
  prerequisites: ['apenglang.syntax-for-effect', 'apenglang.diction-and-tone'],
  followUps: ['apenglang.figurative-language-schemes'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Push past single-register tone analysis to multi-register friction, before naming any terms.',
      script:
        "You already know that \"frugal\" and \"cheap\" describe the same behavior with opposite judgment baked in. But real texts rarely stick to ONE connotative register the whole way through — a writer can blend a clinical register with a heroic one, or let two very different word-families collide in the same paragraph, and the FRICTION between those registers is often where the sharpest tone lives. Today we get more precise: not just naming one tone, but tracking how multiple connotative threads interact — and sometimes escalate — across a passage.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-connotative-registers',
      kind: 'concept',
      goal: 'Define connotative register, escalating diction, and register friction, and show how layering registers is more sophisticated than naming a single tone word.',
      keyIdeas: [
        "A CONNOTATIVE REGISTER is a family of words that share a similar charge — clinical/bureaucratic, heroic/civic, sentimental, contemptuous. Sophisticated diction analysis names the REGISTER a word belongs to, not just that single word's individual charge.",
        "Texts often layer MULTIPLE connotative registers rather than relying on a single one — for example, clinical/statistical diction alongside grandiose/heroic diction — and the FRICTION between two registers can itself be the source of tone (irony, self-satire, dramatic contrast).",
        "ESCALATING DICTION moves a claim through a sequence of increasingly loaded synonyms for the same idea. Tracking the escalation itself (word 1 → word 2 → word 3, each more charged than the last) is more sophisticated than picking one word out of context.",
        "Sophisticated tone analysis distinguishes WORD-LEVEL from PASSAGE-LEVEL tone: a single word's connotation is a data point; the analytical move is explaining how a CLUSTER of words — or the interaction of two clusters — commits the writer to a stance, and how that stance may shift or complicate itself as a new register enters.",
        "CONNOTATIVE CONTRAST AS ARGUMENT: when a writer applies elevated, laudatory diction to something that should provoke discomfort, or ordinary/self-interested diction to something that should be exalted, that mismatch is doing rhetorical work. Noticing which register is misapplied to which subject IS the analytical move.",
        "The higher-sophistication trap: stopping at \"the diction is negative\" or \"the tone is ironic\" without naming the SPECIFIC register at work (clinical? heroic? sentimental?) and explaining how two registers interact, rather than treating diction as one undifferentiated pile of loaded words.",
      ],
      vocabulary: [
        { term: 'connotative register', definition: 'a family of words sharing a similar emotional or associative charge (clinical, heroic, sentimental, contemptuous, etc.).' },
        { term: 'escalating diction', definition: 'a sequence of increasingly loaded synonyms for the same idea across a passage.' },
        { term: 'register friction', definition: 'the tension or contrast produced when two different connotative registers collide within the same passage.' },
        { term: 'misapplied register', definition: "language belonging to one register (e.g. heroic) deliberately applied to a subject that register doesn't fit, exposing a mismatch." },
      ],
      passageId: 'evelyn.passage.swift-modest-proposal.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-swift-registers',
      kind: 'worked_example',
      problem:
        "Building on the clinical/statistical register already identified in Swift's opening (\"prodigious number,\" \"additional grievance,\" \"computation\"), analyze the SECOND, contrasting register Swift layers on top: whoever solves this problem \"would deserve so well of the publick, as to have his statue set up for a preserver of the nation\" (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.swift-modest-proposal.v1).",
      steps: [
        "NAME THE SECOND REGISTER. Alongside the clinical/statistical vocabulary already identified, Swift introduces a second, contrasting register: heroic/civic-virtue diction — \"deserve so well of the publick,\" \"statue set up,\" \"preserver of the nation\" — language normally reserved for a war hero or a founding statesman.",
        "EXPLAIN WHAT THIS REGISTER NORMALLY DESCRIBES. This is the vocabulary of public monuments and civic memory — the diction a society uses to honor someone who has done something history-making and selfless.",
        "NAME THE MISAPPLICATION. Swift applies this heroic register not to any act of genuine sacrifice, but to whoever devises an efficient method for processing poor children as a commodity — the register is aimed at exactly the wrong kind of \"achievement.\"",
        "EXPLAIN THE FRICTION BETWEEN THE TWO REGISTERS. The clinical register (computation, grievance) already flattened children into a policy problem; layering a heroic register on top doesn't soften that — it exposes how easily a society dresses up a monstrous calculation in the language of civic virtue, congratulating itself for \"solving\" what it should be ashamed of creating.",
        "EXPLAIN WHY THIS ESCALATION — TWO REGISTERS, NOT ONE — SERVES SWIFT'S PURPOSE. By escalating from clinical detachment to full statue-worthy celebration, Swift shows how far self-congratulation can travel once a society has stopped seeing the people underneath the \"computation\" — the absurdity of a \"statue\" for this \"solution\" primes the reader for the far worse escalation still to come.",
        "LINK BACK. The two-register collision — bureaucratic tallying dressed up as heroism — is more sophisticated evidence of Swift's satire than either register alone, because it shows the persona's self-regard growing in direct proportion to the horror of what it is actually proposing.",
      ],
      answer:
        "Swift layers a second, heroic/civic-virtue register — \"deserve so well of the publick,\" \"statue set up... for a preserver of the nation\" — on top of the clinical, statistic-minded register already at work in \"computation\" and \"additional grievance.\" That heroic vocabulary normally honors selfless, history-making sacrifice; applying it here, to whoever devises an efficient method of processing poor children, exposes how readily a society dresses up a monstrous calculation as civic virtue. The escalation from clinical detachment to statue-worthy celebration — not either register alone — shows self-congratulation growing in exact proportion to the horror underneath it, priming the reader for the far worse escalation still to come.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-micro-douglass-registers',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.douglass-fourth-of-july.v1, write ONE sentence identifying the connotative register(s) at work in Douglass's catalog — \"your celebration is a sham; your boasted liberty, an unholy license; your national greatness, swelling vanity; your sounds of rejoicing are empty and heartless; your denunciations of tyrants, brass fronted impudence; your shouts of liberty and equality, hollow mockery\" — and explain how the escalating, increasingly damning connotations (sham → unholy → swelling vanity → empty and heartless → brass fronted impudence → hollow mockery) construct one unified tone of indictment rather than a scattered list of separate complaints.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      rubric: {
        parts: [
          {
            criterionId: 'register-escalation',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the sentence names the connotative register at work (e.g. morally-charged condemnation — \"sham,\" \"unholy,\" \"hollow\" — words that accuse rather than merely criticize) AND explains how the ESCALATION across the six clauses (each term more damning than the last, culminating in \"hollow mockery\") produces one unified, building tone of total indictment rather than a list of isolated complaints. Partial credit for naming negative connotation without identifying the register or the escalation, or for noting escalation without explaining how it unifies into one tone. No credit for a sentence that only restates the catalog's content (e.g. \"Douglass says the celebration is fake\") with no claim about register or escalation.",
            modelResponse:
              "By escalating through an increasingly damning moral register — from \"a sham\" to \"unholy license\" to the culminating \"hollow mockery\" — Douglass turns six separate observations into a single, mounting indictment that leaves no value of the holiday unindicted.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-negative-words-only',
      kind: 'misconception_check',
      question:
        'A student writes: "Douglass uses a lot of negative words in this passage." Is this an adequate diction analysis?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Cataloging negative connotation generally, without naming the SPECIFIC register the words belong to or explaining how they build on or escalate past each other.",
          correctsTo:
            "No — \"a lot of negative words\" is an observation, not an analysis. Which register are these words drawn from (moral condemnation? religious betrayal — \"unholy\"? emptiness — \"hollow,\" \"empty and heartless\"?), and do they simply pile up or do they ESCALATE — does each term hit harder than the one before it? Compare: \"a lot of negative words\" (no credit-earning content) versus \"an escalating register of moral condemnation, from 'a sham' to the culminating 'hollow mockery,' that turns six separate observations into one mounting indictment\" (named register + escalation + unified effect). Always name the register and track whether it builds.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "A connotative register is a family of words sharing a similar charge — name the register, not just one word's individual charge.",
        "Texts often layer multiple registers; the FRICTION between them (e.g. clinical detachment dressed up as heroism) can itself be the sharpest source of tone.",
        "Escalating diction moves through increasingly loaded synonyms for the same idea — track the climb, not just the endpoint.",
        "A misapplied register (heroic language for a monstrous act, ordinary language for something that should be exalted) exposes the writer's real target.",
        "Never stop at \"the tone is negative/ironic\" — name the specific register(s) at work and explain how they combine or escalate into one unified tone.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.2',
    cedTitle: 'Diction, Connotation, and Tone',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '6',
        note: 'AP English Language and Composition Course and Exam Description, Unit 6 — advanced diction/connotation analysis: connotative registers, escalating diction, and register friction.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.swift-modest-proposal.v1',
        chapter: '1729',
        note: 'Jonathan Swift, "A Modest Proposal" — anchor text for the clinical-register-plus-heroic-register collision.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.douglass-fourth-of-july.v1',
        chapter: '1852',
        note: 'Frederick Douglass, "What to the Slave Is the Fourth of July?" — practice text for escalating connotative registers.',
      },
    ],
  },
};
