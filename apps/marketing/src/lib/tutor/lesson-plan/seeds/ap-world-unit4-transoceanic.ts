/**
 * AP World History — Unit 4: Transoceanic Interconnections (1450-1750).
 *
 * Columbian Exchange, Atlantic slave trade, mercantilism, silver economy.
 * Heavily tested; recurring DBQ + LEQ source.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_WORLD_UNIT4_TRANSOCEANIC: LessonPlan = {
  id: 'evelyn.ap.world.unit4-transoceanic.v1',
  title: 'AP World — Unit 4: Columbian Exchange & Atlantic Slave Trade',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.unit4-transoceanic',
      description: 'Analyze the global biological and economic consequences of European maritime expansion (1450-1750), including the Columbian Exchange, Atlantic slave trade, silver/global trade circuits, and mercantilist policy.',
      standard: 'AP-WORLD-4.1-4.7',
    },
  ],
  prerequisites: ['apworld.unit3-land-empires'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The first global system was forged here — and it was brutal.',
      script: 'Unit 4 is when "world history" becomes truly GLOBAL. European voyages (1450 onward) connected the Americas, Africa, Europe, and Asia into a single interlocking system. The Columbian Exchange remade ecosystems on every continent; the Atlantic slave trade reshaped Africa\'s population and Africa\'s relationship with the rest of the world; silver from Potosí and Zacatecas flowed to China, financing Ming/Qing taxation. AP draws DBQs from this unit constantly — the documents almost write themselves once you know the patterns.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-columbian-exchange',
      kind: 'concept',
      goal: 'Columbian Exchange — biological, demographic, ecological.',
      keyIdeas: [
        'COLUMBIAN EXCHANGE: post-1492 transfer of plants, animals, microbes, and people between Afro-Eurasia and the Americas.',
        'TO THE AMERICAS: horses, cattle, pigs, sheep, chickens; wheat, rice, sugarcane, coffee, bananas; SMALLPOX, measles, influenza, typhus.',
        'TO AFRO-EURASIA: maize, potatoes, tomatoes, cassava, peppers, cacao, tobacco; turkey; SYPHILIS (likely; debated).',
        'DEMOGRAPHIC CATASTROPHE in Americas: indigenous populations collapsed by 50-90% within a century, primarily from EPIDEMIC DISEASE (no prior immunity to Old World pathogens). Aztec + Inca empires fell partly because diseases preceded conquistadors.',
        'POPULATION GROWTH in Afro-Eurasia: New World crops (esp. POTATO in Europe + MAIZE/SWEET POTATO in China) supported population booms. China population doubled 1500-1750 partly thanks to maize on hilly land unsuited to rice.',
        'CASH-CROP PLANTATIONS in Americas: SUGAR (Caribbean, Brazil), TOBACCO (Virginia, Maryland), COFFEE (Brazil, Saint-Domingue), COTTON (later, US South). Required massive labor → drove demand for African slaves.',
        'ENCOMIENDA + REPARTIMIENTO: Spanish systems extracting indigenous labor + tribute. Brutal in Caribbean (collapsed local populations) and central Mexico/Andes.',
        'CASTA SYSTEM: Spanish colonial racial hierarchy. PENINSULARES (Spanish-born) → CRIOLLOS (American-born of Spanish parents) → MESTIZOS (Spanish-Indigenous mix) → MULATTOS (Spanish-African) → INDIGENOUS → ENSLAVED AFRICANS at bottom. Casta paintings depicted these mixings.',
      ],
      vocabulary: [
        { term: 'Columbian Exchange', definition: 'global biological transfer post-1492 between Americas and Afro-Eurasia of crops, animals, microbes, and people.' },
        { term: 'encomienda', definition: 'Spanish colonial grant giving conquerors right to extract labor + tribute from indigenous communities; precursor to plantation slavery.' },
        { term: 'casta system', definition: 'Spanish American racial hierarchy classifying populations by ancestry; legitimized colonial inequality.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-slave-trade-silver',
      kind: 'concept',
      goal: 'Atlantic slave trade + silver/global trade.',
      keyIdeas: [
        'ATLANTIC SLAVE TRADE (1500s-1800s): roughly 12 million Africans forcibly transported to the Americas; ~2 million died in the MIDDLE PASSAGE (transatlantic crossing). Largest forced migration in human history.',
        'TRIANGULAR TRADE: simplified model. Europe → Africa (manufactured goods, guns); Africa → Americas (enslaved people); Americas → Europe (sugar, tobacco, raw materials). In reality more complex (multiple legs).',
        'IMPACT ON AFRICA: depopulation in some West African regions; centralization of slave-trading kingdoms (Asante, Dahomey, Oyo) that captured + sold neighbors; militarization with European firearms; demographic skew (more women remained because more men were exported); long-term economic distortion.',
        'IMPACT IN AMERICAS: African cultural retention in Afro-Caribbean and Brazilian religion (Candomblé, Vodou, Santería), music, language, food. Maroon communities (escaped slaves) in Jamaica, Suriname, Brazil.',
        'SILVER from POTOSÍ (Bolivia) + ZACATECAS (Mexico): mined by indigenous + African forced labor under MITA system (Inca corvée co-opted by Spanish). Massive volume — ~85% of world silver supply by 1600.',
        'SILVER FLOW: Spanish silver → Spain → paid for Asian luxury goods (especially Chinese silk + porcelain) via Manila Galleons (Acapulco-Manila route established 1565) and via European intermediaries. Silver ultimately flowed to CHINA.',
        'CHINA REQUIRED SILVER: Ming + Qing tax system was largely paid in silver (Single Whip system unified taxes into silver payment). Chinese demand kept global silver prices high.',
        'GLOBAL TRADE NETWORK by 1600: Manila Galleons + Atlantic + Indian Ocean = first truly worldwide circuit. World had never been more economically connected.',
      ],
      vocabulary: [
        { term: 'Middle Passage', definition: 'transatlantic leg of the triangular trade carrying enslaved Africans to the Americas; ~15% mortality.' },
        { term: 'Manila Galleon', definition: 'Spanish trade route (1565-1815) between Acapulco (Mexico) and Manila (Philippines) carrying silver west, Asian goods east.' },
        { term: 'mita', definition: 'Inca/Spanish forced-labor system requiring indigenous communities to provide rotating laborers, especially for Andean silver mines.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-mercantilism-state',
      kind: 'concept',
      goal: 'Mercantilism + joint-stock companies + state competition.',
      keyIdeas: [
        'MERCANTILISM: economic doctrine + policy. Wealth = limited (zero-sum). Goal: accumulate gold + silver bullion through favorable trade balance (export more than you import). State actively manages economy to that end.',
        'POLICY TOOLS: tariffs on imports, subsidies for domestic manufacturing, monopolies for chartered companies, prohibition of skilled emigration, establishment of colonies as captive markets + raw-material sources.',
        'COLBERT (France, Louis XIV finance minister): exemplar of mercantilism. Built French industries, royal navy, colonial expansion, infrastructure (canals, roads). Mercantile state-building.',
        'JOINT-STOCK COMPANIES: shareholders pooled capital + risk; chartered by state with monopoly rights. ENGLISH EAST INDIA COMPANY (1600), DUTCH EAST INDIA COMPANY/VOC (1602 — first publicly traded), Royal African Company (1672).',
        'VOC innovations: paid dividends, shares traded on Amsterdam exchange, governed Asian trade outposts militarily. By mid-1600s, VOC was world\'s most valuable company.',
        'ATLANTIC POWER SHIFTS: 1500s = SPAIN + PORTUGAL dominant (Treaty of Tordesillas 1494 split Americas + Africa/Asia). 1600s = DUTCH ascendant in trade. 1700s = BRITISH + FRENCH compete; British dominate by century\'s end (Treaty of Paris 1763 after Seven Years\' War).',
        'EUROPEAN STATES became more centralized + powerful through colonial revenues. Funded standing armies + navies → triggered absolute monarchies (Louis XIV France, Habsburg Spain, Romanov Russia).',
      ],
      vocabulary: [
        { term: 'mercantilism', definition: 'early-modern economic doctrine treating trade as zero-sum; state policy aimed at accumulating bullion via export surpluses + colonial extraction.' },
        { term: 'joint-stock company', definition: 'business entity pooling capital from multiple shareholders, limiting individual liability, often state-chartered with monopoly rights.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How did Chinese demand for silver shape the global economy of the 1500s-1600s?',
      expectedAnswer: 'Massive. Ming Single Whip reform (1581) consolidated Chinese taxes into silver payments — China became the world\'s biggest silver SINK. This artificially HIGH price for silver in China made it profitable for Spanish + Portuguese merchants to ship Bolivian/Mexican silver across the Pacific (Manila Galleons) and Indian Ocean to buy Chinese silks, porcelain, tea. Silver effectively created the first GLOBAL trade circuit. Spanish empire benefited because their American silver had a high-value market in China. When Chinese silver demand collapsed in the 1640s (Ming fall + bullion oversupply), it triggered a global economic crisis.',
      responseFormat: 'free',
      hints: [
        'Ming/Qing tax system → silver as tax currency → high Chinese silver demand.',
        'High Chinese price → flow of Spanish American silver westward AND eastward to China.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-slave-trade-europeans',
      kind: 'misconception_check',
      question: 'Europeans physically captured most enslaved Africans themselves through raids in interior Africa. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Picturing the slave trade as direct European raiding deep into the African interior.',
          correctsTo: 'False. Europeans rarely ventured far from coastal trading posts. Most enslaved people were CAPTURED BY OTHER AFRICANS — especially by African states like Asante, Dahomey, and Oyo — through warfare, raids, or judicial enslavement, then SOLD to European buyers at coastal forts (Elmina, Cape Coast, Whydah). European firearms supplied to coastal kingdoms intensified this — guns gave them advantage over interior neighbors, fueling more capture-and-sale. Recognizing African agency in the slave trade is central to AP\'s framing — without it the picture is missing the political-economy mechanism.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Columbian Exchange: smallpox + horses + sugar to Americas; potato + maize to Afro-Eurasia.',
        'American population collapse 50-90% from disease; Afro-Eurasian population grew on New World crops.',
        '~12M Africans transported in Atlantic slave trade; mostly captured by African states + sold at coast.',
        'Potosí silver → Manila Galleons → China (Ming/Qing tax demand).',
        'Mercantilism + joint-stock companies (VOC, EIC) drove early-modern European state-building.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the "great divergence" between European and Asian economies often dated to the period AFTER 1750 rather than during 1450-1750?',
      hint: 'In 1750, Asian economies (especially Qing China and Mughal India before fragmentation) were comparable or AHEAD of Europe in productivity, urbanization, technology, and total output. Per-capita Chinese living standards in Yangzi delta cities matched London. The divergence accelerated AFTER 1750 because of (1) European industrial revolution starting in Britain, (2) coal + iron resources, (3) capture of New World wealth specifically, (4) political fragmentation forcing competition + innovation, (5) Mughal political collapse + British EIC takeover of India undercut Asian competitor. So Unit 4 (1450-1750) shows globalization beginning but Europe not yet dominant. Unit 5-6 (1750-1900) is when the divergence opens. AP comparison essays often probe this timing.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
