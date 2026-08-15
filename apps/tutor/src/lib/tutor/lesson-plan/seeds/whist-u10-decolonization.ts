/**
 * World History — The Cold War Era: Decolonization & New Nations.
 *
 * The largest transfer of sovereignty in human history, compressed into
 * about three decades: why the empires built in Unit 8.4 collapsed after
 * 1945, the two roads out (negotiated and fought), and the hard inheritance
 * that made independence a beginning rather than an ending. Salvaged
 * factual spine from the legacy world-history decolonization and
 * new-states seeds, reframed subject-first for the survey course.
 * C3 D2.His.1.9-12, D2.His.14.9-12, D2.Civ.6.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U10_DECOLONIZATION: LessonPlan = {
  id: 'evelyn.hs.whist.decolonization.v1',
  title: 'Decolonization & New Nations',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.decolonization',
      standard: 'WHIST-10.2',
      description:
        'Explain why European empires collapsed after 1945, compare the negotiated and armed paths to independence taken by new nations in Asia and Africa, and evaluate the inherited borders, extraction economies, and Cold War pressures that shaped those nations after independence (C3 D2.His.1.9-12, D2.His.14.9-12, D2.Civ.6.9-12).',
    },
  ],
  prerequisites: ['whist.cold-war'],
  followUps: ['whist.end-of-cold-war'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the scale: in one human lifetime, most of the world stopped being ruled by somebody else — and explain why that is a chain of causes, not a gift.',
      script:
        'Open a world map from 1939 and most of Asia and nearly all of Africa is colored in as somebody else\'s property — British, French, Dutch, Belgian, Portuguese. Open a map from 1975 and those colors are gone, replaced by more than fifty independent countries with their own flags, armies, and seats at the United Nations. That is the largest transfer of sovereignty in human history, and it happened in about thirty years. Two questions drive today\'s lesson. First: why then? Empires had survived rebellions for centuries — what broke after 1945? And second: why did the same goal cost Ghana a negotiation and Algeria a war that killed roughly a million people? By the end, you will also see why independence day was the START of the hard part, not the finish line.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-decolonization',
      kind: 'concept',
      goal: 'Why empires collapsed after 1945, the two roads out, the wave itself, and the hard inheritance new nations were handed.',
      keyIdeas: [
        'WHAT BROKE AFTER 1945 — three things at once. The Second World War (Unit 9.3) bankrupted Britain and France and shattered the myth that European rule was permanent or invincible. Millions of colonized soldiers had fought "for freedom" in European armies — and came home taking the word seriously. And both new superpowers talked like anti-colonialists (for their own reasons), while the new United Nations gave independence movements a global stage and an audience.',
        'INDIA 1947 — THE MODEL AND THE WARNING — Mohandas Gandhi built decades of mass nonviolent campaigns whose logic was to make injustice visible and rule ungovernable: in the Salt March (1930) he walked to the sea to make salt in defiance of the British monopoly, forcing the empire either to allow it or to arrest thousands of peaceful people in front of the world\'s cameras. Satyagraha did not appeal to the ruler\'s kindness; it made ruling expensive and embarrassing.',
        'PARTITION\'S PRICE — the Indian National Congress and the Muslim League could not agree on one state, and Britain, leaving in a hurry, split British India into India and Pakistan in August 1947. Borders were drawn in weeks. Roughly one million people died in the violence that followed and around fifteen million were displaced — the largest forced migration of the century, and a wound still shaping South Asian politics.',
        'TWO ROADS OUT: NEGOTIATED — in the Gold Coast, Kwame Nkrumah used strikes, party organizing, and elections rather than sustained war; in 1957 it became Ghana, the first sub-Saharan African colony to win independence. Ghana proved to every other movement on the continent that it could be done, and done soon.',
        'TWO ROADS OUT: FOUGHT — France governed Algeria not as a colony but as part of France, with about a million European settlers who refused any concession, so independence there took a war (1954-1962) that killed on the order of a million people and used torture and terror on multiple sides. In Vietnam, nationalists defeated France at Dien Bien Phu (1954) — then the Cold War superpowers stepped straight into the space France left (Unit 10.1). In Kenya, the Mau Mau uprising (1950s) was met with mass detention and harsh British repression before independence came in 1963. WHERE SETTLERS OWNED THE LAND, EMPIRES FOUGHT.',
        'SUEZ 1956 AS THE PIVOT — when Egypt\'s Gamal Abdel Nasser nationalized the Suez Canal, Britain and France (with Israel) invaded to take it back — and were forced to withdraw by American and Soviet pressure. The old imperial powers had just been told, in public, that they no longer decided anything alone. THE WAVE FOLLOWED: 1960 alone brought seventeen African nations to independence, which is why it is called the "Year of Africa," and United Nations membership roughly tripled between 1945 and 1975. Not a trickle — a cascade, each success making the next likelier.',
        'THE HARD INHERITANCE — new nations inherited borders drawn at the Berlin Conference (Unit 8.4) by Europeans who had never been there, cutting across peoples and locking rivals inside one state: the Congo crisis of the early 1960s and Nigeria\'s Biafra war (1967-1970) both grew from that map. They also inherited economies built to export one or two raw materials to Europe, not to feed or employ their own citizens — and superpowers eager to convert new states into Cold War proxies.',
        'WHAT NEW NATIONS DID ABOUT IT — at Bandung, Indonesia (1955), leaders including Jawaharlal Nehru, Gamal Abdel Nasser, and Sukarno launched what became the Non-Aligned Movement: refusing formal membership in either bloc while still trading with both. Pan-Africanism pushed continental solidarity; many states tried import-substitution industrialization, building factories behind tariff walls to stop being pure raw-material suppliers. Results were mixed — but the ambition was to make political independence economic too. AND ONE PLACE STAYED BEHIND: in South Africa, white minority rule was hardened into apartheid in 1948, Nelson Mandela was imprisoned for twenty-seven years, and majority rule arrived only in 1994 — decolonization deferred by nearly four decades, completing the arc.',
      ],
      vocabulary: [
        {
          term: 'decolonization',
          definition: 'the process by which colonies became independent sovereign states — mostly between 1945 and the mid-1970s.',
        },
        {
          term: 'satyagraha',
          definition: "Gandhi's method of mass nonviolent resistance: openly disobey an unjust law and accept the punishment, so the injustice becomes visible and the rule becomes unworkable.",
        },
        {
          term: 'partition',
          definition: 'the 1947 division of British India into India and Pakistan along largely religious lines, accompanied by roughly a million deaths and about fifteen million people displaced.',
        },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-why-1945',
      kind: 'worked_example',
      problem:
        'Britain and France were on the WINNING side of the Second World War. Build the causal chain that explains how winning that war cost them their empires within twenty years.',
      steps: [
        'Start with the balance sheet: victory left Britain and France financially wrecked and dependent on American loans. Holding a global empire requires soldiers, ships, and administrators — the money for all three was gone.',
        'Add the loss of prestige: Japan had overrun British Malaya, Singapore, and Burma and Dutch Indonesia in months, and Germany had occupied France itself. The claim that European rule was invincible and permanent had been publicly disproved in front of the colonized populations.',
        'Follow the soldiers: millions from India, West Africa, North Africa, and the Caribbean fought in Allied armies under banners promising freedom and self-determination. They returned as trained, organized veterans who applied that promise to their own countries — and would not be told the word had an exception clause for them.',
        'Add the international stage: the United States and the Soviet Union both denounced European colonialism (Washington for markets and ideology, Moscow for revolution), and the new United Nations gave nationalist leaders a place to argue their case where the whole world could hear it. Repression that once happened quietly now happened publicly.',
        'Close the chain: weaker colonizers + a broken myth of invincibility + stronger, veteran-led nationalist movements + an international order that no longer approved of empire. Empires did not simply grant independence — they lost the ability to pay for, justify, or hide the alternative.',
      ],
      answer:
        'Victory bankrupted and exposed the colonizers while arming and organizing the colonized: no money to hold the empire, no myth of invincibility, veteran-led mass movements, and superpowers plus the UN making colonial rule internationally indefensible.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-veteran-letter',
      kind: 'worked_example',
      problem:
        'A veteran from the Gold Coast who had fought in Britain\'s army wrote to a local newspaper in 1946 (original paraphrase): "We were told we were fighting so that no people would be ruled by a foreign power against their will. I have come home to a country where I may not vote, and where my own chief must answer to a British governor. If that word freedom was true in Burma, it is true in Accra." Analyze what this account reveals about why decolonization accelerated after the war.',
      steps: [
        'Identify the speaker and the moment: a colonial subject, a trained soldier, writing in public one year after the war — not a distant observer, and not someone the colonial government could dismiss as disloyal.',
        'Notice the argument he makes: he does not ask for kindness or reform. He takes the empire\'s OWN wartime language about freedom from foreign rule and applies it to himself. That is the sharpest weapon a nationalist movement had, because rejecting it required the empire to say the promise never included Africans.',
        'Notice what the war gave him besides the argument: military training, organization, experience of Europeans as ordinary and defeatable, and a network of fellow veterans. Across Africa and Asia, veterans became a backbone of postwar nationalist parties.',
        'Notice the specific grievance: no vote, and a local chief answerable to a governor. This is the concrete political demand — self-rule — behind the abstract word, and it is exactly what Kwame Nkrumah\'s party organized around in the Gold Coast over the next decade.',
        'Connect it forward: eleven years after this letter, the Gold Coast became Ghana (1957), the first independent nation in sub-Saharan Africa. The account shows the war did not just weaken empires from outside; it supplied the colonized with both the argument and the organizers to press from inside.',
      ],
      answer:
        'It shows the war handed nationalist movements two things at once: the colonizers\' own freedom rhetoric, which was very hard to refuse in public, and a generation of trained, organized veterans to press the demand for self-rule at home.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-after-1945',
      kind: 'try_yourself',
      problem:
        'Colonial rebellions had been defeated for centuries. Which combination best explains why independence movements succeeded so widely AFTER 1945?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'War-bankrupted colonizers, a shattered myth of European invincibility, veteran-led mass movements, and superpowers and the UN making empire indefensible', correct: true },
        { id: 'b', text: 'European governments concluded that colonies had always been morally wrong and voluntarily gave them up' },
        { id: 'c', text: 'Colonized populations only began organizing politically for the first time in the 1950s' },
        { id: 'd', text: 'Germany and Japan won the war and dismantled the British and French empires by force' },
      ],
      expectedAnswer: 'War-bankrupted colonizers, a shattered myth of European invincibility, veteran-led mass movements, and superpowers and the UN making empire indefensible',
      hints: [
        'Ask what CHANGED about the colonizers and about the colonized between 1939 and 1945 — the answer involves both sides, not one.',
        'Money, prestige, trained veterans, and an international audience: several conditions arriving together, not a change of heart.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ghana-vs-algeria',
      kind: 'try_yourself',
      problem:
        'Ghana reached independence in 1957 largely through organizing, strikes, and negotiation; Algeria reached it in 1962 only after an eight-year war costing roughly a million lives. What best explains the difference?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'France treated Algeria as part of France itself, and about a million European settlers there refused any transfer of power', correct: true },
        { id: 'b', text: 'Algerians were unwilling to negotiate, while Ghanaians never used protest or strikes' },
        { id: 'c', text: 'Ghana was strategically valuable to Britain while Algeria was worthless to France' },
        { id: 'd', text: 'Algeria sought independence in the 1800s, long before the postwar wave began' },
      ],
      expectedAnswer: 'France treated Algeria as part of France itself, and about a million European settlers there refused any transfer of power',
      hints: [
        'Ask who ELSE was living in the colony and what they stood to lose — the two cases differ most in that one fact.',
        'A settler population with homes, land, and votes turns "leave" into "expel our own citizens," which colonizers fight rather than negotiate.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-inherited-borders',
      kind: 'try_yourself',
      problem:
        'The Congo crisis of the early 1960s and the Nigerian civil war over Biafra (1967-1970) are both often traced to the same structural cause. What is it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Borders drawn by Europeans at the Berlin Conference cut across peoples and locked rival communities inside single states', correct: true },
        { id: 'b', text: 'The new governments had no written constitutions of any kind' },
        { id: 'c', text: 'Both countries were still formally ruled by Belgium and Britain into the 1970s' },
        { id: 'd', text: 'Neither country had any valuable natural resources to fund a government' },
      ],
      expectedAnswer: 'Borders drawn by Europeans at the Berlin Conference cut across peoples and locked rival communities inside single states',
      hints: [
        'Look at where those borders came from — nobody living there drew them, and they were drawn decades before independence.',
        'Unit 8.4: Europeans partitioned Africa on a map in Berlin without regard for who actually lived where; the new nations inherited that map unchanged.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-independence-is-the-ending',
      kind: 'misconception_check',
      question:
        'A student writes: "Once the colonies became independent, the era of outside control was over and the new nations were finally free to run themselves." What needs correcting?',
      commonErrors: [
        {
          answer: 'Independence ended outside control and solved the new nations\' problems',
          misconception: 'Treating independence day as the end of the story, rather than the moment new nations inherited borders, economies, and rivalries designed by and for someone else.',
          correctsTo:
            'Independence transferred SOVEREIGNTY, not power over every condition a new nation faced. New states inherited Berlin-drawn borders that cut across peoples (Congo, Biafra), economies built to export one or two raw materials rather than to employ or feed their own citizens, and superpowers eager to make them Cold War proxies — which is exactly why leaders like Nkrumah warned about continued economic dependence, why Bandung (1955) and the Non-Aligned Movement tried to carve out a third path, and why import-substitution industrialization was attempted at all. In South Africa the arc was not even complete: white minority rule was hardened into apartheid in 1948, Nelson Mandela spent twenty-seven years in prison, and majority rule arrived only in 1994. Independence was a beginning, not an ending.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Empires collapsed after 1945 because winners went broke, the myth of European invincibility died, colonized veterans came home holding the Allies to their own word about freedom, and the superpowers and UN made colonial rule indefensible in public.',
        'India 1947: Gandhi\'s satyagraha (Salt March, 1930) made rule unworkable — but Partition split India and Pakistan at a cost of roughly a million dead and fifteen million displaced.',
        'Two roads out: negotiated (Ghana 1957, Nkrumah — first in sub-Saharan Africa) and fought (Algeria 1954-1962, Vietnam after Dien Bien Phu, Kenya\'s Mau Mau). Settler populations were the usual difference between them.',
        'Suez (1956) was the pivot: Britain and France seized the canal from Nasser\'s Egypt and were forced to back out under US and Soviet pressure — proof that empires no longer decided anything alone.',
        'The wave: seventeen African nations independent in 1960 alone — the "Year of Africa" — and UN membership roughly tripling by 1975.',
        'Independence was a beginning: inherited borders (Congo, Biafra), extraction economies, and Cold War proxy pressure met responses like Bandung (1955) and the Non-Aligned Movement, pan-Africanism, and import substitution — while South Africa\'s apartheid, imposed in 1948, held out until 1994.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Decolonization & New Nations' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
