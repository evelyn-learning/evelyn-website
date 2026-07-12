/**
 * AP World History: Modern — CED Unit 4.6: The Atlantic Slave Trade.
 *
 * Unit-4 fan-out content plan, fourth in the within-unit chain
 * (maritime-exploration → columbian-exchange-global → maritime-empires →
 * atlantic-slave-trade → resistance-accommodation). concept = the
 * historical argument (what was the scale and geography of the Atlantic
 * slave trade, and how did it reshape West/West-Central African societies
 * as well as the Americas?); worked_example = annotated document analysis;
 * try_yourself = a 3-point SAQ-style short-answer.
 *
 * Anchor text: Olaudah Equiano, "The Interesting Narrative" (1789) —
 * evelyn.passage.apush-equiano.v1 (REUSE from APUSH). Quotes ONLY the
 * seeded excerpt (inspection/confinement/fear, the same measured span
 * used in ap-apush-u2-slavery-colonies.ts), reframed here for the AP World
 * global/African-societies argument rather than APUSH's abolition-debate
 * framing. Measured, exam-neutral tone throughout, per Global Constraints.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U4_ATLANTIC_SLAVE_TRADE: LessonPlan = {
  id: 'evelyn.ap.apworld.atlantic-slave-trade.v1',
  title: 'U4.6 The Atlantic Slave Trade',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.atlantic-slave-trade',
      description:
        'Explain the scale and destinations of the Atlantic slave trade, the Middle Passage, the political and economic effects on West and West-Central African states, and the plantation complex and diaspora cultures that resulted in the Americas, 1450-1750.',
      standard: 'AP-APWORLD-4.6',
    },
  ],
  prerequisites: ['apworld.maritime-empires'],
  followUps: ['apworld.resistance-accommodation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the Atlantic slave trade as a system with a specific geography and specific African political effects, not a vague, undifferentiated tragedy.',
      script:
        "If asked where enslaved Africans were taken across the Atlantic, most people guess North America first — it's the part of the story most familiar from later U.S. history. The actual geography looks very different: fewer than five percent of all enslaved Africans transported across the Atlantic were brought to what became the United States. The overwhelming majority went to Brazil and the Caribbean, where brutal mortality rates on sugar plantations created a constant demand for replacement labor. And the trade wasn't simply something Europeans did TO Africa from the outside — African states on the coast, like Dahomey and Asante, became active participants, trading captives for firearms in a cycle that reshaped West African politics for centuries. Getting the scale and the geography right is the first step to understanding what this system actually did.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-atlantic-slave-trade',
      kind: 'concept',
      goal: 'Explain the scale/geography of the Atlantic slave trade, the Middle Passage, its effects on West African political development, and the plantation complex and diaspora cultures it produced.',
      keyIdeas: [
        "SCALE AND GEOGRAPHY: historians estimate roughly 12.5 million enslaved Africans were embarked across the Atlantic slave trade over its full history. Fewer than 5 percent were transported to British North America and, later, the United States; the large majority went to Brazil and the Caribbean, where sugar plantations' brutal mortality rates created constant demand for replacement labor.",
        'THE MIDDLE PASSAGE: the transatlantic voyage confined captives below deck under crowded, dehumanizing conditions for weeks at a time, with substantial mortality during the crossing itself. First-person accounts, like Olaudah Equiano\'s, describe the psychological terror of being physically inspected and appraised by a ship\'s crew before the voyage had even begun.',
        'AFRICAN POLITICAL EFFECTS — THE GUN-SLAVE CYCLE: coastal West African states, including Dahomey and Asante, became deeply involved in supplying captives to European traders in exchange for firearms and other manufactured goods. This created a self-reinforcing "gun-slave cycle": firearms won through the slave trade funded further wars and raids that produced more captives to trade, intensifying regional conflict and reorganizing political power around states positioned to control the trade.',
        "KONGO'S DIPLOMATIC RESPONSE: the kingdom of Kongo engaged directly and diplomatically with Portugal from the early 1500s, including correspondence in which Kongo's ruler, Afonso I, raised concerns to the Portuguese crown about the trade's disruptive effects on his kingdom — evidence that African states responded to the trade through active diplomacy, not passive acceptance, even where they could not fully control its consequences.",
        'THE PLANTATION COMPLEX: enslaved Africans in the Americas were forced to labor within a plantation complex organized around brutal, profit-maximizing systems (such as gang labor on sugar, tobacco, and rice plantations), producing cash crops for export back across the Atlantic.',
        'DIASPORA CULTURES: out of these conditions, enslaved and free Africans in the Americas created syncretic diaspora cultures — blending African religious, musical, and linguistic traditions with elements of European and Indigenous American cultures — that persisted and evolved across the Americas.',
      ],
      vocabulary: [
        {
          term: 'Middle Passage',
          definition:
            'the transatlantic voyage transporting enslaved Africans to the Americas under confined, dehumanizing conditions, with substantial mortality during the crossing.',
        },
        {
          term: 'gun-slave cycle',
          definition:
            'a self-reinforcing pattern in which West African states traded captives for European firearms, then used those firearms to wage further wars and raids that produced more captives to trade.',
        },
        {
          term: 'plantation complex',
          definition:
            'the system of large agricultural estates (sugar, tobacco, rice) in the Americas organized around forced enslaved labor (often gang labor) to produce cash crops for export.',
        },
      ],
      passageId: 'evelyn.passage.apush-equiano.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-equiano',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Olaudah Equiano\'s "The Interesting Narrative" (1789): "The first object which saluted my eyes when I arrived on the coast was the sea, and a slave ship… I was immediately handled and tossed up to see if I were sound by some of the crew… and saw a large furnace or copper boiling, and a multitude of black people of every description chained together, every one of their countenances expressing dejection and sorrow, I no longer doubted of my fate; and, quite overpowered with horror and anguish, I fell motionless on the deck and fainted." What is Equiano documenting here, and what should a careful reader keep in mind about how this testimony fits into the broader Atlantic system?',
      steps: [
        'SOURCE IT FIRST. Olaudah Equiano published his Interesting Narrative in 1789, decades after the childhood experience it recounts, as a firsthand account by someone who had himself been transported through the trade he describes.',
        'IDENTIFY WHAT THE PASSAGE DOCUMENTS. Equiano describes being physically inspected — "handled and tossed up to see if I were sound" — the language of livestock or cargo appraisal applied to a person — and then seeing other captives "chained together" aboard ship, along with his own overwhelming psychological reaction of "horror and anguish."',
        "CONNECT TO THE CONCEPT, CAREFULLY. This is firsthand testimony to the Middle Passage's dehumanizing treatment of captives as cargo to be inspected and confined — direct evidence of the human experience the concept's scale and geography figures describe in the aggregate. It is not, by itself, evidence about the trade's overall volume, its African-side political causes (the gun-slave cycle), or its destinations — those require the separate scale and political-effects evidence covered in the concept.",
        'KEEP THE TONE MEASURED. Equiano\'s own account here conveys terror and dehumanization through inspection, confinement, and fear, without needing more graphic detail — a useful model for how to discuss the Middle Passage\'s realities without sensationalizing them.',
        'STATE THE LINK TO THE COURSE THESIS. Equiano\'s testimony personalizes what the aggregate figures (roughly 12.5 million embarked, the large majority to Brazil and the Caribbean) describe abstractly: an individual\'s experience of being treated as cargo at the very start of a system that, at scale, reorganized economies and societies across three continents.',
      ],
      answer:
        'Equiano documents the terror and dehumanization of the very start of the Middle Passage: being physically inspected by the crew ("handled and tossed up to see if I were sound," language usually applied to livestock or cargo) and seeing other captives "chained together" aboard ship, alongside his own overwhelming reaction of "horror and anguish." This is firsthand evidence of how captives were treated as cargo to be appraised and confined — direct testimony to the human experience underlying the trade\'s aggregate scale (roughly 12.5 million people embarked, the large majority destined for Brazil and the Caribbean rather than North America). It is not, on its own, evidence of the trade\'s volume, its African political causes, or its destinations — those require the separate scale and gun-slave-cycle evidence covered in the concept. Read carefully and without added embellishment, Equiano\'s account personalizes, at the level of one individual, what the trade did to millions.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE region of the Americas that received the majority of enslaved Africans transported via the Atlantic slave trade. (b) Explain ONE way the slave trade affected the political development of West African states. (c) Explain ONE feature of the plantation complex that enslaved Africans were forced to labor within.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies Brazil and/or the Caribbean as the destination of the large majority of enslaved Africans, or correctly states that North America received under 5 percent. No credit for incorrectly naming North America as the majority destination.',
            modelResponse:
              'The large majority of enslaved Africans transported across the Atlantic were taken to Brazil and the Caribbean, not to British North America, which received fewer than 5 percent of the total.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate political effect on a West or West-Central African state — e.g. the gun-slave cycle intensifying regional warfare and reorganizing political power, or Kongo\'s diplomatic engagement with Portugal. No credit for a vague or unconnected claim.',
            modelResponse:
              'The slave trade drew coastal states like Dahomey and Asante into a self-reinforcing gun-slave cycle, in which firearms obtained by trading captives funded further wars and raids that produced more captives to trade, intensifying regional conflict and reorganizing political power around states able to control the trade.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate feature of the plantation complex — e.g. gang labor, cash-crop production (sugar/tobacco/rice) for export, or brutal, profit-maximizing labor systems. No credit for a vague or unsupported claim.',
            modelResponse:
              'On sugar and tobacco plantations, enslaved Africans were forced to labor under gang-labor systems that maximized cash-crop output for export back across the Atlantic, with high mortality rates driving continued demand for newly enslaved workers.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-north-america-majority',
      kind: 'misconception_check',
      question:
        'True or false: the majority of enslaved Africans transported across the Atlantic were brought to what became the United States.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Projecting the prominence of slavery in later U.S. history backward onto the trade's overall geography, and assuming familiarity with the U.S. case means it was the trade's largest destination.",
          correctsTo:
            'FALSE. Fewer than 5 percent of the roughly 12.5 million enslaved Africans embarked across the Atlantic slave trade were transported to British North America and, later, the United States. The large majority were taken to Brazil and the Caribbean, where sugar plantations\' brutal mortality rates created constant demand for newly enslaved labor. The prominence of slavery in later U.S. history reflects that country\'s subsequent political history, not the trade\'s overall geography.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Roughly 12.5 million enslaved Africans were embarked across the Atlantic slave trade; fewer than 5 percent went to North America, with the large majority taken to Brazil and the Caribbean.',
        "The Middle Passage confined captives under crowded, dehumanizing conditions — documented in first-person accounts like Equiano's account of being inspected and confined.",
        "The gun-slave cycle drew coastal West African states like Dahomey and Asante into the trade, trading captives for firearms that funded further wars producing more captives.",
        "Kongo's rulers, including Afonso I, engaged diplomatically with Portugal, raising concerns about the trade — evidence of active African-state response, not passive acceptance.",
        'Enslaved Africans in the Americas labored within a brutal, profit-maximizing plantation complex, out of which enslaved and free Africans built syncretic diaspora cultures.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.4/4.6',
    cedTitle: 'The Atlantic Slave Trade',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-equiano.v1',
        chapter: '1789',
        note: 'Olaudah Equiano, "The Interesting Narrative of the Life of Olaudah Equiano" — anchor document for firsthand Middle Passage testimony (REUSE from APUSH).',
      },
    ],
  },
};
