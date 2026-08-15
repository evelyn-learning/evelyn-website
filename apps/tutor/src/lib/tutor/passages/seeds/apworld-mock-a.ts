import type { Passage } from '../types';

/**
 * AP World History: Modern — Practice Exam A stimuli (mock exam).
 *
 * Coverage: 15 MCQ stimulus passages (`-st01` … `-st15`, spread across Units
 * 1-9 to anchor the 55-item MCQ stimulus sets with a global regional mix),
 * 2 SAQ stimuli (`-saq1` secondary-source historian's argument, `-saq2`
 * primary-style fictional source), and 1 compiled DBQ packet (`-dbq-packet`,
 * Document 1..7 on global industrialization c. 1750-1900). None reuse an
 * existing store passage id.
 *
 * PD-vs-original policy (guardrail 8 — CRITICAL for this course, where the
 * original AP World fabrication was caught): world-history primary sources are
 * overwhelmingly TRANSLATIONS, whose wording varies by translator, so quoting
 * them "from memory" is a fabrication risk. Accordingly EVERY passage here is
 * either an EXPLICITLY FICTIONAL original ("composed for this exam") or a
 * DESCRIBED visual / data table (also internal-original) — ZERO verbatim
 * excerpts of any real historical text. Every stated fact (Song civil-service
 * exams, Champa rice, Mali gold, Columbian Exchange, industrial output, UN
 * membership growth, etc.) is a widely known textbook generalization, never a
 * quotation. Every MCQ built on these passages requires INTERPRETING the
 * source or supplying outside context — no "which phrase appears in the
 * excerpt" items — so no stimulus leaks its items' keyed answers.
 */
export const APWORLD_MOCK_A_PASSAGES: Passage[] = [
  // ── st01 · Unit 1 · described comparative table (Afro-Eurasia & Americas c.1200) ──
  {
    id: 'evelyn.passage.apworld-mock-a-st01.v1',
    title: 'Societies of Afro-Eurasia and the Americas, c. 1200 CE (data table described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The table below, compiled for this exam, summarizes selected features of five regions around the year 1200 CE. It is an original composition, not a transcription of any historical document.\n\n` +
      `SONG CHINA\n` +
      `Government: a large salaried bureaucracy staffed increasingly through competitive written examinations on Confucian texts.\n` +
      `Economy: booming rice agriculture aided by fast-ripening rice strains from the south, the world's first paper money, and busy iron and porcelain manufacture for export.\n\n` +
      `THE ABBASID AND POST-ABBASID DAR AL-ISLAM\n` +
      `Government: caliphs and regional sultans ruling a religiously and ethnically diverse population.\n` +
      `Economy: merchants and scholars linking the Mediterranean, the Indian Ocean, and Central Asia; centers of learning preserving and extending Greek, Persian, and Indian knowledge.\n\n` +
      `LATIN CHRISTIAN EUROPE\n` +
      `Government: monarchs sharing power with landholding nobles who owed military service; local lords holding manors worked by dependent peasants.\n` +
      `Economy: mostly agricultural, organized around self-sufficient manors, with reviving long-distance trade at fairs and towns.\n\n` +
      `MALI AND THE WEST AFRICAN SAHEL\n` +
      `Economy: kingdoms enriched by control of gold fields and of the trade in gold and salt crossing the Sahara.\n\n` +
      `THE SOUTH AND SOUTHEAST ASIAN COASTS\n` +
      `Economy: port kingdoms taxing and provisioning the merchant ships that carried spices, cotton textiles, and other goods across the Indian Ocean.`,
    lineNumbered: false,
    wordCount: 200,
  },

  // ── st02 · Unit 2 · described map/table (Networks of Exchange, 1200-1450) ──
  {
    id: 'evelyn.passage.apworld-mock-a-st02.v1',
    title: 'Networks of exchange across Afro-Eurasia, 1200-1450 (map and notes described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The map and accompanying notes described below were prepared for this exam. They are an original composition, not a reproduction of any historical source.\n\n` +
      `The map shows four great routes of exchange knitting Afro-Eurasia together between 1200 and 1450.\n\n` +
      `THE SILK ROADS: overland caravan routes across Central Asia. A note reads that these routes carried high-value, low-bulk goods such as silk and porcelain westward, and that the growth of large trading cities along them depended on camels, caravanserais, and the safety merchants enjoyed when a single power kept order across the region.\n\n` +
      `THE INDIAN OCEAN: sea lanes linking East Africa, Arabia, India, and Southeast Asia. A note reads that ships timed their voyages to the seasonal reversal of the monsoon winds and that this trade moved bulkier goods, and larger numbers of merchants who settled in distant ports, than the overland routes could.\n\n` +
      `THE TRANS-SAHARAN ROUTES: caravan tracks across the desert linking West Africa to the Mediterranean, carrying gold northward and salt and other goods southward.\n\n` +
      `THE MONGOL DOMAINS: a shaded band across Eurasia marks the lands unified under Mongol rulers, with a note that under their rule merchants, envoys, and ideas — and, later, disease — moved unusually freely from China to the edge of Europe.`,
    lineNumbered: false,
    wordCount: 200,
  },

  // ── st03 · Unit 3 · fictional account of a land-empire administration ──
  {
    id: 'evelyn.passage.apworld-mock-a-st03.v1',
    title: 'Report of a minister to his sovereign (fictional, composed for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'document',
    fullText:
      `The following is a fictional report, composed for this exam in the voice of a chief minister advising the ruler of a large land-based empire of the sixteenth or seventeenth century. It is an original composition and is not a transcription of any real document; the empire is a composite, not a specific state.\n\n` +
      `Majesty — Our armies have again enlarged the realm this season, and the treasury is full. Yet an empire is not held by conquest alone, and I set down here what sustains your rule.\n\n` +
      `We govern peoples of many faiths and tongues. Where we have left the local notables in their places, confirmed them in their lands, and asked of them only loyalty, taxes, and soldiers, the provinces have been quiet. Where officials have pressed too hard upon men's beliefs, revolt has followed.\n\n` +
      `I therefore counsel that we continue to appoint to high office men raised up and salaried by the crown, who owe their standing to you and not to birth; that we survey the land and set its taxes by what each district can bear; and that we adorn the capital with such mosques, courts, and monuments as will make plain to every subject and envoy the greatness and permanence of your house.`,
    lineNumbered: false,
    wordCount: 205,
  },

  // ── st04 · Unit 3 · described visual (belief & legitimation in land empires) ──
  {
    id: 'evelyn.passage.apworld-mock-a-st04.v1',
    title: 'Rulers and their sources of legitimacy (illustration described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The illustrated panel described below was created for this exam in the style of early-modern court art. It is an original composition, not a reproduction of any specific artwork.\n\n` +
      `The panel shows three rulers of large early-modern empires, each seated in majesty, with symbols meant to justify their authority.\n\n` +
      `On the left, a ruler is shown enthroned beneath a dome, receiving a scholar of religious law who presents a book; a caption notes that this ruler styled himself a defender and patron of the faith and built grand houses of worship.\n\n` +
      `In the center, a ruler is shown weighed against a heap of gold and jewels to be given away, surrounded by court painters and poets; a caption notes that this ruler tolerated several religions among his subjects and drew talent from all of them into his service.\n\n` +
      `On the right, a ruler is shown performing a public ceremony at an altar of Heaven; a caption notes that this ruler claimed to rule by a mandate that could be lost if he governed badly, and that his officials were chosen through examinations.\n\n` +
      `Beneath all three runs the line: "Different thrones, the same task — to make obedience appear as the natural order of things."`,
    lineNumbered: false,
    wordCount: 205,
  },

  // ── st05 · Unit 4 · described table (transoceanic exploration & Columbian Exchange) ──
  {
    id: 'evelyn.passage.apworld-mock-a-st05.v1',
    title: 'The first century of transoceanic connection, c. 1490-1600 (data table described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The table below was compiled for this exam to summarize changes that followed the opening of permanent sea routes between the Eastern and Western Hemispheres. It is an original composition, not a transcription of any historical source.\n\n` +
      `NEW SEA ROUTES\n` +
      `Portuguese ships reached the Indian Ocean around Africa; Spanish-sponsored voyages crossed the Atlantic to the Americas and, later, on across the Pacific, tying the hemispheres into a single web of sea lanes for the first time.\n\n` +
      `BIOLOGICAL TRANSFERS (the "Columbian Exchange")\n` +
      `To the Americas: horses, cattle, pigs, wheat, sugarcane — and diseases such as smallpox, to which Indigenous peoples had no immunity.\n` +
      `To Afro-Eurasia: maize, potatoes, cassava, tomatoes, cacao, and tobacco.\n` +
      `Noted effect: American crops such as potatoes and maize later helped populations grow in parts of Europe, Africa, and China, while epidemic disease killed a large share of the Indigenous American population within a century.\n\n` +
      `SILVER\n` +
      `Vast quantities of silver mined in Spanish America flowed across the Atlantic and the Pacific, much of it ending up in China, where demand for silver was high — helping to bind the world's economies into a single system of exchange.`,
    lineNumbered: false,
    wordCount: 195,
  },

  // ── st06 · Unit 4 · fictional Atlantic-system letter (slave trade & resistance) ──
  {
    id: 'evelyn.passage.apworld-mock-a-st06.v1',
    title: 'Letter of a plantation overseer (fictional, composed for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'letter',
    fullText:
      `The following is a fictional letter, composed for this exam in the voice of an overseer on a Caribbean sugar plantation writing to the estate's owner in Europe around 1760. It is an original composition, not a transcription of any real document.\n\n` +
      `Sir — The season's sugar is boiling well, and the ships will not want for cargo. But I must be plain about the labor. The work in the cane and the boiling-house is killing, and we bury more of the enslaved than are born here; only the ships that come each year from the African coast keep the gangs at their full number.\n\n` +
      `Nor are the people quiet. Some slip away into the hills, where runaways have built villages we cannot easily reach and will not come down. Others break tools, feign sickness, or slow their pace when the drivers' backs are turned. Twice this year I have uncovered talk of a rising. I have answered as you would wish, with the whip and the example; but I tell you plainly that the wealth this island sends home rests upon a great and watchful cruelty, and upon a fresh supply of captives without which the whole enterprise would fail within a generation.`,
    lineNumbered: false,
    wordCount: 205,
  },

  // ── st07 · Unit 5 · fictional revolutionary pamphlet (Atlantic revolutions & Enlightenment) ──
  {
    id: 'evelyn.passage.apworld-mock-a-st07.v1',
    title: 'A revolutionary pamphlet (fictional, composed for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'pamphlet',
    fullText:
      `The following is a fictional pamphlet, composed for this exam in the voice of a reformer writing in the age of the Atlantic revolutions, around 1790. It is an original composition and is not a transcription of any real pamphlet.\n\n` +
      `Fellow citizens — For too long we have been told that some men are born to rule and the rest to obey, that a crown or a title is a gift of God beyond all question. But reason and nature teach otherwise. Authority that does not rest upon the consent of the governed is mere force dressed in ceremony.\n\n` +
      `The philosophers of our age have shown that all persons possess rights that no king bestowed and none may justly take away, and that a government exists only to secure those rights. If it does not, the people who made it may unmake it.\n\n` +
      `Let us then no longer be the subjects of a master, but citizens of a nation that governs itself — a people bound together not by obedience to a dynasty but by common laws we ourselves consent to, and by a shared devotion to the land we call our own. What has been done across the ocean, and is now attempted here, can be done wherever men dare to reason and to act.`,
    lineNumbered: false,
    wordCount: 210,
  },

  // ── st08 · Unit 5 · described table (industrialization: output, cities, labor) ──
  {
    id: 'evelyn.passage.apworld-mock-a-st08.v1',
    title: 'Industrialization in a European nation, c. 1780-1860 (data table described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The table below was compiled for this exam to illustrate the transformation of an industrializing European nation between about 1780 and 1860. The figures are illustrative and were prepared for this exam; they are not drawn from any specific historical record.\n\n` +
      `SHARE OF THE POPULATION LIVING IN TOWNS AND CITIES\n` +
      `c. 1780: roughly one in five\n` +
      `c. 1860: roughly one in two\n\n` +
      `PRODUCTION OF COAL AND IRON\n` +
      `Both rose many times over as steam engines, powered by coal, drove factory machinery, railways, and steamships.\n\n` +
      `WHERE PEOPLE WORKED\n` +
      `c. 1780: most people farmed or made goods by hand in their homes and villages.\n` +
      `c. 1860: a large and growing share worked for wages in mills and factories, often long hours at the pace of the machine, including many women and children.\n\n` +
      `A note beneath the table reads: "Contemporaries disagreed sharply over these changes — some hailed the rising output and new goods as progress, while others condemned the crowding, pollution, and hardship of the new industrial towns and called for reform."`,
    lineNumbered: false,
    wordCount: 195,
  },

  // ── st09 · Unit 6 · described political cartoon (New Imperialism) ──
  {
    id: 'evelyn.passage.apworld-mock-a-st09.v1',
    title: 'An imperial cartoon, c. 1890 (political cartoon described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'political-cartoon',
    fullText:
      `The political cartoon described below was created for this exam in the style of magazine cartoons of the late nineteenth century, when several industrial powers were seizing colonies across Africa and Asia. It is an original composition, not a reproduction of any real cartoon.\n\n` +
      `The cartoon shows several well-dressed figures in European dress, each labeled with the name of an industrial power, gathered around a large map spread on a table. The map is labeled "AFRICA," and the figures are drawing lines across it with rulers and pens, carving it into blocks marked with their own colors. None of the people who live on the map are seated at the table.\n\n` +
      `In the background, a factory chimney smokes, and crates labeled "MACHINE GOODS" wait beside a steamship; a smaller label reads "IN SEARCH OF MARKETS AND RAW MATERIALS." One figure holds a rifle behind his back. A banner across the top reads, in the mock-solemn tone of the cartoonist, "BRINGING THE BLESSINGS OF CIVILIZATION." At the edge of the drawing, a small figure representing the colonized peoples reaches toward the map in protest and is ignored.`,
    lineNumbered: false,
    wordCount: 195,
  },

  // ── st10 · Unit 6 · fictional account (colonial migration & resistance) ──
  {
    id: 'evelyn.passage.apworld-mock-a-st10.v1',
    title: 'Account of a colonial-era laborer (fictional, composed for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'memoir',
    fullText:
      `The following is a fictional account, composed for this exam in the voice of a South Asian laborer recalling the later nineteenth century. It is an original composition and is not a transcription of any real memoir.\n\n` +
      `When the crops failed and the taxes did not, an agent came to our district promising work across the sea. I signed a paper I could not fully read, binding me to labor for a term of years on a plantation in a distant colony, and I crossed the ocean crowded in the hold of a steamship with hundreds of others from villages like mine.\n\n` +
      `The work was hard and the wages small, and the term never seemed to end, for debts were always added. Yet in that far place I found others who had come the same way, from India and China and beyond, and we kept our languages and our gods and slowly built new communities in the colony.\n\n` +
      `In time I heard educated men of my own homeland begin to argue that the empire took far more from us than it gave, and that our people should have a voice in our own governing. Their words stayed with me, though I was only a laborer and no one asked my opinion.`,
    lineNumbered: false,
    wordCount: 210,
  },

  // ── st11 · Unit 7 · fictional WWI-era document ──
  {
    id: 'evelyn.passage.apworld-mock-a-st11.v1',
    title: 'A wartime memorandum (fictional, composed for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'document',
    fullText:
      `The following is a fictional memorandum, composed for this exam in the voice of a government official of one of the powers fighting the First World War, written around 1916. It is an original composition and is not a transcription of any real document.\n\n` +
      `This is a war unlike any our histories record. The alliances we bound ourselves to in peacetime have dragged every great power into a single quarrel, and the machines our factories learned to build — the rapid gun, the barbed wire, the shell fired from beyond sight — have turned the battlefield into a place where armies dig into the earth and die by the hundred thousand for a few miles of mud.\n\n` +
      `To feed this war we have done what no earlier government dared: we direct the factories, ration the bread, and press the whole people, women in the works and men at the front, into the nation's service. We summon soldiers and laborers from our colonies overseas to fight and toil in a European quarrel far from their homes.\n\n` +
      `I fear that whatever peace follows, the old order that entered this war will not survive it, and that the colonies whose sons we have called upon will not afterward be content to serve in silence.`,
    lineNumbered: false,
    wordCount: 215,
  },

  // ── st12 · Unit 7 · described table (interwar economy & WWII total war) ──
  {
    id: 'evelyn.passage.apworld-mock-a-st12.v1',
    title: 'The world from war to war, 1929-1945 (data table described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The table below was compiled for this exam to summarize global developments between the two world wars and during the Second World War. It is an original composition, not a transcription of any historical source.\n\n` +
      `THE GREAT DEPRESSION\n` +
      `Beginning around 1929, a financial collapse spread from one industrial economy to another, throwing millions out of work worldwide and leading many governments to intervene far more deeply in their economies.\n\n` +
      `POLITICAL RESPONSES\n` +
      `In several countries the hardship and disorder helped bring to power aggressive, militarized regimes that promised national revival, rejected democracy, and prepared for territorial expansion.\n\n` +
      `THE SECOND WORLD WAR\n` +
      `A conflict fought across Europe, Asia, Africa, and the Pacific in which whole societies were mobilized. A note reads that the war's deadliness for civilians — through bombing of cities, deliberate mass murder including the Holocaust, and famine — far exceeded that of earlier wars, and that it ended with the first use of atomic weapons.`,
    lineNumbered: false,
    wordCount: 175,
  },

  // ── st13 · Unit 8 · fictional Cold War / decolonization speech ──
  {
    id: 'evelyn.passage.apworld-mock-a-st13.v1',
    title: 'Speech of a newly independent nation\'s leader (fictional, composed for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'speech',
    fullText:
      `The following is a fictional speech, composed for this exam in the voice of the leader of a nation that has just won its independence from a European empire, around 1960. It is an original composition and is not a transcription of any real speech.\n\n` +
      `Countrymen — After long struggle the foreign flag is lowered and our own is raised. The empire that ruled us has gone, as empires across Asia and Africa are going in these years, and we are at last masters in our own house.\n\n` +
      `But we are born into a world divided between two great powers, each pressing us to take its side and join its camp. I say to both: we did not throw off one master to bow to another. We will trade with all and be the servants of none. Let us stand with the other new nations, so many of us freed in the same generation, and chart a path of our own between the rival blocs.\n\n` +
      `The harder work now begins — to feed our people, to teach our children, to build industry where the empire left us only fields and mines. Independence is not the end of our struggle but the ground on which the real struggle for a better life can finally be waged.`,
    lineNumbered: false,
    wordCount: 220,
  },

  // ── st14 · Unit 8 · described table (UN membership growth & end of Cold War) ──
  {
    id: 'evelyn.passage.apworld-mock-a-st14.v1',
    title: 'The changing world order, 1945-1995 (data table described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The table below was compiled for this exam to summarize changes in the international order in the decades after 1945. The figures are approximate and were prepared for this exam.\n\n` +
      `MEMBER STATES OF THE UNITED NATIONS\n` +
      `1945: about 50\n` +
      `1970: about 130\n` +
      `1995: about 185\n` +
      `A note reads that most of the new members were nations that had thrown off European colonial rule in the decades after 1945.\n\n` +
      `THE COLD WAR\n` +
      `For over four decades the United States and the Soviet Union, each leading a bloc of allies, contended for global influence without ever fighting each other directly on the battlefield.\n\n` +
      `THE END OF THE COLD WAR\n` +
      `Between about 1989 and 1991 the communist governments of Eastern Europe fell and the Soviet Union broke apart into separate states, leaving the United States as the world's foremost power and ending the division of the world into two rival superpower blocs.`,
    lineNumbered: false,
    wordCount: 175,
  },

  // ── st15 · Unit 9 · described multi-part table (globalization since 1900) ──
  {
    id: 'evelyn.passage.apworld-mock-a-st15.v1',
    title: 'A globalizing world, c. 1900-2010 (data table described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The table below was compiled for this exam to summarize several long-run global changes across the twentieth century and after. The figures are approximate and were prepared for this exam.\n\n` +
      `WORLD POPULATION\n` +
      `1900: about 1.6 billion\n` +
      `2010: about 6.9 billion, as better medicine, sanitation, and food supply sharply reduced death rates.\n\n` +
      `COMMUNICATION AND TECHNOLOGY\n` +
      `Over the century the telephone, radio, television, and finally the internet and mobile phone spread across the world, each new device shrinking the time it took news and ideas to travel from one place to another.\n\n` +
      `THE GLOBAL ECONOMY\n` +
      `Trade grew far faster than population as goods were increasingly made in globe-spanning supply chains and shipped in standardized containers; large corporations operated across many countries at once.\n\n` +
      `ENVIRONMENT AND DISEASE\n` +
      `A note reads that the same interconnection sped the spread of some diseases across the globe, and that rising industrial output and fossil-fuel use drove pollution and long-term changes in the earth's climate.\n\n` +
      `PEOPLES AND RIGHTS\n` +
      `A note reads that as people, ideas, and images crossed borders more freely than ever, many communities also pushed back, working to safeguard their own traditions against outside influence.`,
    lineNumbered: false,
    wordCount: 200,
  },

  // ── SAQ 1 stimulus · secondary source: fictional historian's argument (Mongols) ──
  {
    id: 'evelyn.passage.apworld-mock-a-saq1.v1',
    title: "A historian's interpretation of the Mongol Empire (fictional secondary source, composed for this exam)",
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'essay',
    fullText:
      `The following is a fictional secondary-source excerpt, composed for this exam in the voice of a modern historian. The historian and the passage are invented for this exam and are not a real publication.\n\n` +
      `"For centuries the Mongols were remembered only for what they destroyed — the sacked cities, the slaughtered populations, the terror that ran ahead of their armies. That reputation is not undeserved; their conquests were among the bloodiest in history. Yet to see only the destruction is to miss the Mongols' larger place in world history. Having conquered the largest contiguous land empire the world had ever seen, they governed it in a way that made the whole of Eurasia, for roughly a century, a single connected space. They protected the trade routes, moved skilled craftsmen and administrators from one end of their domains to the other, tolerated the many religions of their subjects, and carried technologies and ideas — printing, gunpowder, new understandings of geography and medicine — from East Asia toward the West. The very roads that carried these goods also carried the plague that would devastate three continents. The Mongols, in short, were not merely a catastrophe that interrupted history; they were, for good and ill, among the great integrators of the pre-modern world."`,
    lineNumbered: false,
    wordCount: 195,
  },

  // ── SAQ 2 stimulus · primary-style fictional source (anti-imperial nationalist) ──
  {
    id: 'evelyn.passage.apworld-mock-a-saq2.v1',
    title: 'An anti-colonial address (fictional primary source, composed for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'speech',
    fullText:
      `The following is a fictional primary-source excerpt, composed for this exam in the voice of an anti-colonial nationalist addressing a gathering of his countrymen around 1910, in a colony ruled by a European industrial power. It is an original composition and is not a transcription of any real speech.\n\n` +
      `"They came to us speaking of trade, and stayed to rule. They tell us their factories and railways are gifts, and that we are not yet fit to govern ourselves. But look at what their rule has made of us: our old crafts ruined by the machine-made cloth they sell us, our fields turned to grow what their markets want rather than what feeds our people, our taxes carried across the sea, and our own hands forbidden a share in the governing of our own land.\n\n` +
      `I do not say we should refuse every new thing. Let us learn what is worth learning — their sciences, their schools, even the very ideas of liberty and nation they preach at home and deny to us abroad. But let us turn that learning to our own purpose: to bind ourselves together as one people and to demand, and if need be to take, the right to rule ourselves. No nation was ever truly free that waited politely for its masters to grant it freedom."`,
    lineNumbered: false,
    wordCount: 220,
  },

  // ── DBQ packet · Global industrialization, c. 1750-1900 · Documents 1-7 ──
  {
    id: 'evelyn.passage.apworld-mock-a-dbq-packet.v1',
    title: 'DBQ Document Packet — The causes and effects of industrialization, c. 1750-1900',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apworld-mock-a',
    license: 'internal-original',
    genre: 'document',
    fullText:
      `The following seven-document packet was compiled for this exam. EVERY document is an ORIGINAL composition or a DESCRIBED visual/table created for this exam and clearly labeled as such; none is a transcription of any real historical source. (World-history sources are typically translations whose wording varies, so this packet quotes no real text.) The packet supports one prompt on the causes and effects of industrialization in the world, c. 1750-1900, and deliberately gathers varied regional perspectives.\n\n` +

      `Document 1\n` +
      `Source: Fictional letter from a British mill owner to a business partner, c. 1815, composed for this exam.\n` +
      `"The new engines have changed everything. Where once we depended on the season's water and the strength of men's arms, coal and steam now drive our machines day and night, and one factory does the work that a whole county of hand-weavers once did. Our cloth is cheaper than any made by hand, and we sell it in markets across the world that no English weaver ever reached."\n\n` +

      `Document 2\n` +
      `Source: Fictional testimony of a factory worker before a government committee, c. 1840, composed for this exam.\n` +
      `"I began in the mill at nine years of age. We are at the machines thirteen hours in the day, and the overseer fines us if we are late or if we rest. The air is full of cotton dust and the noise never stops. My mother, my sisters, and I all work, and together we scarcely earn enough to keep the family in one room. This is not the England the gentlemen speak of."\n\n` +

      `Document 3\n` +
      `Source: Data table described for this exam (illustrative figures).\n` +
      `A table titled "Machine-made cotton cloth imported into a South Asian colony" reports: c. 1800 — very little, as local hand-weavers supplied the cloth; c. 1850 — a large and rising quantity of cheap imported cloth; c. 1880 — imported machine cloth dominant, and many local hand-weavers thrown out of work. A note beneath reads: "Colonial officials encouraged the colony to buy the ruling power's manufactures and to export raw cotton in return."\n\n` +

      `Document 4\n` +
      `Source: Fictional memorandum by a reforming official in an Asian empire, c. 1870, composed for this exam.\n` +
      `"We have seen what befell our neighbors who kept to the old ways while the Western powers came with steamships and cannon. If we are to preserve our independence, we must not merely buy their goods but learn to make our own: build railways and arsenals, send our young men to study their sciences, and raise up factories of our own. We will take their methods in order not to be ruled by them."\n\n` +

      `Document 5\n` +
      `Source: Fictional editorial in a European newspaper, c. 1885, composed for this exam.\n` +
      `"Our factories cry out for cotton, rubber, and metals they cannot find at home, and for markets to buy the flood of goods they produce. It is therefore not greed but necessity that drives us to secure colonies abroad. The nation that fails to plant its flag where these riches lie will find its mills idle and its rivals grown strong at its expense."\n\n` +

      `Document 6\n` +
      `Source: Political cartoon described for this exam (fictional, in the style of c. 1890).\n` +
      `The cartoon shows a giant steam-driven loom straddling the globe. From one side workers feed in raw cotton, wool, and ore, each bale labeled with the name of a distant colony; from the other side pour finished goods, and coins that fall into the pockets of a small group of well-dressed factory owners standing to one side. Crowded beneath the machine, tiny laborers — in both the factory and the colonies — strain to keep it fed. The caption reads: "Who feeds the machine, and who keeps the gold?"\n\n` +

      `Document 7\n` +
      `Source: Fictional pamphlet by a labor organizer, c. 1895, composed for this exam.\n` +
      `"The masters say the wealth the machines create will lift us all. We who tend the machines know better. We have made ourselves into a new class, the workers of the industrial age, and we have learned that only by joining together — in unions, and at the ballot box where we are allowed near it — can we win shorter hours, safer works, and a fair share of what our labor produces. The same machine that binds the world together has bound us workers together too, and in that lies our hope."`,
    lineNumbered: false,
    wordCount: 620,
  },
];
