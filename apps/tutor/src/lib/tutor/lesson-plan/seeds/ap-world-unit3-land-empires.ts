/**
 * AP World History — Unit 3: Land-Based Empires (1450-1750).
 *
 * Ottoman, Safavid, Mughal, Ming/Qing, Russian, Spanish "gunpowder empires."
 * Comparative governance, religious legitimation, decline patterns.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_WORLD_UNIT3_LAND_EMPIRES: LessonPlan = {
  id: 'evelyn.ap.world.unit3-land-empires.v1',
  title: 'AP World — Unit 3: Land-Based Empires 1450-1750',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.unit3-land-empires',
      description: 'Compare the formation, governance, religious legitimation, and decline of land-based empires (Ottoman, Safavid, Mughal, Ming/Qing, Russian) in 1450-1750.',
      standard: 'AP-WORLD-3.1-3.5',
    },
  ],
  prerequisites: ['apworld.unit2-networks'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why these empires matter for AP comparisons.',
      script: 'Between 1450 and 1750, a series of large land-based empires reshaped Eurasia using gunpowder weapons, centralized bureaucracies, and religious legitimation. AP loves comparison among them — the Ottoman, Safavid, Mughal, and Manchu Qing empires share strategic patterns but differ in critical ways. Once you can put them side-by-side on governance and religion, you can write CCOT and comparison essays without re-thinking.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-islamic-empires',
      kind: 'concept',
      goal: 'Three Islamic gunpowder empires.',
      keyIdeas: [
        'OTTOMAN EMPIRE (~1299-1922): SUNNI Islam. Capital Constantinople (taken 1453, renamed Istanbul). Peak under Suleiman the Magnificent (r. 1520-1566).',
        'OTTOMAN GOVERNANCE: SULTAN as supreme. DEVSHIRME system: Christian boys from Balkans converted to Islam, trained as JANISSARIES (elite infantry) or palace administrators. MILLET system: religious minorities (Jews, Christians) self-governed under their own law and paid jizya tax.',
        'OTTOMAN ARCHITECTURE: Mimar Sinan\'s mosques (Süleymaniye, Selimiye) — domes inspired by Hagia Sophia.',
        'SAFAVID EMPIRE (1501-1736, Iran): SHIA Islam (Twelver), declared by founder Shah Ismail. Made Iran a Shia bastion against Sunni Ottoman + Sunni Mughal neighbors — long-running tension.',
        'SAFAVID GOVERNANCE: Shah claimed religious authority, blending Shia leadership with kingship. Capital Isfahan under Shah Abbas (r. 1588-1629) — "Half the World" architecture.',
        'MUGHAL EMPIRE (1526-1857, Indian subcontinent): Founded by Babur (Timurid descendant). SUNNI Muslim ruling class over majority HINDU population.',
        'AKBAR THE GREAT (r. 1556-1605): pragmatic religious tolerance — abolished JIZYA tax on non-Muslims, attempted syncretic Din-i Ilahi religion, allowed Hindu nobles into top administration. Set tone of Mughal accommodation.',
        'AURANGZEB (r. 1658-1707): reversed Akbar\'s tolerance — reimposed jizya, persecuted Hindus and Sikhs, expanded empire militarily but financially overextended. Set up Mughal decline.',
        'MUGHAL ARCHITECTURE: Taj Mahal (Shah Jahan, 1632-1653) for wife Mumtaz Mahal. Persian-Indian fusion.',
        'GUNPOWDER ROLE: cannons and muskets gave centralizing rulers an edge over feudal cavalry. Term "gunpowder empires" coined by Hodgson; AP uses it.',
      ],
      vocabulary: [
        { term: 'devshirme', definition: 'Ottoman system of recruiting Christian boys from conquered territories, converting them, and training them as Janissaries or administrators.' },
        { term: 'millet system', definition: 'Ottoman framework allowing religious minorities to self-govern internal affairs under their own laws while paying jizya.' },
        { term: 'jizya', definition: 'tax on non-Muslims in Islamic empires; Akbar abolished it for Mughals (tolerance), Aurangzeb reimposed it (intolerance).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-east-asia-russia',
      kind: 'concept',
      goal: 'Ming/Qing China + Romanov Russia.',
      keyIdeas: [
        'MING DYNASTY (1368-1644): expelled Mongol Yuan; restored Han Chinese rule. Capital Beijing (later); Forbidden City built.',
        'EARLY MING: ZHENG HE\'s naval voyages (1405-1433) — massive treasure fleet to Southeast Asia, India, East Africa. Demonstrated Chinese capability but ABANDONED post-1433 due to court politics + cost.',
        'MING DECLINE: corrupt eunuch politics, fiscal stress, peasant rebellions. Manchus invaded from northeast.',
        'QING DYNASTY (1644-1912): Manchus (foreign rulers from Manchuria) ruled Han Chinese majority. Maintained ethnic separation (queue hairstyle imposed on Han men), but adopted Confucian civil-service exam system + Chinese bureaucracy.',
        'QING PEAK: Kangxi (r. 1661-1722) and Qianlong (r. 1735-1796). Empire largest ever; tributary system extended.',
        'TRIBUTARY SYSTEM: foreign envoys performed kowtow to Chinese emperor, brought "tribute" (in practice: trade); Chinese view = world order with China at center.',
        'CANTON SYSTEM: by 1757 Qing limited European trade to Canton (Guangzhou) under tightly regulated cohong merchant guild.',
        'RUSSIA — EXPANSION: Ivan III "the Great" (r. 1462-1505) ended Mongol overlordship. Ivan IV "the Terrible" (r. 1547-1584) first to title himself TSAR; expanded eastward into Siberia.',
        'ROMANOV DYNASTY (1613-1917): began after "Time of Troubles."',
        'PETER THE GREAT (r. 1682-1725): WESTERNIZATION program — military reform on European model, founded St. Petersburg as "window to the West," shaved boyars\' beards literally. Expanded to Baltic via Great Northern War.',
        'CATHERINE THE GREAT (r. 1762-1796): expanded south to Black Sea (against Ottomans) and west via partitions of Poland. Enlightened-despot reputation but tightened serfdom.',
        'SERFDOM: Russian peasants legally bound to land into 19th century — long after Western Europe abandoned it.',
      ],
      vocabulary: [
        { term: 'tributary system', definition: 'Chinese diplomatic order: foreign rulers acknowledged Chinese supremacy via kowtow + tribute, in exchange got trade access.' },
        { term: 'tsar', definition: 'Russian title meaning "caesar" — first claimed by Ivan IV, asserting equality with Byzantine + Mongol successor authority.' },
        { term: 'serfdom', definition: 'system binding peasants to specific land + lord; persisted in Russia until 1861, long after Western Europe.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-comparison',
      kind: 'worked_example',
      problem: 'AP-style: How did Akbar (Mughal) and Suleiman the Magnificent (Ottoman) each justify their rule and manage religious diversity?',
      steps: [
        'AKBAR: Mughal SUNNI ruler over majority Hindu population. Strategy = TOLERANCE. Abolished jizya, married Hindu princesses, included Hindu Rajputs in administration, attempted Din-i Ilahi religious synthesis. Justified rule via personal charisma + Persian/Mughal court culture.',
        'SULEIMAN: Ottoman SUNNI ruler over diverse empire (Christians, Jews, other Muslims). Strategy = STRUCTURED PLURALISM via millet system + devshirme. Religious minorities self-governed but paid jizya; capable Christian boys could rise to highest admin roles after conversion.',
        'COMPARISON: Both used pragmatic accommodation rather than forced conversion. Both used religion (Islam) as legitimation while incorporating non-Muslim subjects. DIFFERENCE: Akbar more PERSONAL and EXPERIMENTAL (Din-i Ilahi); Suleiman more STRUCTURAL via institutions like millet.',
        'GRADER LOOKS FOR: a clear comparison statement, evidence from BOTH cases, NOT just describing each separately.',
      ],
      answer: 'Both pragmatic Sunni rulers accommodated non-Muslims; Akbar via personal experiments (abolished jizya, syncretic religion), Suleiman via institutional structures (millet system, devshirme).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did the Qing dynasty MAINTAIN Confucian civil-service examinations and Chinese bureaucratic forms despite being foreign Manchu rulers?',
      expectedAnswer: 'Pragmatic legitimation. The Qing were a small ethnic minority (Manchus) ruling 250+ million Han Chinese. Outright cultural displacement would have provoked massive rebellion. By preserving the civil-service exam system, Confucian rituals, and existing bureaucracy, the Qing co-opted the existing scholarly elite (who depended on the exam path), claimed continuity with the Mandate of Heaven, and signaled they would govern by traditional Chinese norms. Ethnic separation was maintained at the top (Manchu-only positions, queue hairstyle) but Chinese institutions ran administration. This dual-track approach kept the empire stable for 250+ years.',
      responseFormat: 'free',
      hints: [
        'Manchu rulers were a small ethnic minority over a vast Han population.',
        'Co-opting existing institutions = stability without remaking the country.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-westernization-russia',
      kind: 'misconception_check',
      question: 'Peter the Great\'s westernization fully transformed Russia into a Western European-style society. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating top-down reform as deeply transformative.',
          correctsTo: 'False. Peter\'s westernization was largely SUPERFICIAL and ELITE-FOCUSED. He modernized the military, founded St. Petersburg, imported European architects + tutors, and forced nobles to adopt Western dress and shaved chins. But the SERF-BASED ECONOMY and the OVERWHELMING peasant majority remained unchanged. In fact, Peter EXPANDED serfdom by tying state-industrial workers to factories. By the 19th century, this gap (cosmopolitan elite + medieval peasantry) generated revolutionary tension. AP often tests this — westernization happened at court, not in the countryside.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three Islamic gunpowder empires: Ottoman (Sunni, devshirme/millet), Safavid (Shia, Iran), Mughal (Sunni-over-Hindu, Akbar tolerance vs Aurangzeb intolerance).',
        'Ming/Qing: Confucian + tributary system; Qing Manchus preserved Chinese institutions.',
        'Zheng He naval voyages 1405-1433, then abandoned. Canton system limited European trade by 1757.',
        'Russia: Ivan IV first tsar, Romanovs from 1613. Peter\'s westernization was elite-focused; serfdom persisted.',
        'AP comparison points: religious legitimation, treatment of minorities, role of bureaucracy, gunpowder advantage.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did the Ming abandon Zheng He\'s voyages and turn inward, while Western European states sent their own naval expeditions in the same era?',
      hint: 'Several factors: (1) Confucian ideology saw foreign trade as morally low and dangerous; the Mandarin bureaucracy preferred agrarian focus. (2) Mongol resurgence on the northern frontier demanded military spending elsewhere — court reallocated funds. (3) Eunuch faction associated with Zheng He lost political battles to anti-eunuch Confucian officials. (4) Voyages were enormously expensive without producing tax revenue (China didn\'t need foreign goods at scale; tributary system already brought goods in). Western European states by contrast were small, fragmented, RESOURCE-POOR, COMPETITIVE with each other, and saw oceanic trade as a path AROUND Ottoman + Italian intermediaries to Asian luxuries. The same maritime capability had opposite political incentives. AP comparisons often probe this divergence.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
