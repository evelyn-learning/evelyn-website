/**
 * AP World — Decolonization.
 *
 * The fall of European empires after WWII, methods of independence, postcolonial challenges.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_WORLD_DECOLONIZATION: LessonPlan = {
  id: 'evelyn.ap.world.decolonization.v1',
  title: 'Decolonization After WWII',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ss',
  topic: 'world history',
  locale: 'en',
  los: [
    {
      id: 'apworld.decolonization',
      description: 'Trace the post-1945 dismantling of European empires, compare paths to independence (negotiated vs revolutionary), and analyze enduring postcolonial challenges.',
      standard: 'AP-WORLD-8.5-8.7',
    },
  ],
  prerequisites: ['apworld.wwii'],
  followUps: ['apworld.cold-war'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'In one generation, most of the colonized world becomes independent.',
      script: 'In 1945, European empires controlled most of Africa, much of Asia, and parts of the Americas and Pacific. By 1975, almost all of those colonies were independent nations. This is one of the fastest political reorderings in modern history. How did it happen? Why so quickly? And why are some of those new nations still wrestling with the borders and institutions they inherited?',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-process',
      kind: 'concept',
      goal: 'Causes, methods, and aftermath of decolonization.',
      keyIdeas: [
        'CAUSES: (1) WWII weakened European powers economically and militarily — Britain and France could no longer afford to maintain empires. (2) Wartime promises and propaganda used "democracy" and "self-determination" rhetoric — colonized peoples held them to it. (3) US and USSR pressure (both anti-colonial, for different reasons). (4) Long-built nationalist movements led by Western-educated elites (Gandhi, Nehru, Ho Chi Minh, Kenyatta, Nkrumah) had been organizing for decades.',
        'METHODS: NEGOTIATED — India (1947), Ghana (1957), most British and French sub-Saharan Africa. REVOLUTIONARY — Vietnam (against France 1946-54, then US 1955-75), Algeria (against France 1954-62), Angola/Mozambique (against Portugal 1961-75), Zimbabwe (against Rhodesia 1965-79). Settler-colonies (Algeria, Kenya, South Africa) tended to need armed conflict because European settlers resisted exit.',
        'KEY MOMENTS: India + Pakistan partition (1947) — independence + religious split, ~14 million displaced, ~1 million killed. Ghana (1957) — first sub-Saharan African colony to gain independence under Nkrumah; symbolic for Pan-African movement. "Year of Africa" (1960) — 17 African colonies became independent. Algeria (1962) — France\'s bitterest decolonization war. Vietnam (1975) — fall of Saigon ends 30 years of resistance.',
        'COLD WAR INTERTWINED: Both superpowers courted new states. US backed status-quo regimes that were anti-communist (Mobutu in Congo, Suharto in Indonesia after 1965). USSR backed liberation movements (Cuba, Angola). Many leaders played both sides (Nasser).',
        'POSTCOLONIAL CHALLENGES: ARTIFICIAL BORDERS — drawn by Europeans without regard for ethnic / linguistic groups. Nigeria, Iraq, Sudan inherit explosive divisions. NEOCOLONIALISM — economic dependence persists; former colonies often locked into export of one or two commodities. WEAK INSTITUTIONS — coups (Africa: 80+ between 1960 and 2000), one-party states, civil wars. ETHNIC CONFLICTS — Rwandan genocide (1994), Yugoslav breakup (1990s) reflect inherited divisions.',
        'AFRICAN UNION (founded 1963 as OAU, restructured 2002): pan-African coordination on political and economic issues; a postcolonial response to fragmentation.',
      ],
      vocabulary: [
        { term: 'partition', definition: 'the political division of a colony into separate states upon independence (notably India/Pakistan 1947).' },
        { term: 'neocolonialism', definition: 'continued economic and political dependence of former colonies on former colonizers despite formal independence.' },
        { term: 'pan-Africanism', definition: 'a movement promoting solidarity and political unity among Africans and the African diaspora.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-india-vs-algeria',
      kind: 'worked_example',
      problem: 'Compare how India (1947) and Algeria (1962) achieved independence, and what explains the difference.',
      steps: [
        'INDIA: largely negotiated. Indian National Congress (founded 1885) had been organizing for decades. Gandhi\'s mass nonviolent resistance (Salt March 1930, Quit India 1942) made governance costly for Britain. WWII drained British capacity. By 1947, Britain decided to leave; partition into India and Pakistan was hasty and bloody (~1M dead, ~14M displaced) but the transfer of power was negotiated.',
        'ALGERIA: revolutionary. France considered Algeria a département of France, not a colony. ~1 million European "pieds-noirs" settlers refused to leave. FLN (National Liberation Front) launched armed insurrection (1954). 8-year war: French military used torture (Battle of Algiers); FLN used terrorism and guerrilla warfare. ~500,000 to 1.5 million Algerians died. De Gaulle eventually negotiated independence (1962); pieds-noirs fled.',
        'WHY THE DIFFERENCE: (1) SETTLER POPULATION — Algeria had a large French settler population invested in colonial status; India did not (few British settlers). (2) METROPOLITAN POLITICS — France considered Algeria part of France, not a colony, so independence felt like territorial loss; Britain by 1947 had accepted that India would leave eventually. (3) LEADERSHIP STRATEGY — Indian Congress used mass nonviolence + legal pressure; FLN turned to armed struggle after legal channels closed.',
        'GENERALIZATION: settler-heavy colonies tended toward violent decolonization (Algeria, Kenya Mau Mau, Zimbabwe, Angola); non-settler colonies tended toward negotiated transitions (India, Ghana, Nigeria).',
      ],
      answer: 'India: negotiated, no settlers, mass nonviolence, exhausted Britain. Algeria: revolutionary, large settler population, French resistance, 8-year war.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why are colonial-era borders still a source of conflict in many post-independence states?',
      expectedAnswer: 'European borders were drawn for administrative convenience, ignoring ethnic, religious, and linguistic groups on the ground. Nigeria contains 250+ ethnic groups; Iraq holds Sunni Arabs, Shia Arabs, and Kurds; Sudan was split between Arab/Muslim north and Black/Christian south (eventually leading to South Sudan in 2011). When these states inherited the colonial map at independence, they inherited internal tensions that European administrators had managed by force. Civil wars and ongoing conflicts (Biafra, Iraq, Sudan/South Sudan) reflect those forced unifications.',
      responseFormat: 'free',
      hints: [
        'How were African and Middle Eastern borders drawn?',
        'What happens when a single state contains rival ethnic groups?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-immediate-success',
      kind: 'misconception_check',
      question: 'Did decolonization automatically bring prosperity and democracy to the new nations?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Conflating political independence with developmental success.',
          correctsTo: 'No. Many new nations faced weak institutions, artificial borders, dependence on commodity exports, and Cold War interference. Coups, one-party states, and civil wars were common in the 1960s-80s (Africa: 80+ coups). Some did succeed (India\'s democracy persists; "Asian Tigers" achieved rapid growth). Outcomes vary widely. Independence was a starting condition, not a guarantee.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'WWII broke European capacity; nationalist movements + US/USSR pressure delivered independence.',
        'Negotiated (India, Ghana) vs revolutionary (Vietnam, Algeria, Angola). Settler colonies → violence.',
        'Cold War tangled with decolonization — superpowers picked sides.',
        'Postcolonial challenges: artificial borders, weak institutions, neocolonialism.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the partition of India (1947) considered both an independence story and a humanitarian disaster?',
      hint: 'Independence: end of British rule, popular sovereignty for ~400 million people, world\'s largest democracy. Disaster: hasty partition (Mountbatten\'s 6-week plan), Hindu/Muslim violence, ~14 million displaced (largest mass migration in history), ~1 million killed, Kashmir dispute that still fuels India-Pakistan rivalry. Independence was achieved but at enormous human cost — and the wounds shape South Asian politics 75+ years later.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
