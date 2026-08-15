/**
 * World History — The World at War: Revolution, Depression & the Interwar Years.
 *
 * The twenty years between the wars are one long argument about what
 * happens when an economy collapses under a political system: Russia
 * exits one war into revolution and ends up under Stalin; the 1920s
 * borrow their prosperity; 1929 calls the loan. Democracies that hold
 * and democracies that fall differ by institutions and choices, not by
 * fate — the setup for 9.3. Factual spine salvaged from the legacy
 * world-history interwar seed and rewritten subject-first.
 * C3 D2.His.14.9-12, D2.Eco.15.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U9_INTERWAR_YEARS: LessonPlan = {
  id: 'evelyn.hs.whist.interwar-years.v1',
  title: 'Revolution, Depression & the Interwar Years',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.interwar-years',
      standard: 'WHIST-9.2',
      description:
        "Trace the Russian Revolutions of 1917 and the rise of Stalin's USSR, explain how the Great Depression spread worldwide and strained fragile democracies, and compare the democratic, fascist, and militarist responses to economic collapse between the wars (C3 D2.His.14.9-12, D2.Eco.15.9-12).",
    },
  ],
  prerequisites: ['whist.world-war-i'],
  followUps: ['whist.world-war-ii'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the interwar years as the moment the world found out what an economic collapse does to a political system — and that the answer depended on choices, not fate.',
      script:
        'In 1928, a German family could put money in the bank, vote in free elections, and read whichever newspaper they liked. Five years later, the bank was gone, the newspapers were controlled, and the elections had stopped mattering. Nothing was invaded. No army marched in. What happened in between was an economic collapse that started with a stock market crash in New York — and then travelled by trade, loans, and gold across the whole planet. Some countries came through that collapse still free. Others did not. Today you trace how a currency crisis becomes a political crisis, and why the answer to "could it happen here?" has always depended on what a country does in the first bad year.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-interwar-years',
      kind: 'concept',
      goal: 'The two Russian revolutions and Stalin, the borrowed prosperity of the 1920s, the global Depression, and the four responses to it.',
      keyIdeas: [
        'TWO REVOLUTIONS IN ONE YEAR — the classic confusion. In FEBRUARY 1917 (March by our calendar), bread riots and mutinying soldiers in Petrograd ended 300 years of tsarist rule; Nicholas II abdicated and a liberal PROVISIONAL GOVERNMENT took over. In OCTOBER 1917, Lenin\'s Bolsheviks overthrew that provisional government. Two revolutions, two different targets, eight months apart — Lenin did not overthrow the tsar.',
        'THE FATAL CHOICE — the Provisional Government kept Russia in World War I to honor its alliances. The war was exactly what had broken the country: millions dead, cities starving, soldiers deserting. Lenin offered the opposite in three words — "Peace, Land, Bread" — and in March 1918 delivered the peace at Brest-Litovsk, surrendering enormous territory to Germany to get Russia out of the war.',
        'CIVIL WAR AND A NEW STATE — Reds (Bolsheviks) fought Whites (a mix of monarchists, liberals, and rival socialists, backed by foreign troops) from 1918 to 1921; the Romanov family was executed in 1918; famine and disease killed millions more. The Bolsheviks won, and in 1922 the Union of Soviet Socialist Republics (USSR) was founded.',
        "REVOLUTION FROM ABOVE — Lenin died in 1924; Joseph Stalin outmaneuvered his rivals and by 1928 held power. His FIVE-YEAR PLANS drove state-directed industrialization at extraordinary speed, and FORCED COLLECTIVIZATION seized peasant land into state and collective farms. The human cost was catastrophic and deliberate in part: grain requisitions from Soviet Ukraine produced an engineered famine in 1932-33 known as the Holodomor, killing millions; the Great Terror of 1936-38 executed hundreds of thousands, including most of the army's senior officers; the gulag labor-camp system swallowed millions more. Stated plainly: the USSR did industrialize, and it did so at a human price historians count in the millions.",
        'THE 1920s WERE BORROWED, NOT SOLID — Weimar Germany, crushed by reparations and occupation, printed money until the mark became worthless: in 1923 prices doubled in days, and Germans famously carried wheelbarrows of banknotes to buy bread. Savings evaporated. The currency was rebuilt, and the Locarno treaties (1925) plus American loans bought several genuinely calm, prosperous years — but European recovery now sat on a chain of US credit.',
        'THE CRASH GOES GLOBAL — the US stock market crashed in October 1929. Banks failed, American loans to Europe stopped and were called in, and the gold standard forced governments to defend their currencies instead of their economies. Countries raised tariff walls — the US Smoot-Hawley tariff of 1930 was answered in kind — and world trade fell by roughly two-thirds by 1933. Unemployment hit about 25 percent in the United States and roughly 30 percent in Germany. This was the pressure under which democracies either held or broke.',
        'FOUR RESPONSES, COMPARED — the UNITED STATES answered with the New Deal: relief, public works, bank regulation, and social insurance, all of it enacted through Congress and reviewed by courts — reform WITHIN democracy. ITALY had already gone the other way; Mussolini took power in 1922, before the Depression, and wrote the fascist playbook: extreme nationalism, a cult of the leader, an enemy list topped by communists, and street violence treated as normal politics. GERMANY radicalized after 1930. JAPAN, resource-poor and export-dependent, saw militarist factions gain the upper hand; the army invaded Manchuria in 1931 largely on its own initiative.',
        "HOW HITLER ACTUALLY CAME TO POWER — this is the part students most often get wrong. The Nazis never won a majority in a free election (about 37 percent in July 1932, dropping to 33 percent that November). Hitler was APPOINTED chancellor legally, on 30 January 1933, by President Hindenburg, because conservative elites believed they could use him and control him. Weeks later, after the Reichstag fire, a frightened parliament passed an enabling law handing him the power to rule by decree. Depression unemployment, resentment of the Versailles settlement, a fragmented opposition, and elite miscalculation together made it possible — not an inevitable landslide.",
        "THE DEMOCRACIES FROZE — the League of Nations had no army and no will. It condemned Japan over Manchuria (1931-33) and Japan simply walked out; it imposed leaky sanctions when Italy invaded Abyssinia (Ethiopia) in 1935 and Mussolini conquered it anyway. Britain and France, financially exhausted, politically divided, and haunted by the last war's casualty lists, chose to avoid confrontation — the logic that becomes appeasement in 9.3.",
      ],
      vocabulary: [
        { term: 'collectivization', definition: "the forced merging of private farms into state-run collective farms, imposed in Stalin's USSR from 1929." },
        { term: 'hyperinflation', definition: 'inflation so rapid that money loses value faster than people can spend it — Germany, 1923.' },
        { term: 'fascism', definition: 'a movement built on extreme nationalism, a glorified single leader, hostility to communism and liberal democracy, and the acceptance of political violence.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-crash-to-dictatorship',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did a stock market crash in New York in 1929 help put a dictator in power in Berlin in 1933?',
      steps: [
        "Start with the link nobody sees at first: Germany's 1920s recovery ran on American loans. Those loans paid reparations, propped up the rebuilt currency, and financed German industry.",
        'The crash cuts the wire. After October 1929, US banks stop lending abroad and call in the short-term loans they already made. German credit vanishes almost overnight.',
        "Follow the unemployment. German industry contracts hard; the gold standard and fear of another 1923 push the government toward austerity — cutting spending in a slump. Unemployment climbs toward roughly 30 percent by 1932. Millions of voters conclude the republic cannot feed them.",
        'Follow the votes. Support drains from moderate parties toward both extremes — Nazis and Communists — who between them win enough seats that no ordinary governing majority is possible. Parliament stops functioning; chancellors govern by emergency decree.',
        'Close the chain with the human decision. In January 1933, conservative elites hand Hitler the chancellorship, expecting to steer him. The economic collapse created the opening; the miscalculation walked him through it. Crash to credit freeze to mass unemployment to a broken parliament to an elite bargain.',
      ],
      answer:
        'US credit built the 1920s German recovery; the crash withdrew it, mass unemployment and austerity destroyed faith in the republic, extremist parties paralyzed parliament, and conservative elites then appointed Hitler believing they could control him.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-revolutions',
      kind: 'worked_example',
      problem:
        'A student writes: "In the Russian Revolution of 1917, Lenin overthrew the tsar and immediately created the Soviet Union." Untangle the three separate things collapsed into that one sentence.',
      steps: [
        'Separate the two revolutions. FEBRUARY 1917: bread riots, strikes, and soldiers refusing to fire ended the monarchy. Nicholas II abdicated. Lenin was not even in Russia — he was in exile in Switzerland and returned in April.',
        'Identify what February actually produced: a Provisional Government of liberals and moderate socialists, sharing uneasy authority with the Petrograd Soviet, the workers\' and soldiers\' council. Its fatal decision was to keep fighting World War I.',
        'Now OCTOBER 1917: Lenin\'s Bolsheviks overthrew THAT government, not the tsar. Their slogan "Peace, Land, Bread" targeted precisely what the Provisional Government would not deliver, and in March 1918 they signed the Brest-Litovsk treaty to leave the war.',
        'Add the missing years. Taking Petrograd did not mean ruling Russia: a civil war between Reds and Whites ran from 1918 to 1921, with foreign intervention and mass famine, before Bolshevik control was secure.',
        'Fix the date of the state itself. The USSR was formally founded in 1922 — five years after the revolutions, and two years before Lenin died. So: tsar falls February 1917; Bolsheviks take power October 1917; civil war 1918-21; USSR founded 1922.',
      ],
      answer:
        'Three events, not one: the February 1917 revolution ended the tsar without Lenin; the October 1917 revolution overthrew the Provisional Government; and the USSR was founded only in 1922, after a civil war fought from 1918 to 1921.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-provisional-government',
      kind: 'try_yourself',
      problem:
        'Which decision by the Provisional Government did the most to make the Bolshevik takeover of October 1917 possible?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Choosing to keep Russia fighting in World War I, the very crisis that had toppled the tsar', correct: true },
        { id: 'b', text: 'Restoring Nicholas II to the throne as a constitutional monarch' },
        { id: 'c', text: 'Immediately redistributing all noble estates to the peasants' },
        { id: 'd', text: 'Signing the Treaty of Brest-Litovsk and surrendering territory to Germany' },
      ],
      expectedAnswer: 'Choosing to keep Russia fighting in World War I, the very crisis that had toppled the tsar',
      hints: [
        'Look at what the Bolshevik slogan promised, and ask which of those promises the government in power refused to make.',
        '"Peace, Land, Bread" — the first word is the one the Provisional Government would not say.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-hyperinflation',
      kind: 'try_yourself',
      problem:
        'A German office clerk recalled 1923 (paraphrased): "They paid us twice a day so we could run to the shops before the price rose again. My father\'s pension, saved over thirty years, bought one loaf of bread." What does this account best show about the effects of hyperinflation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It wiped out savings and pensions, shaking middle-class confidence in the Weimar republic', correct: true },
        { id: 'b', text: 'German factories had stopped producing goods entirely' },
        { id: 'c', text: 'The Great Depression had already begun in Germany by 1923' },
        { id: 'd', text: 'The Allies had banned Germans from using their own currency' },
      ],
      expectedAnswer: 'It wiped out savings and pensions, shaking middle-class confidence in the Weimar republic',
      hints: [
        'The clerk still has a job and there is still bread in the shop — so the shortage is not of goods. What exactly failed?',
        'Think about who is hurt most when money loses value: people holding cash, savings, and fixed pensions.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-hitler-power',
      kind: 'try_yourself',
      problem: 'Which statement most accurately describes how Adolf Hitler came to power in Germany?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'He was appointed chancellor legally in January 1933 by conservatives who thought they could control him, without ever winning a majority in a free election', correct: true },
        { id: 'b', text: 'He won an outright majority of German votes in a free election and was elected head of state' },
        { id: 'c', text: 'He seized power in a successful military coup that overthrew the Weimar government' },
        { id: 'd', text: 'He was installed by the League of Nations to enforce the Treaty of Versailles' },
      ],
      expectedAnswer: 'He was appointed chancellor legally in January 1933 by conservatives who thought they could control him, without ever winning a majority in a free election',
      hints: [
        'Check the vote share: the Nazis peaked near 37 percent in July 1932 and fell back that November.',
        'The route to power ran through a legal appointment and a bad bet by elites — not a landslide and not a coup.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-depression-determinism',
      kind: 'misconception_check',
      question:
        'A student concludes: "The Great Depression caused fascism — any country that suffers an economic collapse ends up with a dictator." What needs correcting?',
      commonErrors: [
        {
          answer: 'Economic collapse automatically produces dictatorship',
          misconception:
            'Turning a real pressure into an automatic cause, which erases both the countries that stayed democratic and the specific human decisions that handed power over in the ones that did not.',
          correctsTo:
            'The Depression hit almost everyone, and the outcomes differed. The United States, Britain, France, and the Scandinavian democracies all endured mass unemployment and remained democracies; the US answered with the New Deal, reform passed through its ordinary institutions. Italy had turned fascist in 1922, BEFORE the Depression existed. Where democracy fell, it fell through particular things: a shattered currency and a resented peace settlement in Germany, a fragmented opposition, and elites who chose to appoint Hitler believing they could steer him. Economic collapse is better understood as a solvent — it dissolves confidence in existing institutions. What fills the gap depends on how strong those institutions are and what people in power decide to do.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two Russian revolutions in 1917: February ended the tsar (Lenin absent); October overthrew the Provisional Government, which had fatally chosen to stay in the war. Civil war 1918-21; USSR founded 1922.',
        "Stalin's five-year plans and forced collectivization industrialized the USSR at catastrophic human cost — the engineered Ukrainian famine of 1932-33, the Great Terror of 1936-38, and the gulag.",
        "The 1920s were borrowed: German hyperinflation in 1923, then a recovery resting on American loans, so the 1929 crash cut Europe's lifeline.",
        'The Depression spread by trade, credit, and the gold standard — world trade down about two-thirds, unemployment near 25 percent in the US and 30 percent in Germany.',
        'Four responses: New Deal reform within democracy; Mussolini\'s fascist playbook (from 1922); Hitler appointed legally in January 1933 without ever winning a free-election majority; Japanese militarists invading Manchuria in 1931 — while a toothless League failed over Manchuria and Abyssinia.',
        'The theme: economic collapse dissolves confidence in institutions. What replaces them is decided by institutions and choices, not by fate.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Revolution, Depression & the Interwar Years' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
