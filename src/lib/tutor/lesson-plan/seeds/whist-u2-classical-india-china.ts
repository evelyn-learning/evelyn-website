/**
 * World History — Classical Empires: Maurya & Gupta India, Qin & Han China.
 *
 * The other two classical superpowers. Students meet the empires that gave
 * the world the numerals it still types, the idea of hiring officials by
 * examination, the Silk Road, paper — and the same fragmentation story Rome
 * just taught them. C3 D2.His.2.9-12, D2.His.14.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U2_CLASSICAL_INDIA_CHINA: LessonPlan = {
  id: 'evelyn.hs.whist.classical-india-china.v1',
  title: 'Classical India & China: Maurya, Gupta & Han',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.classical-india-china',
      standard: 'WHIST-2.3',
      description:
        "Explain how the Maurya, Gupta, Qin, and Han empires unified and governed vast territory, analyze the causes and consequences of Ashoka's turn to Buddhism and of Han Confucian bureaucracy, and compare how Rome, Han China, and Gupta India each held — and then lost — control of their lands (C3 D2.His.2.9-12, D2.His.14.9-12).",
    },
  ],
  prerequisites: ['whist.rome-republic-empire'],
  followUps: ['whist.world-belief-systems'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame classical India and China as the other two superpowers of the ancient world — whose inventions students use daily.',
      script:
        'Type any number on your phone: 2, 0, 7. Those digits, and the strange idea that a circle can mean "nothing, but in this column," were worked out by mathematicians in India during the Gupta period, carried west by Arab and Persian scholars, and finally adopted in Europe about a thousand years later. In the same stretch of centuries, an Indian emperor who had just killed a hundred thousand people in a single war turned to Buddhism and pushed it across Asia, and a Chinese dynasty decided to hire its officials by written examination instead of by birth — an idea Britain would not copy until the 1800s. Rome was not the only classical superpower, and it was not the biggest. Today you meet the other two, and you find out why all three came apart within a few centuries of each other.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-india-china',
      kind: 'concept',
      goal: 'The Maurya and Gupta empires, caste as social structure, the Qin-to-Han turn in China, and the shared pattern of holding — then losing — vast territory.',
      keyIdeas: [
        'MAURYA UNIFIED INDIA FIRST — Chandragupta Maurya seized power around 321 BCE and built the first empire to cover most of the Indian subcontinent, ruled from Pataliputra with a standing army, a network of informants, and a famous manual of hard-nosed statecraft, the Arthashastra, attributed to his adviser Kautilya.',
        'ASHOKA CONVERTED AFTER THE KILLING, NOT BEFORE — his grandson Ashoka (ruled roughly 268–232 BCE) conquered Kalinga about 261 BCE at horrific cost, then embraced Buddhism. He had moral instructions carved as rock and pillar edicts in local languages across the empire, built wells and rest houses, and sent missionaries as far as Sri Lanka — turning a regional teaching into a religion that would reach Southeast and East Asia. COMMON CONFUSION: the war came first; the conversion was its consequence, not its motive.',
        'GUPTA GOLDEN AGE, LOOSER GRIP — the Gupta empire (roughly 320–550 CE) ruled far more indirectly than the Maurya, often leaving defeated kings in place as tribute-paying allies. Its cultural output was extraordinary: zero used as a number, the decimal place-value system, Aryabhata\'s astronomy and mathematics (around 499 CE), the Sanskrit plays and poetry of Kalidasa, advances in medicine and metallurgy. COMMON CONFUSION: the "Arabic numerals" you write are Indian in origin — Arab and Persian scholars transmitted them, they did not invent them.',
        'CASTE HELD SOCIETY WHEN THE STATE DID NOT — the varna scheme (Brahmin priests, Kshatriya warriors and rulers, Vaishya merchants and farmers, Shudra laborers), subdivided into thousands of local jati groups, governed work, marriage, and ritual. It gave Indian society continuity that outlasted every dynasty — and it was hereditary, restricted mobility, and placed some groups outside the system entirely. COMMON CONFUSION: no emperor invented caste; it took shape centuries earlier, in the Vedic era.',
        'QIN UNIFIED BY FORCE, THEN BURNED OUT — Shi Huangdi ended the Warring States and unified China in 221 BCE using Legalism: strict uniform law, heavy punishment, no tolerance for rival ideas. He standardized writing, weights, measures, currency, and even cart axle widths, linked older frontier walls into a northern defense line, and conscripted enormous labor armies. The dynasty collapsed within about fifteen years of his death, by 206 BCE. COMMON CONFUSION: the brick Great Wall in photographs is mostly Ming-era work from the 1400s and 1500s, not Qin.',
        'HAN KEPT THE MACHINE AND CHANGED THE JUSTIFICATION — the Han (206 BCE–220 CE) inherited Qin\'s centralized administration but wrapped it in Confucian ethics. Emperor Wudi founded an imperial university in 124 BCE; officials were increasingly selected by written examination on the Confucian classics, creating a salaried bureaucracy of merit in principle. Legitimacy rested on the Mandate of Heaven. COMMON CONFUSION: the examinations were not open opportunity for everyone — years of study required wealth and leisure most families never had.',
        'THE SILK ROAD AND PAPER — after Zhang Qian\'s missions west (roughly 138–126 BCE), Han China anchored the eastern end of the Silk Road. It was never one road and never only silk: it moved horses, glass, spices, ideas — Buddhism traveled into China along it — and disease. Paper, credited to Cai Lun around 105 CE, made records cheap and a paperwork empire possible.',
        'THREE EMPIRES, THREE KINDS OF GLUE, ONE PATTERN OF COLLAPSE — Rome held territory with roads, a common law code, and extended citizenship; Han China with bureaucracy, examinations, and Confucian ideology; Gupta India with allied tributary kings and a shared religious and caste-ordered social order. All three fragmented under a similar mix: frontier pressure (steppe peoples on China\'s north, Germanic migrations into Rome, Huna invasions into India), crushing military costs, factional infighting at court, and epidemics moving along the very trade routes that had enriched them. Han 220 CE, western Rome 476 CE, Gupta about 550 CE.',
      ],
      vocabulary: [
        { term: 'Legalism', definition: "the Qin governing philosophy: human nature is selfish, so order comes from uniform harsh law and strong central control — not from rulers' virtue." },
        { term: 'Mandate of Heaven', definition: 'the Chinese idea that heaven grants the right to rule to a just dynasty and withdraws it from a corrupt one — rebellion succeeding was read as proof the mandate had passed.' },
        { term: 'varna / jati', definition: "India's four broad social ranks and the thousands of local birth-groups within them that regulated occupation, marriage, and ritual." },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-holding-empires',
      kind: 'worked_example',
      problem:
        'Rome, Han China, and Gupta India each governed millions of people spread across enormous distances with no fast communication. Compare what held each one together — and then explain what all three had in common when they came apart.',
      steps: [
        'Start with Rome, the case you already know: the glue was physical and legal — tens of thousands of miles of paved road, permanent legions, a written law code applied across provinces, and citizenship extended to conquered elites so they gained a stake in the system.',
        'Now Han China: the glue was administrative and ideological — a salaried bureaucracy of appointed officials reaching down to the county level, recruited increasingly by written examination on the Confucian classics, and legitimized by the Mandate of Heaven, which told subjects the emperor ruled by moral right.',
        'Now Gupta India: the glue was the loosest — rather than replacing defeated kings, the Guptas often left them ruling as tribute-paying allies, while shared Hindu practice, Sanskrit learning, and caste-ordered village life supplied the everyday social order the state did not have to enforce.',
        'Weigh the trade-off: tight control (Rome, Han) buys real command but demands heavy taxation and a huge standing army; loose control (Gupta) is cheap and culturally durable but leaves the empire only as strong as its least loyal vassal.',
        'Now line up the endings: Han China breaks into warlord states in 220 CE, the western Roman Empire into Germanic kingdoms in 476 CE, Gupta India into regional kingdoms around 550 CE. Each faced sustained frontier pressure, unaffordable military costs, poisonous factional politics at the center, and deadly epidemics carried along its own trade routes.',
        'Close the comparison: three different kinds of glue, dissolved by much the same set of solvents — which is why historians treat this as a pattern of classical empire, not three unrelated accidents.',
      ],
      answer:
        'Rome held territory through roads, law, and citizenship; Han China through bureaucracy, examinations, and Confucian ideology; Gupta India through tributary allies and shared religious and social order — and all three fragmented under frontier pressure, military overspending, elite infighting, and epidemic disease.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ashoka-edict',
      kind: 'worked_example',
      problem:
        'Ashoka had messages carved on rocks and pillars throughout his empire. One of them says, in paraphrase: "After Kalinga was taken, a hundred thousand people were killed there, many times that number died afterward, and a hundred fifty thousand were carried away. This causes me deep sorrow and regret, and from now on I will seek victory through right conduct rather than through arms." What can a historian reasonably conclude from this inscription, and what should they be careful about?',
      steps: [
        'Identify the source type first: this is an official inscription commissioned by the ruler himself and placed in public in local languages so ordinary subjects could hear it read aloud. It is a government message, not a private confession.',
        'Read what it plainly claims: a specific war (Kalinga, about 261 BCE), casualty numbers supplied by the victor, and a publicly announced change of policy from conquest by arms to conquest by moral teaching.',
        'Draw the sound conclusion: Ashoka tied his rule to Buddhist moral ideals and used the machinery of empire — carved edicts, royal officials, missionaries sent as far as Sri Lanka — to spread them. Buddhism\'s move from a regional teaching to a religion spanning Asia begins here.',
        'Now apply the caution: this is the ruler\'s own account of himself. He never returned Kalinga and he did not disband his army. Genuine remorse and political calculation can both be true at once — a reputation for justice makes an enormous conquered empire cheaper to govern.',
        'Corroborate before trusting: check the edicts against archaeology (pillar and rock sites scattered across the subcontinent), against Buddhist textual tradition, and against what actually happened next — the Maurya empire fragmented within about fifty years of Ashoka\'s death in 232 BCE, so moral persuasion did not by itself solve the problem of holding it together.',
      ],
      answer:
        'The inscription is strong evidence that Ashoka publicly adopted Buddhist principles after Kalinga and used state power to spread them — but because it is his own official message, a historian reads the remorse as both sincere and self-presenting, and corroborates it with archaeology and later events.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-ashoka-kalinga',
      kind: 'try_yourself',
      problem:
        'Ashoka fought the war for Kalinga around 261 BCE. Which statement correctly describes the relationship between that war and his promotion of Buddhism?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The slaughter at Kalinga came first; Ashoka embraced Buddhism afterward and used edicts and missionaries to spread it', correct: true },
        { id: 'b', text: 'Ashoka was already a devout Buddhist and invaded Kalinga specifically in order to convert its people' },
        { id: 'c', text: 'Chandragupta Maurya fought the Kalinga war, and Ashoka merely recorded his grandfather\'s decision' },
        { id: 'd', text: 'The war took place during the Gupta golden age, long after Buddhism had already spread across Asia' },
      ],
      expectedAnswer: 'The slaughter at Kalinga came first; Ashoka embraced Buddhism afterward and used edicts and missionaries to spread it',
      hints: [
        'Put the two events on a timeline: which one does the emperor say caused his sorrow?',
        'His own inscriptions describe regret over the killing and a decision, made after it, to rule by moral teaching instead of conquest.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-qin-han',
      kind: 'try_yourself',
      problem: 'Which statement correctly matches a Chinese dynasty to something it actually did?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Qin standardized writing, weights, measures, and cart axle widths and linked older frontier walls into a northern defense line', correct: true },
        { id: 'b', text: 'The Han governed by Legalism and burned books to silence rival schools of thought' },
        { id: 'c', text: 'The Qin ruled China for more than four centuries by selecting officials through examinations on the Confucian classics' },
        { id: 'd', text: 'The Han built the brick Great Wall that tourists photograph today' },
      ],
      expectedAnswer: 'The Qin standardized writing, weights, measures, and cart axle widths and linked older frontier walls into a northern defense line',
      hints: [
        'One of these dynasties lasted about fifteen years and the other about four centuries — sort by length before you sort by achievement.',
        'Qin: unify and standardize by force. Han: keep the centralized machinery but justify it with Confucian ethics and staff it by examination. And the wall in the photographs is Ming-era brickwork from the 1400s and 1500s.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rome-han-comparison',
      kind: 'try_yourself',
      problem:
        'Han China and imperial Rome both governed vast territory, but they leaned on different tools to do it. Which comparison is accurate?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Rome leaned on roads, a common law code, and extending citizenship; Han China leaned on a salaried bureaucracy recruited partly by examination and legitimized by Confucian ideology', correct: true },
        { id: 'b', text: 'Rome selected its provincial governors by written examination on classical texts, while Han officials simply purchased their posts' },
        { id: 'c', text: 'Neither empire had any central administration; both left conquered regions fully independent' },
        { id: 'd', text: 'Both empires held their territory mainly by granting land to hereditary knights in exchange for military service' },
      ],
      expectedAnswer: 'Rome leaned on roads, a common law code, and extending citizenship; Han China leaned on a salaried bureaucracy recruited partly by examination and legitimized by Confucian ideology',
      hints: [
        'Ask what each empire built the most of: Rome poured stone, Han China trained officials.',
        'Land granted to hereditary knights for service describes medieval Europe and Japan, centuries later — not classical Rome or Han China.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-numerals-and-collapse',
      kind: 'misconception_check',
      question:
        'A student says: "The Gupta era gets called a golden age, but the numerals and the zero were really an Arab invention — and anyway all three classical empires fell for one simple reason: barbarians invaded." What needs correcting?',
      commonErrors: [
        {
          answer: 'Zero and the decimal numerals were invented in Arabia',
          misconception: 'Taking the label "Arabic numerals" as a statement of origin rather than of the route by which Europe received them.',
          correctsTo:
            'The decimal place-value system and the use of zero as a number were developed in India, largely in the Gupta era, and appear in the work of mathematicians such as Aryabhata around 499 CE. Arab and Persian scholars adopted them and carried them west; Europeans, learning them from Arabic sources, named them after the transmitters rather than the inventors.',
        },
        {
          answer: 'All three empires fell because barbarians invaded',
          misconception: 'Collapsing a multi-cause process into one dramatic external event — the single-cause fallacy.',
          correctsTo:
            'Frontier pressure was real (steppe peoples on the Han frontier, Germanic migrations into Rome, Huna invasions into India), but each empire was already weakened from inside: unaffordable military and administrative costs, tax strain on farmers, deadly factional politics at court, and epidemic disease moving along its trade routes. Outside pressure finished off states that internal problems had already loosened.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Maurya: Chandragupta unified the subcontinent around 321 BCE; Ashoka conquered Kalinga about 261 BCE, then turned to Buddhism, carved his edicts in stone, and spread the religion across Asia.',
        'Gupta (roughly 320–550 CE): looser, allied rule plus a cultural golden age — zero and decimal place-value numerals, Aryabhata, Kalidasa\'s Sanskrit literature; caste supplied the social order that outlasted every dynasty.',
        'China: Qin unified in 221 BCE by Legalism and standardization and collapsed within about fifteen years; the Han kept that centralized machinery, justified it with Confucianism and the Mandate of Heaven, staffed it by examination, opened the Silk Road, and produced paper.',
        'Different glue, same solvents: Rome held on with roads, law, and citizenship, Han with bureaucracy and ideology, Gupta with tributary allies and shared culture — and all three fragmented under frontier pressure, military cost, court infighting, and epidemic disease (Han 220 CE, western Rome 476 CE, Gupta about 550 CE).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Classical India & China: Maurya, Gupta & Han' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
