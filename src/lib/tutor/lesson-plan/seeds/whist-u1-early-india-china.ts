/**
 * World History — Early India & China: The Indus Valley to the Zhou.
 *
 * Two river valleys, two very different records: one civilization we can
 * walk through but not read, and one we can read because someone carved
 * questions into bone. The Zhou answer to "who deserves to rule?" — the
 * Mandate of Heaven — becomes the political logic of China for three
 * thousand years. C3 D2.His.1.9-12, D2.Geo.2.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U1_EARLY_INDIA_CHINA: LessonPlan = {
  id: 'evelyn.hs.whist.early-india-china.v1',
  title: 'Early India & China: The Indus Valley to the Zhou',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.early-india-china',
      standard: 'WHIST-1.4',
      description:
        'Compare the river-valley civilizations of the Indus and the Huang He, explain how geography and written records shape what historians can know about each, and analyze how the Zhou idea of the Mandate of Heaven both justified and limited a ruler\'s power (C3 D2.His.1.9-12, D2.Geo.2.9-12).',
    },
  ],
  prerequisites: ['whist.mesopotamia-egypt'],
  followUps: ['whist.classical-greece'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the unit around two questions: why can we not read the Indus, and why could a Chinese emperor be fired by the sky?',
      script:
        'Four thousand years ago, someone in Mohenjo-Daro walked home along a straight paved street, past covered drains that carried waste out of the city — plumbing better than most of Europe had in 1800. We can walk those streets today. We still cannot read a single word they wrote. Meanwhile, a thousand miles east along the Huang He, a Chinese king was heating an ox bone until it cracked, reading the cracks as answers from his ancestors — and scratching the question beside them. Those scratches are the oldest Chinese writing we have, and they are why we know his name and not theirs. Today: two river valleys, two very different records, and one idea from the Zhou dynasty — the Mandate of Heaven — that told rulers they could be fired by the sky itself.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-indus-and-huang-he',
      kind: 'concept',
      goal: 'The Indus cities and their decline, Aryan migration and Vedic society, and the Shang-to-Zhou arc that produces the Mandate of Heaven.',
      keyIdeas: [
        'THE INDUS WAS PLANNED, NOT SPRAWLED — from roughly 2600 to 1900 BCE, cities like Harappa and Mohenjo-Daro (in today\'s Pakistan and northwest India) were laid out on grids, built of standard-sized fired bricks, with public wells, private bathrooms, and covered drains under the streets. Standardized weights show trade reached Mesopotamia. Nobody has found a giant royal tomb or a palace — the elite here did not advertise themselves the way Egypt\'s pharaohs did.',
        'WE CANNOT READ THEM — the Indus script survives on about a thousand short seals and objects, most only four or five signs long, with no bilingual key like the Rosetta Stone. It remains undeciphered. This is why Indus history is told through ARTIFACTS (bricks, drains, seals) instead of kings and battles — silence in the record is a limit on evidence, not proof of a simple society.',
        'THE DECLINE WAS SLOW AND PROBABLY ENVIRONMENTAL — after about 1900 BCE the cities were gradually abandoned. Leading explanations are shifting or drying rivers (the Sarasvati river system dried; the Indus changed course), monsoon weakening, and the strain on trade and farming that followed. Older textbooks blamed an Aryan invasion that destroyed the cities; the archaeology does not support a conquest, and the decline began before the migrations.',
        'ARYAN MIGRATION AND VEDIC SOCIETY — Indo-Aryan speakers moved into northern India in waves after roughly 1500 BCE, bringing horses, cattle-herding, and the Sanskrit language. Their hymns, the Vedas, were memorized and recited for centuries before being written down, and they are our main window on this period. Out of Vedic society came early varna social ranking and religious ideas that later grow into Hinduism — a migration and blending, not a single invasion event.',
        'CHINA\'S SHANG: WRITING BORN FROM DIVINATION — along the Huang He (Yellow River), whose loess silt made soil rich and floods catastrophic, the Shang dynasty (c. 1600–1046 BCE) ruled from cities like Anyang. Kings asked ancestors about harvests, war, and childbirth by heating ox bones and turtle shells until they cracked, then carved the question on the bone. These ORACLE BONES are the earliest known Chinese writing — and its characters are the direct ancestors of the ones written today. The Shang also cast extraordinary ritual bronzes, a technology controlled by the state.',
        'ZHOU AND THE MANDATE OF HEAVEN — when the Zhou overthrew the Shang in 1046 BCE, they had to explain why rebellion was not treason. Their answer: Heaven grants the right to rule to a just ruler, and withdraws it from a cruel one. The last Shang king was corrupt, so Heaven transferred the mandate. This is the longest-lived political idea in Chinese history; the Zhou themselves became China\'s longest dynasty (to 256 BCE).',
        'THE MANDATE CUTS BOTH WAYS — it JUSTIFIES a new dynasty, but it also CONSTRAINS the ruler: floods, famine, defeat, and revolt can all be read as signs Heaven is withdrawing its favor, which makes good government self-interest. It produces the dynastic cycle historians describe — a dynasty rises, governs well, grows corrupt or unlucky, loses the mandate, and is replaced. Note the circularity students should catch: winning is the evidence of having the mandate, which is exactly why every later rebel claimed it.',
        'CLASSIC CONFUSIONS TO NAIL DOWN — Indus is a RIVER VALLEY in South Asia, the Huang He is in East Asia; the two civilizations were not in contact in any sustained way. Shang comes BEFORE Zhou. The Mandate of Heaven is Chinese, not Indian. And "we cannot read the Indus script" does not mean "the Indus had no writing."',
      ],
      vocabulary: [
        { term: 'oracle bones', definition: 'Shang animal bones and turtle shells heated until they cracked for divination, inscribed with the question asked — the earliest known Chinese writing.' },
        { term: 'Mandate of Heaven', definition: 'the Zhou doctrine that Heaven grants the right to rule to a just ruler and withdraws it from an unjust one, legitimizing both dynasties and rebellions against them.' },
        { term: 'Vedas', definition: 'the oral hymns and ritual texts of early Indo-Aryan society in India, transmitted by memory for centuries before being written down.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-compare-records',
      kind: 'worked_example',
      problem:
        'Compare what historians can say about the Indus Valley with what they can say about Shang China. Both are Bronze Age river-valley civilizations — so why does one get a list of named kings and the other does not?',
      steps: [
        'Start with what each site actually yields. Mohenjo-Daro gives streets, drains, wells, standardized bricks and weights, and short inscribed seals. Anyang gives royal tombs, ritual bronzes, and tens of thousands of inscribed oracle bones.',
        'Ask what each type of evidence can answer. Bricks and drains answer HOW PEOPLE LIVED: city planning, sanitation, trade standards, roughly equal housing. They cannot tell you a ruler\'s name or what he decided in a given year.',
        'Now the writing. The Indus script exists but is undeciphered — the inscriptions are very short, there is no bilingual key, and the underlying language is unknown. Oracle-bone writing IS readable, and because it is the ancestor of modern Chinese characters, scholars can recover names, dates, wars, harvests, and even royal anxieties.',
        'Draw the causal link: the type of surviving record determines the type of history that can be written. Shang gets political narrative — a king list confirmed by the bones themselves. Indus gets social and economic history reconstructed from material remains.',
        'Guard against the wrong conclusion. This is a difference in EVIDENCE, not in sophistication. The Indus built the most advanced urban sanitation of its age; the silence is in our ability to read, not in their achievement. If the script were deciphered tomorrow, Indus history would gain names overnight.',
      ],
      answer:
        'Shang China left readable writing (oracle bones, ancestral to modern Chinese), so it supports a named political narrative; the Indus left an undeciphered script, so its history must be built from material evidence — a difference in surviving records, not in complexity.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-mandate-source',
      kind: 'worked_example',
      problem:
        'A Zhou official explains the overthrow of the Shang in words paraphrased like this: "Heaven does not favor any family forever. The last Shang king drank while his people starved, so Heaven looked for a ruler who would care for them and settled its mandate on us. Let our sons remember that Heaven watches them too." Analyze this claim: what work is it doing, and what does it demand of the Zhou themselves?',
      steps: [
        'Identify the immediate problem the speaker faces. The Zhou were subjects who overthrew their king. Without an argument, that is simple treason — so the statement must make rebellion legitimate.',
        'Find the justification move: "Heaven does not favor any family forever." Rule is a conditional grant, not permanent property. If the Shang king failed his people, the grant lapsed — so the Zhou did not steal power, they received it.',
        'Notice the standard being used. The test is the ruler\'s CONDUCT toward the people ("drank while his people starved"), not birth or force. That plants a moral criterion at the center of Chinese political thought.',
        'Read the last sentence carefully — it is aimed at the Zhou, not the Shang. "Heaven watches them too" means the same rule that removed the Shang can remove the Zhou. The argument that legitimizes them also puts them permanently on probation.',
        'Extract the long-run consequence: because disasters, famine, and defeat can be read as Heaven withdrawing favor, every later rebel in Chinese history has this ready-made claim, and every dynasty has an incentive to govern well and to manage floods. That two-way logic is the engine of the dynastic cycle.',
        'Note the limit of the source: it is the winners explaining their own victory, so its portrait of the last Shang king as a drunkard is a political charge as much as a description.',
        'Close the analysis: the passage justifies the Zhou seizure of power AND binds the Zhou to the same standard — legitimacy earned by conduct and revocable at any time.',
      ],
      answer:
        'The claim makes rebellion legitimate by treating rule as a conditional grant from Heaven based on the ruler\'s conduct — and by the same logic binds the Zhou, since Heaven can withdraw the mandate from them too; it is also winners\' propaganda about the defeated king.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-indus-planning',
      kind: 'try_yourself',
      problem:
        'Archaeologists at Mohenjo-Daro and Harappa find street grids, bricks of standardized size across both cities, covered drains, and shared weights — but no huge royal tomb or palace. What is the strongest conclusion this evidence supports?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Some coordinating authority enforced shared standards, though its form and rulers remain unidentified', correct: true },
        { id: 'b', text: 'The Indus cities had no government and each household built as it pleased' },
        { id: 'c', text: 'The Indus was ruled by a pharaoh whose tomb has not yet been located' },
        { id: 'd', text: 'The cities were built by Aryan migrants who arrived after 1500 BCE' },
      ],
      expectedAnswer: 'Some coordinating authority enforced shared standards, though its form and rulers remain unidentified',
      hints: [
        'Standardized bricks and weights in two cities hundreds of miles apart do not happen by accident — someone set and enforced the standard.',
        'Then ask what the MISSING palace and royal tomb tell you: we can infer coordination without being able to name or describe the rulers.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-oracle-bones',
      kind: 'try_yourself',
      problem:
        'Why are Shang oracle bones so valuable to historians of early China?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They carry the earliest known Chinese writing, recording royal questions about war, harvests, and other concerns', correct: true },
        { id: 'b', text: 'They preserve the Zhou explanation of why the Shang lost the Mandate of Heaven' },
        { id: 'c', text: 'They contain a bilingual key that allowed scholars to decipher the Indus script' },
        { id: 'd', text: 'They are the account books of Shang merchants trading with the Roman Empire' },
      ],
      expectedAnswer: 'They carry the earliest known Chinese writing, recording royal questions about war, harvests, and other concerns',
      hints: [
        'Think about WHAT was carved onto the bone before it was heated and cracked.',
        'The value is twofold: it is the oldest Chinese writing we have, and its content is the king\'s own agenda in his own words.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-mandate-logic',
      kind: 'try_yourself',
      problem:
        'A long drought and a series of floods ruin harvests across a Chinese dynasty\'s territory, and rebellions break out. Under the logic of the Mandate of Heaven, how would people at the time most likely interpret these events?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'As signs that Heaven was withdrawing the mandate from the ruling dynasty', correct: true },
        { id: 'b', text: 'As proof that the Mandate of Heaven had been permanently abolished' },
        { id: 'c', text: 'As evidence that the ruler had inherited the throne illegally from his father' },
        { id: 'd', text: 'As punishment sent by Heaven for the rebels who dared to revolt' },
      ],
      expectedAnswer: 'As signs that Heaven was withdrawing the mandate from the ruling dynasty',
      hints: [
        'The mandate is judged by outcomes on the ground — ask who gets blamed when the harvests fail.',
        'Disaster plus disorder was read as Heaven\'s verdict on the RULER, which is exactly what made the doctrine a constraint on him.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-aryan-invasion',
      kind: 'misconception_check',
      question:
        'A student says: "The Indus Valley civilization fell because Aryan invaders swept in and destroyed Harappa and Mohenjo-Daro." What needs correcting?',
      commonErrors: [
        {
          answer: 'Aryan invaders destroyed the Indus cities',
          misconception: 'Treating a gradual, largely environmental decline as a single violent conquest — an outdated explanation that also collapses migration into invasion and gets the sequence backward.',
          correctsTo:
            'The Indus cities were being abandoned from around 1900 BCE, BEFORE the main Indo-Aryan migrations after about 1500 BCE, and excavation has not produced the destruction layers or mass battle casualties a conquest would leave. The leading explanations are environmental: rivers shifting or drying and a weakening monsoon, which undercut farming and trade. Indo-Aryan speakers then MIGRATED in over generations, bringing Sanskrit and the Vedas and blending with existing populations — succession in time, not a smoking ruin.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Indus (c. 2600–1900 BCE, Harappa and Mohenjo-Daro) built grid-planned cities with standardized bricks, weights, and covered drains; its script is undeciphered, so its history is read from artifacts rather than kings.',
        'The Indus decline was gradual and probably environmental — shifting or drying rivers and a weakening monsoon — not an Aryan invasion; Indo-Aryan migration came later, after about 1500 BCE, bringing Sanskrit and the Vedas.',
        'Along the Huang He, the Shang (c. 1600–1046 BCE) left ritual bronzes and oracle bones — the earliest known Chinese writing, ancestral to characters used today.',
        'The Zhou overthrew the Shang in 1046 BCE and justified it with the Mandate of Heaven: Heaven grants rule to the just and withdraws it from the unjust — a claim that legitimizes rebellion and constrains every ruler, producing the dynastic cycle.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Early India & China: The Indus Valley to the Zhou' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
