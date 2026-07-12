/**
 * AP US History — CED Unit 1.6-1.7: Spanish Colonization and Labor Systems.
 *
 * Period-1 fan-out content plan (follows the Period-3 Vertical Slice's
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale). Third and final plan in Period 1's within-period chain
 * (native-societies → columbian-exchange → spanish-colonization).
 *
 * Anchor text: Bartolomé de las Casas, "A Brief Account of the Destruction
 * of the Indies" — evelyn.passage.apush-las-casas.v1. Teaching point is
 * Las Casas's testimony as EVIDENCE of an internal Spanish debate over
 * colonization's morality (culminating in the Valladolid debate,
 * 1550–51), not proof that his advocacy ended forced Indigenous labor —
 * it did not. Quotes ONLY the seeded excerpt; measured tone on forced
 * labor (no graphic spans beyond what the passage already contains).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U1_SPANISH_COLONIZATION: LessonPlan = {
  id: 'evelyn.ap.apush.spanish-colonization.v1',
  title: 'U1.6 Spanish Colonization and Labor Systems',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.spanish-colonization',
      description:
        'Explain how Spanish colonial labor systems (encomienda and repartimiento) and the developing casta social hierarchy shaped colonial society, and how internal Spanish debate over the treatment of Native Americans (culminating in the Valladolid debate, 1550–51) produced limited reform rather than the end of forced Indigenous labor.',
      standard: 'AP-APUSH-1.6',
    },
  ],
  prerequisites: ['apush.columbian-exchange'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see Spanish colonization as internally contested from early on, not a monolithic policy nobody in Spain questioned.',
      script:
        "It's tempting to imagine Spanish colonization of the Americas as a single, unopposed policy — conquest, then forced labor, with nobody back in Spain raising an objection. That's not what happened. Within a few decades of the earliest conquests, a Spanish Dominican friar who had lived in the colonies himself was writing detailed, furious accounts of the treatment of Native peoples under Spanish rule — and by 1550, the Spanish Crown was formally convening the country's most prominent theologians and jurists in the city of Valladolid to argue, in front of the king's representatives, about whether Spain's entire colonial labor system could be morally justified. That debate didn't end forced labor. It also didn't happen because Spain had a uniquely guilty conscience unlike other colonizing powers — every European colonial project ran on some form of coerced or displaced labor. But it does mean the moral argument over how Spain colonized the Americas started inside Spain, in Spain's own lifetime, not centuries later as historical hindsight.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-spanish-labor-systems',
      kind: 'concept',
      goal: 'Explain the encomienda and repartimiento labor systems, the casta hierarchy, and the Valladolid debate over Spanish colonization.',
      keyIdeas: [
        'FROM CONQUEST TO COLONIAL ADMINISTRATION: following conquests such as Hernán Cortés\'s defeat of the Aztec Empire (1519–1521), Spain established colonial administration over vast American territories, extracting labor and resources through systems that bound Native peoples to Spanish colonists.',
        'THE ENCOMIENDA: the earliest Spanish colonial labor system. The Crown granted an individual colonist (an encomendero) the right to demand labor and tribute from a designated group of Native people, nominally in exchange for protection and instruction in Catholicism. In practice, encomienda labor — especially in mining and agriculture — was frequently coercive and, combined with disease, contributed to devastating mortality among the Native populations bound to it.',
        'THE REPARTIMIENTO: as criticism of the encomienda grew and Native population collapse made individual labor grants increasingly unsustainable, the Spanish Crown shifted toward the repartimiento — a system of rotational forced labor drafts administered more directly by colonial officials rather than granted permanently to individual encomenderos. It reduced some of the encomienda\'s worst individual abuses but remained a coercive labor system, not a free one.',
        'THE CASTA SYSTEM: Spanish colonial society developed an elaborate hierarchy classifying people by ancestry and birthplace — peninsulares (born in Spain) at the top, followed by criollos (American-born, of Spanish descent), then mestizos (mixed Spanish and Native ancestry), mulattos (mixed Spanish and African ancestry), Native peoples, and enslaved Africans. Casta status shaped legal standing, tax obligations, and access to office throughout Spanish America.',
        'THE VALLADOLID DEBATE (1550–51): the Spanish Crown convened a formal debate in Valladolid, Spain, between Bartolomé de las Casas — who argued Native Americans were fully rational people who should be evangelized by persuasion, not conquered or enslaved — and Juan Ginés de Sepúlveda, who argued conquest and forced labor were justified because Native peoples were, in his view, natural inferiors. No side was formally declared the winner, but the debate itself shows the treatment of Native Americans was a live, contested moral and legal question within Spain\'s own colonial establishment, not simply an outside critique.',
        'REFORM ATTEMPTED, NOT ACHIEVED: partly in response to decades of advocacy by Las Casas and others, the Crown issued the New Laws (1542), restricting the inheritance of encomiendas and aiming to curb the worst abuses. Colonial encomenderos resisted fiercely — resistance in Peru turned violent — and enforcement across the colonies was weak. Forced Indigenous labor continued in evolving forms (notably the repartimiento) for generations after 1542.',
        'ONE APPROACH AMONG SEVERAL: Spain\'s extractive, labor-grant model of colonization was one approach among several European strategies for organizing contact with Native peoples in the Americas — a reminder that "European colonization" was not a single uniform process even before comparing it to other empires\' approaches in later periods.',
      ],
      vocabulary: [
        {
          term: 'encomienda',
          definition:
            "a Spanish colonial system granting an individual colonist the right to demand labor and tribute from a designated group of Native people, nominally in exchange for protection and Catholic instruction; frequently coercive in practice.",
        },
        {
          term: 'repartimiento',
          definition:
            'a Spanish colonial labor system that succeeded the encomienda, organizing forced Native labor through rotational drafts administered directly by colonial officials rather than granted to individual encomenderos.',
        },
        {
          term: 'casta system',
          definition:
            'the hierarchical classification of Spanish colonial society by ancestry and birthplace (peninsulares, criollos, mestizos, mulattos, Native peoples, enslaved Africans), determining legal status and opportunity.',
        },
        {
          term: 'Valladolid debate',
          definition:
            'a formal debate convened by the Spanish Crown in 1550–51 between Bartolomé de las Casas and Juan Ginés de Sepúlveda over whether the conquest and forced labor of Native Americans was morally and legally justified.',
        },
      ],
      passageId: 'evelyn.passage.apush-las-casas.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-las-casas',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Bartolomé de las Casas\'s "A Brief Account of the Destruction of the Indies": "…they divided among themselves the Young Men, Women, and Children reserved promiscuously for that purpose, one obtained thirty, another forty, to this Man one hundred were disposed, to the other two hundred… they sent the Males to the Mines to dig and bring away the Gold, which is an intollerable labor; but the Women they made use of to Manure and Till the ground… The Spaniards first set Sail to America, not for the Honour of God… nor to promote the Salvation of their Neighbours, nor to serve the King, as they falsely boast and pretend to do, but in truth, only stimulated and goaded on by insatiable Avarice and Ambition, that they might for ever Domineer, Command, and Tyrannize over the West-Indians." What is Las Casas documenting, and what is his own explanation for Spanish motives?',
      steps: [
        'SOURCE IT FIRST. Las Casas was a Dominican friar, formerly an encomendero himself, writing from firsthand experience of the early Caribbean conquests. First published in 1552, the account draws on decades of observation of Spanish colonial practice, written specifically to bring these abuses to the attention of the Spanish Crown.',
        'IDENTIFY THE FIRST CLAIM: THE ENCOMIENDA IN OPERATION. Las Casas describes Native people being divided among Spanish masters in fixed numbers ("one obtained thirty, another forty… to the other two hundred") and assigned to gendered forced labor — men to mining, women to agricultural labor. This is a direct, contemporary account of how the encomienda system actually operated on the ground, before the New Laws of 1542 attempted reform.',
        'IDENTIFY THE SECOND CLAIM: HIS EXPLANATION OF MOTIVE. Las Casas explicitly rejects the officially stated justifications for colonization — honoring God, saving souls, serving the King — and instead names the real motive as "insatiable Avarice and Ambition" to "Domineer, Command, and Tyrannize." This is Las Casas making an argument, not just reporting an observation: he is directly contesting Spain\'s own official rationale for its colonial project.',
        'CONNECT TO THE CONCEPT. This passage is EVIDENCE of the internal Spanish moral critique that fed into debates like Valladolid (1550–51) — Las Casas is a Spanish churchman challenging Spanish colonial practice from within, using the same moral vocabulary (honor, faith, service to the King) that the Crown itself used to justify colonization.',
        'STATE THE LINK TO THE COURSE THESIS, CAREFULLY. Las Casas\'s testimony documents the operation of the encomienda and the internal Spanish debate over its morality — it is NOT evidence that his advocacy ended the practice. The New Laws of 1542 attempted reform in response to voices like his, but colonial resistance and weak enforcement meant forced Indigenous labor continued afterward in evolving forms.',
      ],
      answer:
        'Las Casas documents the mechanics of the encomienda: Native people divided among Spanish masters in fixed numbers, then assigned to forced labor — men sent to the mines, women to agricultural work. He then directly rejects Spain\'s official justifications for colonization (honoring God, saving souls, serving the King), arguing instead that the true motive was "insatiable Avarice and Ambition" to dominate the people of the Indies. As a Dominican friar and former encomendero writing from firsthand experience, Las Casas is not an outside critic but a participant in an internal Spanish argument over the morality of colonization — the same argument that would later be formally staged at the Valladolid debate (1550–51). His testimony is best read as evidence of that internal Spanish debate and of how the encomienda actually functioned, not as evidence that his advocacy succeeded in ending forced Indigenous labor, which continued in altered form (the repartimiento) for generations after the partial reforms of 1542.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Briefly describe ONE feature of the encomienda or repartimiento labor system. (b) Briefly explain ONE piece of specific historical evidence documenting the effects of Spanish colonial labor systems on Native peoples. (c) Briefly explain ONE way the Valladolid debate reflected disagreement within Spain over the treatment of Native Americans.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine feature of the encomienda (a grant of Native labor/tribute to an individual colonist, nominally for protection and religious instruction) or the repartimiento (rotational forced labor drafts administered by colonial officials). No credit for a vague, unnamed "forced labor system" with no specific feature.',
            modelResponse:
              'Under the encomienda system, the Spanish Crown granted individual colonists (encomenderos) the right to demand labor and tribute from a designated group of Native people, nominally in exchange for protection and instruction in Catholicism.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific piece of historical evidence (e.g., Las Casas\'s writings, mortality patterns, the New Laws of 1542) documenting the effects of Spanish colonial labor systems, connected clearly to the system named in (a). No credit for vague or unconnected evidence.',
            modelResponse:
              "Bartolomé de las Casas's firsthand accounts describe Native people being divided among Spanish masters in fixed numbers and assigned to forced labor in the mines and fields — direct contemporary evidence of how coercive the encomienda system was in practice.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way the Valladolid debate (1550–51) showed internal Spanish disagreement — e.g. Las Casas arguing Native Americans were rational people deserving persuasion rather than conquest, against Sepúlveda arguing forced labor and conquest were justified. No credit for a vague or inaccurate description of the debate.',
            modelResponse:
              "At Valladolid, Bartolomé de las Casas argued that Native Americans were fully rational people who should be converted through persuasion rather than conquered or enslaved, while Juan Ginés de Sepúlveda argued that conquest and forced labor were justified — showing that Spain's own colonial establishment was formally and publicly divided over whether its treatment of Native Americans was morally justifiable.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-las-casas-ended-encomienda',
      kind: 'misconception_check',
      question:
        "True or false: Bartolomé de las Casas's advocacy at the Valladolid debate succeeded in abolishing the encomienda system and ending forced Indigenous labor in Spanish America.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming that a documented moral debate (Valladolid) or a documented legal reform (the New Laws) must have translated directly into ending the practice being debated — conflating advocacy and law-on-paper with actual enforcement on the ground.',
          correctsTo:
            "FALSE. Partly in response to Las Casas's decades of advocacy, the Crown issued the New Laws (1542) restricting the inheritance of encomiendas — but colonial encomenderos resisted fiercely (resistance in Peru turned violent), enforcement across the colonies was weak, and forced Indigenous labor continued in evolving forms, notably the repartimiento, for generations afterward. The Valladolid debate itself (1550–51) reached no formally declared winner. It's also worth noting that Spain's extractive labor-grant approach was only one European colonization strategy — a reminder against assuming all European powers colonized the Americas identically, even as you keep the specific Spanish case straight: internal debate and partial legal reform are not the same as ending the practice.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The encomienda granted individual colonists the right to Native labor/tribute nominally for protection and Catholic instruction — in practice, frequently coercive.',
        'The repartimiento succeeded the encomienda: rotational forced labor administered directly by colonial officials, still coercive, not free labor.',
        'The casta system classified Spanish colonial society by ancestry (peninsulares, criollos, mestizos, mulattos, Native peoples, enslaved Africans), shaping legal status and opportunity.',
        'The Valladolid debate (1550–51), Las Casas vs. Sepúlveda, shows Spain\'s treatment of Native Americans was a live, contested question within Spain itself, not just an outside critique.',
        "Las Casas's advocacy shaped debate and produced partial legal reform (the New Laws, 1542) — it did NOT end forced Indigenous labor, which continued via the repartimiento.",
        'Spanish colonization\'s extractive labor-grant model was one European approach among several — do not assume all European colonizers used the same methods.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.6-1.7',
    cedTitle: 'Spanish Colonization and Labor Systems',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-las-casas.v1',
        chapter: '1542',
        note: 'Bartolomé de las Casas, "A Brief Account of the Destruction of the Indies" — anchor document for internal Spanish debate over colonial labor systems.',
      },
    ],
  },
};
