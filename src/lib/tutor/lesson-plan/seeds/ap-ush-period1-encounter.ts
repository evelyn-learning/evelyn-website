/**
 * APUSH Period 1 — Pre-Columbian to 1607.
 *
 * Native societies, European arrival, Spanish empire, Columbian Exchange.
 * ~5% of exam but DBQ + LEQ source for hemispheric framing.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_USH_PERIOD1_ENCOUNTER: LessonPlan = {
  id: 'evelyn.ap.ush.period1-encounter.v1',
  title: 'APUSH Period 1 — Native Societies, Encounter, Spanish Empire (to 1607)',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.period1-encounter',
      description: 'Describe diverse pre-Columbian Native American societies, the impacts of European contact + the Columbian Exchange on populations and economies, and the structure of Spanish colonization including encomienda + the casta system.',
      standard: 'APUSH-1.1-1.7',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Period 1 sets up everything that follows.',
      script: 'APUSH Period 1 is short on the exam — about 5% — but it\'s the FOUNDATION for understanding why the Americas developed differently from Europe. Native American diversity, European motives for expansion, and the catastrophic biological consequences of contact all set the stage for colonial America. The themes here — race, labor, environmental adaptation, and intercultural exchange — recur in every later period.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pre-columbian',
      kind: 'concept',
      goal: 'Diverse Native societies before 1492.',
      keyIdeas: [
        'POPULATION ESTIMATES: ~50-100 million in the Americas pre-1492; ~5-7 million in what is now the United States. NOT a "wilderness" — densely populated in many regions.',
        'NORTHEAST WOODLANDS: Algonquian-speaking groups (Wampanoag, Lenape, Powhatan), Iroquois Confederacy (Haudenosaunee — Mohawk, Oneida, Onondaga, Cayuga, Seneca; later Tuscarora). Iroquois practiced matrilineal descent, women selected sachems. Confederacy = collective governance model that influenced Franklin/Adams thinking on federalism.',
        'SOUTHEAST: Mississippian culture (~800-1600 CE) — mound-building cities like Cahokia (peak ~20,000 people, larger than London at the time). Cherokee, Creek, Choctaw, Chickasaw, Seminole inherited the region.',
        'SOUTHWEST: Pueblo peoples (Hopi, Zuni, Acoma) — multistory adobe architecture; irrigated maize agriculture; matrilineal in some groups. Anasazi (Ancestral Puebloans) at Mesa Verde + Chaco Canyon, abandoned ~1300 likely from drought.',
        'GREAT PLAINS: pre-horse, more sedentary villages along rivers (Mandan, Hidatsa). Horse adoption (post-1680 Pueblo Revolt) transformed Plains culture into nomadic buffalo hunters.',
        'GREAT BASIN + CALIFORNIA: small bands, hunter-gatherer, very diverse languages.',
        'PACIFIC NORTHWEST: rich resource environment supporting permanent villages without agriculture. Tlingit, Haida, Salish — totem poles, potlatch ceremonies.',
        'MESOAMERICA: Aztec Empire (~1428-1521, capital Tenochtitlán pop. ~200,000) — tribute-state structure, human sacrifice in religious practice. Maya city-states (Yucatán) had collapsed politically by 1500 but populations remained.',
        'ANDES: Inca Empire (~1438-1533, capital Cuzco) — quipu record-keeping, mit\'a labor system, terraced agriculture, road network ~25,000 miles.',
        'AGRICULTURAL FOUNDATIONS: maize (corn), beans, squash ("Three Sisters") supported population growth across Americas. Potato + quinoa + tomato + chili pepper from Andes.',
      ],
      vocabulary: [
        { term: 'Three Sisters', definition: 'maize, beans, squash — companion crops grown together by Native American agricultural societies; provided complete protein nutrition.' },
        { term: 'Iroquois Confederacy', definition: 'alliance of 5 (later 6) Haudenosaunee nations governed by a Great Law of Peace; cited as influence on US federal structure.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-encounter-columbian-exchange',
      kind: 'concept',
      goal: 'European arrival + Columbian Exchange + Spanish empire.',
      keyIdeas: [
        'EUROPEAN MOTIVES: gold/glory/God, trade routes around Ottoman/Italian intermediaries, Reformation-driven missionary impulse. Reconquista (Spain finished 1492) freed military energy for overseas expansion.',
        'COLUMBUS (1492): sponsored by Spain (Ferdinand + Isabella). Sailed for Asia; landed in Bahamas. Four voyages total. Underestimated Earth\'s size, never realized he\'d found a new continent.',
        'TREATY OF TORDESILLAS (1494): Pope-mediated split of non-European world between Spain (Americas + Pacific) and Portugal (Brazil + Africa + India + Spice Islands).',
        'SPANISH CONQUEST: Cortés conquered Aztecs (1519-1521) with ~600 men + Indigenous allies (Tlaxcalans hated Aztecs) + smallpox devastating Tenochtitlán. Pizarro conquered Inca (1531-1533) similarly.',
        'COLUMBIAN EXCHANGE: post-1492 transfer of plants, animals, microbes, people. TO AMERICAS: horses, cattle, pigs, wheat, sugarcane; DEVASTATING DISEASES (smallpox, measles, influenza, typhus). TO EUROPE/AFRICA/ASIA: maize, potato, tomato, cacao, tobacco, syphilis.',
        'DEMOGRAPHIC CATASTROPHE: Native American population declined 50-90% in century after 1492 — primarily from disease. Some regions essentially emptied; resistance possible only by survivors.',
        'ENCOMIENDA: Spanish system granting conquerors rights to extract LABOR and TRIBUTE from Indigenous communities. Brutal in early Caribbean (collapsed Taíno population). Bartolomé de las Casas\' "Brief Account of the Devastation of the Indies" (1542) condemned encomienda; led to NEW LAWS (1542) limiting it (poorly enforced).',
        'CASTA SYSTEM: Spanish-American racial hierarchy. PENINSULARES (Spain-born) > CRIOLLOS (Spanish-descended American-born) > MESTIZOS (Spanish-Indigenous) > MULATTOS (Spanish-African) > INDIGENOUS > ENSLAVED AFRICANS. Casta paintings depicted these mixings — unique colonial racial schema, distinct from later British North American "one-drop" rule.',
        'FRENCH + DUTCH ARRIVAL: French in St. Lawrence (Cartier 1534, Quebec 1608) — fur trade, alliances with Native nations, less settlement-heavy. Dutch in New Netherland (Hudson 1609, New Amsterdam 1625) — commercial focus.',
        'EARLY ENGLISH FAILURES: Roanoke (1587, "lost colony"), Jamestown (1607 — barely survived starving time, but persisted, marking start of English permanent presence and APUSH Period 2).',
      ],
      vocabulary: [
        { term: 'Columbian Exchange', definition: 'global biological transfer of plants, animals, microbes, and people between the Americas and Afro-Eurasia after 1492.' },
        { term: 'encomienda', definition: 'Spanish colonial grant entitling encomendero to extract labor and tribute from Indigenous communities; precursor to plantation slavery.' },
        { term: 'casta system', definition: 'Spanish American racial-classification hierarchy based on European, Indigenous, and African ancestry mixing.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How did the Columbian Exchange affect global population in BOTH the Americas and Afro-Eurasia in the centuries after 1492?',
      expectedAnswer: 'OPPOSITE effects. AMERICAS: population CRASHED 50-90% within a century from epidemic disease (smallpox, measles, etc.) — Native peoples had no prior immunity. AFRO-EURASIA: population GREW substantially due to introduction of New World CROPS — especially the POTATO (Europe, esp. Ireland + Eastern Europe) and MAIZE/SWEET POTATO (China). These crops grew in marginal soils and added calories per acre, supporting demographic expansion. China\'s population doubled 1500-1750 partly thanks to maize on hilly land. So the same exchange devastated one hemisphere demographically while enabling growth in the other.',
      responseFormat: 'free',
      hints: [
        'Diseases moved one way; crops moved both ways.',
        'Diseases caused decline; crops enabled growth.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-pristine-wilderness',
      kind: 'misconception_check',
      question: 'Pre-1492 North America was a sparsely-populated wilderness; the land was largely empty when Europeans arrived. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Confusing "empty" landscape Europeans encountered with pre-disease conditions.',
          correctsTo: 'False. Pre-1492 North America was DENSELY INHABITED — population estimates range from 5 to 18+ million people in what is now the US, plus tens of millions more in Mesoamerica + South America. Cahokia alone had ~20,000 residents (larger than London at the time). What Europeans encountered AFTER ~1500 looked sparser because epidemic diseases had already swept through, often AHEAD of European settlers themselves (carried by trade contacts). Plymouth was settled in 1620 on the site of an abandoned Wampanoag village whose inhabitants had died in a 1616-1619 epidemic. The "empty wilderness" image is an artifact of the demographic catastrophe, not the original population. APUSH explicitly tests this — the "myth of the pristine wilderness" is corrected directly in the College Board framework.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pre-1492 Americas: ~50-100M people; diverse societies (Iroquois, Mississippian, Pueblo, Aztec, Inca).',
        'Three Sisters (corn/beans/squash) anchored Native agriculture.',
        'Columbus 1492; Treaty of Tordesillas 1494 split world Spain/Portugal.',
        'Columbian Exchange: diseases devastated Americas (50-90% decline); New World crops grew Eurasian population.',
        'Spanish: encomienda, casta system, Cortés/Pizarro conquests. French/Dutch trade-focused.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did Spanish colonization produce the casta system while later British North America moved toward a binary "Black/white" racial schema?',
      hint: 'Spanish colonization (1500s+) involved relatively few European women emigrating; Spanish men frequently formed unions (forced or otherwise) with Indigenous and African women, producing large mixed-race populations. The casta system catalogued and ranked these mixings — a recognition that mixed-ancestry was the demographic majority in many regions. British North America (1600s+) saw FAMILIES emigrate together, producing demographically distinct European populations. As slavery hardened in the 17th-century Chesapeake (Bacon\'s Rebellion 1676 + 1705 Virginia slave codes), legal and social rules built a STRICT BINARY treating any African ancestry as "Black" — the eventual "one-drop rule." So the demographic facts shaped the legal framework, which shaped subsequent racial ideology. APUSH compares these schemas in DBQs about colonial race-formation.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
