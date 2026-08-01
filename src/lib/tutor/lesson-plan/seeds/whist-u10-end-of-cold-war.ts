/**
 * World History — The Contemporary World: The End of the Cold War.
 *
 * The unit's payoff case: a superpower that looked permanent stalled,
 * reformed, and dissolved in six years — and the Cold War ended without
 * the great-power war everyone had spent forty years fearing. Salvaged
 * factual spine from the legacy world-history end-of-Cold-War seed,
 * reframed subject-first. C3 D2.His.14.9-12, D2.Civ.1.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U10_END_OF_COLD_WAR: LessonPlan = {
  id: 'evelyn.hs.whist.end-of-cold-war.v1',
  title: 'The End of the Cold War',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.end-of-cold-war',
      standard: 'WHIST-10.3',
      description:
        "Explain how Soviet economic stagnation, the costs of superpower rivalry, Gorbachev's reforms, and popular movements across Eastern Europe together ended the Cold War between 1985 and 1991, and evaluate why most of those endings were peaceful while Yugoslavia's was not (C3 D2.His.14.9-12, D2.Civ.1.9-12).",
    },
  ],
  prerequisites: ['whist.decolonization'],
  followUps: ['whist.globalization'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the strangeness visible: a superpower that looked permanent in 1985 did not exist by the end of 1991 — and almost nobody fought over it.',
      script:
        'In 1985, the Soviet Union looked like a permanent feature of the world — half of Europe, a nuclear arsenal that could end civilization, and a government that had survived everything thrown at it for almost seventy years. Every serious planner in Washington and Moscow assumed that if the Cold War ever ended, it would end in fire. Six years later the Soviet Union simply stopped existing. Its flag came down over the Kremlin on December 25, 1991, and no great-power war was fought over it. That is the puzzle for today: how does something that solid come apart that fast — and why did most of these endings happen with crowds and candles instead of tanks, while one of them, in Yugoslavia, ended in massacre?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-end-of-cold-war',
      kind: 'concept',
      goal: "The Soviet system's slow stall, Gorbachev's two reforms and one renunciation, the 1989 cascade, the 1991 dissolution, and the argument historians are still having about why.",
      keyIdeas: [
        'STRONG AT ROCKETS, WEAK AT REFRIGERATORS — the Soviet command economy, where central planners set output targets instead of prices and markets, was genuinely good at concentrating resources on a few state priorities: steel, coal, heavy machinery, tanks, the first satellite (1957) and the first human in space (1961). It was bad at everything that requires variety, quality, and fast change — shoes, food distribution, cars, and above all computers, which spread through Western economies in the 1970s and 1980s while Soviet planners struggled to copy them. By the 1980s, shortages and queues for ordinary goods were normal life.',
        'THE COST OF SUPERPOWER STATUS — the Soviet economy was substantially smaller than the American one, yet it tried to match it weapon for weapon while also subsidizing allied governments across Eastern Europe. The 1970s brought détente, a deliberate thaw: direct summits and arms-control agreements (the SALT talks, beginning with SALT I in 1972) capped some categories of nuclear weapons. Détente eased the rivalry but never ended it, and it collapsed at the end of the decade — the Soviet invasion of Afghanistan in 1979 and a sharp rise in tension and military spending on both sides in the early 1980s.',
        'AFGHANISTAN, 1979-1989 — the USSR sent troops into Afghanistan to prop up a friendly Communist government against a widening insurgency, and stayed for nearly a decade against fighters who were armed and funded from outside, including by the United States. The war was expensive, unwinnable, and increasingly unpopular at home; Soviet forces withdrew in 1989. It did not by itself bring down the Soviet Union, but it drained money, soldiers, and public confidence at exactly the wrong moment.',
        'GLASNOST — Mikhail Gorbachev became Soviet leader in 1985 believing the system could be saved if it were told the truth about itself. Glasnost ("openness") loosened censorship: newspapers could print what had been unprintable, and the Soviet past — famines, purges, deportations — became suddenly speakable. The credibility breaker was the Chernobyl nuclear disaster of April 1986, when the government hid a catastrophe for days while radiation spread. Once people had permission to ask why, they did not stop at 1986.',
        'PERESTROIKA — "restructuring," Gorbachev\'s attempt to fix the economy by loosening central control, allowing limited private cooperatives, and giving factories more autonomy. The problem was sequencing: perestroika dismantled the old commands before any working market existed to replace them. Output fell, shortages worsened, and the reforms produced a system that was neither planned nor market — which discredited the reformer and the system at the same time.',
        'THE RENUNCIATION THAT MATTERED MOST — Soviet control of Eastern Europe had always rested on one implicit promise: Moscow would send tanks. It had, in Hungary in 1956 and in Prague in 1968 (Topic 10.1). This was the Brezhnev Doctrine — the claim that the USSR could intervene militarily to keep an allied Communist government in power. Gorbachev abandoned it, saying openly that each nation should choose its own path. He may have expected reformed Communist governments to survive the choice. That is not what happened.',
        '1989, THE DOMINO YEAR — Poland went first: the Solidarity trade union, led by Lech Walesa and banned since 1981, was legalized and swept the semi-free elections of June 1989. Hungary opened its border with Austria, and East Germans began escaping westward through it — voting with their feet. On November 9, 1989, a muddled East German announcement about travel rules sent crowds to the Berlin Wall; the overwhelmed guards opened the gates, and no tanks came. Czechoslovakia\'s Velvet Revolution put the playwright Vaclav Havel, recently a political prisoner, in the presidency within weeks. Romania was the violent exception: Nicolae Ceausescu\'s government fell after street fighting, and he was executed in December 1989. Germany reunified in October 1990.',
        'THE UNION ITSELF UNRAVELS — AND THE ARGUMENT ABOUT WHY — the same openness that freed Eastern Europe worked inside the USSR: Lithuania, Latvia, and Estonia demanded independence, and other republics followed. In August 1991 hardliners staged a coup to stop the slide; it failed in three days when soldiers would not fire and crowds filled Moscow\'s streets. Authority drained to the republics, and on December 25, 1991, the Soviet flag came down — fifteen independent states where one superpower had been. What followed was uneven: NATO and the European Union expanded eastward, Russia endured a turbulent and impoverishing 1990s, and Yugoslavia broke apart in wars that produced the Srebrenica massacre of 1995 (Topic 9.4) — proof that the peaceful endings of 1989 were an achievement, not a rule. Historians still weigh four explanations against each other — Western and specifically Reagan-era pressure, Gorbachev\'s own choices, people power in the streets, and long-run economic exhaustion — and serious accounts use all four rather than picking one.',
      ],
      vocabulary: [
        { term: 'glasnost', definition: '"openness" — Gorbachev\'s policy of loosening censorship so Soviet problems and Soviet history could be discussed publicly.' },
        { term: 'perestroika', definition: '"restructuring" — Gorbachev\'s attempt to reform the command economy by relaxing central control, which dismantled old mechanisms faster than it built new ones.' },
        { term: 'Brezhnev Doctrine', definition: "the Soviet claim of a right to intervene militarily to keep allied Communist governments in power — enforced in Hungary (1956) and Czechoslovakia (1968), abandoned by Gorbachev in the late 1980s." },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-causal-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did a state that launched the first satellite and matched American missile for missile end up unable to hold its own alliance together by 1989 — without a war being fought over it?',
      steps: [
        'Start with the economic stall, not with any one leader. The command economy could hit a few enormous targets — steel, rockets, warheads — because planners could pour everything into them. It could not deliver variety or keep up with fast-moving technology, so consumer goods stayed scarce and computing fell steadily further behind through the 1970s and 1980s.',
        'Add the fixed costs. A smaller economy was paying for a full arms race plus subsidies to allied governments across Eastern Europe. Détente and the SALT agreements of the 1970s slowed that bill briefly; the Afghanistan war from 1979 and renewed tension in the early 1980s sent it back up. Money and confidence both drained.',
        'Now bring in Gorbachev in 1985. His diagnosis was that the system was salvageable if it stopped lying to itself, so glasnost opened up speech and perestroika loosened economic control. Chernobyl in 1986 proved his point about the lying and destroyed public trust at the same time — and perestroika removed the old commands before anything worked in their place, so shortages got worse, not better.',
        'Follow the consequence into foreign policy — this is the hinge. Eastern European Communist governments had survived on the certainty that Moscow would send tanks, as it had in Hungary in 1956 and Prague in 1968. Gorbachev renounced that guarantee. He did not order the revolutions of 1989; he removed the reason not to attempt them.',
        'Close the chain with 1989 itself. Poland held semi-free elections in June, Hungary opened its border, East Germans left through it, the Berlin Wall opened on November 9 after a bureaucratic fumble met a crowd, and Czechoslovakia changed governments in weeks. The pattern: economic stall → reform that exposed the stall → withdrawn threat of force → people who had always been unwilling now discovering they were also unstopped. Only Romania ended in bloodshed.',
      ],
      answer:
        'A command economy that could not modernize, carrying superpower costs it could not afford, was opened up by reforms that exposed the weakness rather than fixing it — and when Gorbachev withdrew the promise of Soviet tanks, the Eastern European governments that had rested on that promise fell to popular movements within a single year.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-gorbachev-speech',
      kind: 'worked_example',
      problem:
        'In a December 1988 speech to the United Nations, Gorbachev told the world (paraphrased): "Freedom of choice is a universal principle that admits of no exceptions. Force and the threat of force can no longer be instruments of foreign policy." Work out what this sentence actually changed — and what it did not say.',
      steps: [
        'Read it against the rule it replaced. For twenty years the operating principle in Eastern Europe had been the Brezhnev Doctrine: a Communist government in the bloc could count on Soviet troops if its own people turned against it. "Freedom of choice ... admits of no exceptions" cancels precisely that guarantee.',
        'Ask who the audience really was. The speech was delivered to the United Nations, but the people who most needed to hear it were in Warsaw, Budapest, East Berlin, and Prague — both the governments relying on the guarantee and the citizens who had learned in 1956 and 1968 what happened without it.',
        'Notice what the sentence does NOT say. It does not promise elections, it does not dissolve the Warsaw Pact, and it does not predict that Communist governments will lose. Gorbachev appears to have expected reform-minded Communist governments to win a free choice. The words gave away the enforcement mechanism, not the ideology.',
        'Watch the claim get tested. Within a year, Poland held semi-free elections, Hungary opened its western border, and East Germans massed at the Berlin Wall. The test each time was the same: would Soviet troops move? They did not — and once that was demonstrated in one country, the calculation changed in every other one. Words became credible only after 1989 proved them.',
        'Weigh it as evidence. This is a leader stating an intention in public, so it is strong evidence about the policy Gorbachev announced and weaker evidence about what he privately expected or how ordinary people felt. Pair it with what happened next: Yugoslavia, where no outside power was withdrawing a guarantee, still fell into war in the 1990s — a reminder that the absence of tanks made peaceful endings possible, not automatic.',
      ],
      answer:
        'The speech publicly renounced the Brezhnev Doctrine — the promise of Soviet military force to keep allied Communist governments in power — without promising democracy or predicting those governments would fall; it removed the deterrent that had held Eastern Europe since 1956 and 1968, and the revolutions of 1989 followed once people saw the renunciation was real.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-command-economy',
      kind: 'try_yourself',
      problem:
        'The Soviet Union put the first satellite into orbit and built a nuclear arsenal to rival the United States, yet in the 1980s Soviet shoppers queued for basic goods and Soviet computing lagged badly behind the West. What best explains that contradiction?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A command economy could concentrate resources on a few state priorities but handled variety, quality, and fast-changing technology poorly', correct: true },
        { id: 'b', text: 'The Soviet Union lacked natural resources and trained engineers' },
        { id: 'c', text: 'Soviet leaders had replaced central planning with a market economy during the 1970s' },
        { id: 'd', text: 'Other countries refused to trade with the Soviet Union at any point before 1991' },
      ],
      expectedAnswer: 'A command economy could concentrate resources on a few state priorities but handled variety, quality, and fast-changing technology poorly',
      hints: [
        'Ask what a central planner is good at. Hitting one enormous target is a very different job from stocking a million shops with what people actually want.',
        'Rockets need concentration; refrigerators, shoes, and computers need variety and constant adjustment — the second job is the one planning did badly.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-no-tanks',
      kind: 'try_yourself',
      problem:
        'Soviet tanks crushed reform movements in Hungary in 1956 and in Czechoslovakia in 1968. In 1989, comparable movements in Poland, Hungary, and East Germany succeeded. What changed most directly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Gorbachev abandoned the Brezhnev Doctrine, making clear Moscow would not send troops to keep allied Communist governments in power', correct: true },
        { id: 'b', text: 'The Soviet army had been destroyed in Afghanistan and no longer existed' },
        { id: 'c', text: 'Western troops entered Eastern Europe to protect the demonstrators' },
        { id: 'd', text: 'Eastern European Communist parties had voluntarily dissolved themselves in the early 1980s' },
      ],
      expectedAnswer: 'Gorbachev abandoned the Brezhnev Doctrine, making clear Moscow would not send troops to keep allied Communist governments in power',
      hints: [
        'The people and the grievances were not new in 1989. Ask what was different about the response they expected from Moscow.',
        'In 1956 and 1968 the tanks came; in 1989 they did not — that decision was made in Moscow before the crowds gathered.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sequence',
      kind: 'try_yourself',
      problem:
        'A student writes that the Soviet Union collapsed on the night the Berlin Wall opened. Which correction fits the actual sequence of events?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Wall opened in November 1989; the Soviet Union lasted two more years and dissolved in December 1991, after a failed hardliner coup that August', correct: true },
        { id: 'b', text: 'The Soviet Union dissolved in 1987, and the Wall was opened afterward as a result' },
        { id: 'c', text: 'The Wall opened in 1991, in the same week the Soviet Union dissolved' },
        { id: 'd', text: 'The Wall opened in 1989 and the Soviet Union dissolved one month later, in December 1989' },
      ],
      expectedAnswer: 'The Wall opened in November 1989; the Soviet Union lasted two more years and dissolved in December 1991, after a failed hardliner coup that August',
      hints: [
        'Two different things ended: Soviet control over Eastern Europe, and the Soviet Union itself. They did not happen in the same year.',
        'Between the two came German reunification in 1990, Baltic independence movements, and the failed coup of August 1991.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-single-cause',
      kind: 'misconception_check',
      question:
        'A student says: "The Cold War ended for one reason — the United States outspent the Soviet Union and pressured it into collapse." What needs correcting?',
      commonErrors: [
        {
          answer: 'The United States outspent the USSR, and that alone ended the Cold War',
          misconception: 'Collapsing a multi-causal ending into a single external cause, which erases the Soviet and Eastern European decisions and movements that did most of the actual work.',
          correctsTo:
            'Outside pressure is one real factor, not the whole story. Historians weigh at least four: Western military and economic pressure in the early 1980s; Gorbachev\'s own choices from 1985 — glasnost, perestroika, and above all the renunciation of the Brezhnev Doctrine; people power, from Poland\'s Solidarity to the crowds in Leipzig, Prague, and Moscow during the August 1991 coup; and the long-run economic exhaustion of a command system that could build rockets but not modern consumer or computing industries. Serious accounts use all four and argue about the weighting. Notice also which side actually made the decisive moves: the Wall opened because an Eastern government fumbled its own announcement and no Soviet tanks were sent, not because anyone from outside forced it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Soviet command economy was strong at concentrated priorities (steel, rockets, warheads) and weak at consumer goods and computers — a stall that deepened through the 1970s and 1980s while superpower costs and the Afghanistan war (1979-1989) drained resources.',
        "Gorbachev, from 1985, tried to save the system: glasnost opened up speech (Chernobyl, 1986, destroyed the government's credibility) and perestroika dismantled old economic controls without building working replacements.",
        'The decisive move was abandoning the Brezhnev Doctrine — no more Soviet tanks to prop up allied governments, unlike Hungary (1956) and Czechoslovakia (1968).',
        '1989 in order: Poland\'s Solidarity elections (June), Hungary\'s open border, the Berlin Wall opened November 9, Czechoslovakia\'s Velvet Revolution under Vaclav Havel, and violence only in Romania; Germany reunified in 1990.',
        'The USSR itself dissolved on December 25, 1991, after Baltic independence movements and the failed August coup — the Cold War ended without the great-power war everyone had feared, though Yugoslavia\'s violent breakup (Srebrenica, 1995) shows peaceful endings were an achievement, not a guarantee.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'The End of the Cold War' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
