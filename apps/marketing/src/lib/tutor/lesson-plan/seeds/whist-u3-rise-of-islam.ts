/**
 * World History — Postclassical Connections: The Rise & Spread of Islam.
 *
 * One of the course's fastest cause-and-effect sequences: a merchant
 * society on a trade crossroads, a new faith, and within a century a
 * political and cultural world stretching from Iberia to the Indus —
 * followed by centuries of quieter spread along trade routes. Factual
 * spine salvaged from the legacy world-history Dar al-Islam seed and
 * reframed subject-first. C3 D2.His.14.9-12, D2.Geo.7.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U3_RISE_OF_ISLAM: LessonPlan = {
  id: 'evelyn.hs.whist.rise-of-islam.v1',
  title: 'The Rise & Spread of Islam',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.rise-of-islam',
      standard: 'WHIST-3.1',
      description:
        'Explain the origins of Islam in seventh-century Arabia, analyze why Muslim rule expanded so rapidly after 632 CE, and trace how trade networks and Sufi teachers carried the faith across Africa and Asia long after the conquests ended (C3 D2.His.14.9-12, D2.Geo.7.9-12).',
    },
  ],
  prerequisites: ['whist.world-belief-systems'],
  followUps: ['whist.islamic-golden-age'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the speed of the change — and set up the twist that the fastest part of the story is not the part that spread the faith furthest.',
      script:
        'In the year 600 CE, the Arabian Peninsula was a place the great empires mostly ignored — desert, oases, and caravan towns on the edge of somebody else\'s map. Within about a hundred years, rulers who governed in the name of Islam controlled territory from Spain to the borders of India, larger than Rome ever managed, and faster. That alone is worth explaining. But here is the twist that surprises most students: the regions with the largest Muslim populations today — Indonesia, Bangladesh, parts of West Africa — were never conquered by those armies at all. The faith reached them by ship, by caravan, and by traveling teachers, centuries later. So today you learn two different stories that people constantly mash into one: how an empire grew fast, and how a religion spread far.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rise-of-islam',
      kind: 'concept',
      goal: 'Arabia before Islam, the founding, the rapid expansion and its causes, the succession split, the caliphates, and the long trade-driven spread.',
      keyIdeas: [
        'ARABIA WAS A CROSSROADS, NOT A BACKWATER — before 600 CE the peninsula linked Indian Ocean shipping to Mediterranean markets. Mecca was a caravan town and a pilgrimage site whose shrine, the Kaaba, drew tribes from across the region. Society was organized by clan and tribe, with no single state — and merchants there already knew Jewish and Christian communities well.',
        'MUHAMMAD AND THE MESSAGE — Muhammad (c. 570-632 CE), a Meccan merchant, taught that there is one God (Allah, the same Arabic word Arabic-speaking Christians use) and that he was the last in a line of prophets including Abraham, Moses, and Jesus. His followers recorded his revelations as the Quran. Practice centers on the Five Pillars: declaration of faith, prayer, charity, fasting during Ramadan, and pilgrimage (hajj) to Mecca for those able.',
        'THE HIJRA STARTS THE CLOCK — Meccan elites, whose wealth and status were tied to the old shrine and clan order, opposed him. In 622 CE Muhammad and his followers moved to Medina, where he became a political and legal leader as well as a religious one. That move — the hijra — is year one of the Islamic calendar, which tells you what Muslims regarded as the founding moment: not a birth, but the formation of a community.',
        'WHY EXPANSION WAS SO FAST AFTER 632 — no single cause. The Byzantine and Sasanian Persian empires had just exhausted each other in decades of war and taxed their border provinces hard; Arabia had been unified under one faith and one leadership for the first time, converting tribal raiding energy into a common cause; the armies were mobile and led by experienced commanders; and existing caravan and sea routes gave them roads, information, and supply.',
        'RULE SPREAD FASTER THAN BELIEF — this is the classic confusion. Conquest transferred POLITICAL control quickly, but most conquered populations remained Christian, Jewish, or Zoroastrian for generations. Jews and Christians were generally treated as protected "people of the book," keeping their worship in exchange for a tax (the jizya). Many regions did not become majority-Muslim until two or three centuries after they were conquered.',
        'THE SUCCESSION DISPUTE BECAME SUNNI AND SHIA — Muhammad died in 632 without an agreed successor. Most accepted a caliph chosen by the community\'s leading figures; a minority held that leadership belonged to Muhammad\'s family line through his cousin and son-in-law Ali. That political argument, hardened by later civil war and by the killing of Ali\'s son Husayn at Karbala in 680, grew into the enduring Sunni and Shia branches — which is why the split began as a question about WHO LEADS, not about the core beliefs of the faith.',
        'UMAYYADS THEN ABBASIDS — the Umayyad caliphate (661-750), ruling from Damascus, pushed the frontier to Iberia in the west and Central Asia in the east; critics charged it favored Arab elites over non-Arab converts. The Abbasid caliphate (from 750) moved the center to Baghdad, drew Persian and other non-Arab talent into government and scholarship, and presided over the flourishing of learning you meet in the next lesson.',
        'TRADE AND SUFIS CARRIED IT FURTHEST — long after the conquests stopped, Islam kept spreading through commerce and preaching. Muslim merchants crossing the Sahara brought it to the West African kingdoms of Ghana, Mali, and Songhai — Mali\'s ruler Mansa Musa made a famously lavish hajj in 1324. Indian Ocean traders carried it to the Swahili coast and to the ports of South and Southeast Asia. Sufi teachers, practicing a mystical, devotional form of Islam, adapted their message to local custom and won followers where no Muslim army ever marched — which is how Indonesia became the largest Muslim-majority country in the world.',
      ],
      vocabulary: [
        { term: 'caliph', definition: 'the political successor to Muhammad as leader of the Muslim community — a ruler, not a prophet.' },
        { term: 'hijra', definition: "Muhammad's 622 CE migration from Mecca to Medina — year one of the Islamic calendar." },
        { term: 'Sufism', definition: 'a mystical, devotional tradition within Islam whose traveling teachers spread the faith far beyond areas under Muslim rule.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-why-so-fast',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did a peninsula the great empires barely bothered with produce, within about a century of 632 CE, a realm stretching from Iberia to the Indus?',
      steps: [
        'Reject the single-cause answer first. "Religious enthusiasm" alone cannot be the explanation — plenty of movements have had fervent believers and conquered nothing. Look for the stack of conditions that lined up at once.',
        'Condition one — the neighbors were wrecked. Byzantium and Sasanian Persia had fought a brutal war ending in 628 CE that drained both treasuries and armies, and heavy taxes had left their Syrian, Egyptian, and Iraqi provinces unenthusiastic about defending the old regime.',
        'Condition two — Arabia was unified. For the first time a shared faith and a single leadership had knit rival clans together, redirecting energy that used to go into inter-tribal raiding outward into coordinated campaigns.',
        'Condition three — the routes already existed. These were merchant societies. Caravan networks and sea lanes meant commanders knew the roads, the water, the markets, and who was weak — expansion followed trade geography, not blank desert.',
        'Condition four — the terms of rule were manageable. Conquerors generally left local officials, languages, and religious communities in place under a tax, so cities often surrendered rather than face a siege. Ruling was cheap; that is what let control spread quickly.',
        'Close the chain, and mark its limit: exhausted rivals + new unity + existing routes + light-touch administration = fast political expansion. It explains territory. It does NOT yet explain belief — most people inside that territory were still not Muslim for generations.',
      ],
      answer:
        'No single cause — Byzantine and Persian exhaustion, first-time Arabian unity, ready-made trade routes, and tolerable terms for surrendering cities combined to spread RULE rapidly, which is a different achievement from spreading faith.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-port-city-account',
      kind: 'worked_example',
      problem:
        'A traveler describing a Southeast Asian port around 1400 CE recorded something like this (paraphrased): "The harbor ruler and his merchants pray as Muslims and pay for a teacher from across the sea to instruct their sons; a day inland the villages keep the older rites, and no soldier troubles them about it." What does this short account reveal about how Islam spread in this region?',
      steps: [
        'Locate the setting precisely: a PORT, around 1400 CE — roughly seven hundred years after the conquests, and thousands of miles beyond where any caliph\'s army ever reached. Whatever brought Islam here, it was not a battlefield.',
        'Follow who converted first: the ruler and the merchants. Sharing the faith of the Indian Ocean trading network meant shared law, shared contracts, and trust with partners in Gujarat, Arabia, and the Swahili coast — conversion carried commercial advantage.',
        'Follow the teacher "from across the sea": this is the Sufi and scholarly network at work, moving along the same shipping lanes as the cargo. Religious institutions traveled with trade, not with armies.',
        'Read the inland detail — it is the most important line. A day\'s walk away, older practices continue undisturbed. Spread here was gradual, coastal, and uneven, and it blended with local custom rather than erasing it.',
        'Note the silence: no conquest, no forced conversion, no caliph. Set this beside the seventh-century story and the contrast is the whole point of the lesson — armies made the empire, merchants and teachers made the map of the Muslim world we see today.',
      ],
      answer:
        'It shows commerce-led, coastal, gradual spread: rulers and merchants adopting the faith of their trading partners, scholars and Sufi teachers arriving by sea, inland communities unconverted and uncoerced — conquest plays no part in it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-expansion-cause',
      kind: 'try_yourself',
      problem: 'Which combination best explains the rapid expansion of Muslim rule in the decades after 632 CE?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Byzantine and Persian empires exhausted by war, newly unified Arabian leadership, familiar trade routes, and terms that let conquered cities keep their officials and religions', correct: true },
        { id: 'b', text: 'Conquered populations converted to Islam immediately, which removed all resistance' },
        { id: 'c', text: 'Muslim armies possessed gunpowder weapons that their opponents lacked' },
        { id: 'd', text: 'The Roman Republic collapsed and left the Mediterranean undefended' },
      ],
      expectedAnswer: 'Byzantine and Persian empires exhausted by war, newly unified Arabian leadership, familiar trade routes, and terms that let conquered cities keep their officials and religions',
      hints: [
        'One of these mistakes an EFFECT for a cause: mass conversion came centuries later, so it cannot explain the speed.',
        'Two others are in the wrong century entirely — gunpowder armies and the Roman Republic are hundreds of years off. Look for the stack of conditions present in the 600s CE.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sunni-shia-origin',
      kind: 'try_yourself',
      problem: 'What question originally divided Muslims into what became the Sunni and Shia branches?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Who should lead the community after Muhammad died in 632 CE — a leader chosen by the community, or a member of his family line through Ali', correct: true },
        { id: 'b', text: 'Whether the Quran or the Five Pillars held greater authority' },
        { id: 'c', text: 'Whether Mecca or Baghdad should be the destination of the hajj' },
        { id: 'd', text: 'Whether the Umayyads should move the capital from Damascus to Cordoba' },
      ],
      expectedAnswer: 'Who should lead the community after Muhammad died in 632 CE — a leader chosen by the community, or a member of his family line through Ali',
      hints: [
        'The dispute began the moment Muhammad died, before any caliphate had been built — so it cannot be about later capitals or later cities.',
        'Both branches accept the Quran and the Five Pillars. Ask instead: who has the right to LEAD?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-trade-spread',
      kind: 'try_yourself',
      problem:
        'Indonesia has the largest Muslim population of any country today, yet no caliph\'s army ever reached it. What best explains how Islam arrived there?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Indian Ocean merchants and Sufi teachers spread it through ports over centuries, beginning with rulers and trading communities', correct: true },
        { id: 'b', text: 'Umayyad armies conquered the islands in the 700s CE and required conversion' },
        { id: 'c', text: 'European colonizers introduced Islam to Southeast Asia in the 1800s' },
        { id: 'd', text: 'The Abbasid caliphate relocated its capital to Southeast Asia after 750 CE' },
      ],
      expectedAnswer: 'Indian Ocean merchants and Sufi teachers spread it through ports over centuries, beginning with rulers and trading communities',
      hints: [
        'The question already tells you no army arrived — so any answer built on conquest contradicts the prompt.',
        'What moved constantly between Arabia, India, and the Indonesian archipelago? Follow the cargo, and follow the teachers who traveled with it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-spread-by-sword',
      kind: 'misconception_check',
      question:
        'A student writes: "Islam spread by the sword — wherever the armies won, everyone was forced to convert." What needs correcting here?',
      commonErrors: [
        {
          answer: 'Conquest and conversion were the same process',
          misconception:
            'Collapsing two different things — the spread of POLITICAL RULE and the spread of BELIEF — into one event, and assuming conquered populations converted immediately and under compulsion.',
          correctsTo:
            'Separate the two. Conquest did spread Muslim RULE very fast after 632 CE, but conversion was slow and mostly voluntary: Christians, Jews, and Zoroastrians generally kept their worship as protected communities in exchange for a tax, and regions like Egypt and Persia took two to three centuries to become majority-Muslim. Meanwhile the places with the largest Muslim populations today — Indonesia, Bangladesh, much of West Africa — were reached by merchants and Sufi teachers, not armies. Historians describe expansion and conversion as two processes with different timelines, different mechanisms, and different maps.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Arabia was a trade crossroads: Mecca was a caravan and pilgrimage town, which is why a merchant society, not an empire, produced this movement.',
        'Muhammad (c. 570-632 CE), the Quran, and the Five Pillars; the hijra to Medina in 622 CE is year one of the Islamic calendar because it created a COMMUNITY, not just a following.',
        'Rapid expansion after 632 had stacked causes: exhausted Byzantine and Persian empires, first-time Arabian unity, existing trade routes, and light-touch terms for surrendering cities.',
        'The Sunni-Shia split began as a succession dispute over who should lead — community-chosen caliph versus Ali and Muhammad\'s family line — hardened by civil war and Karbala in 680.',
        'Umayyads (661-750, Damascus) pushed the frontiers; Abbasids (from 750, Baghdad) opened government and scholarship to non-Arabs.',
        'Rule spread by conquest; the faith spread furthest by trade and Sufi teachers — across the Sahara to Mali, along the Indian Ocean to the Swahili coast and Southeast Asia — over many centuries.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'The Rise & Spread of Islam' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
