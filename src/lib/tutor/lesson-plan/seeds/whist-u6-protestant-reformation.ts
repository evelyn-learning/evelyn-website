/**
 * World History — Renaissance, Reformation & Exploration: The Protestant
 * Reformation.
 *
 * The moment Europe stops having one church. Grievances were centuries
 * old; the question that carries the lesson is why the 1517 spark caught
 * when Wycliffe's and Hus's did not — printing, princes, and an emperor
 * with too many wars. Consequences run forward into 6.3's empires and a
 * century of religious war. Factual spine salvaged from the legacy
 * world-history belief-systems seed and reframed subject-first.
 * C3 D2.His.1.9-12, D2.His.14.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U6_PROTESTANT_REFORMATION: LessonPlan = {
  id: 'evelyn.hs.whist.protestant-reformation.v1',
  title: 'The Protestant Reformation',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.protestant-reformation',
      standard: 'WHIST-6.2',
      description:
        "Explain the long-building grievances behind the Protestant Reformation, analyze why Martin Luther's 1517 challenge split Europe when earlier reformers' did not, and trace the religious, political, and social consequences down to the Peace of Westphalia in 1648 (C3 D2.His.1.9-12, D2.His.14.9-12).",
    },
  ],
  prerequisites: ['whist.renaissance'],
  followUps: ['whist.age-of-exploration'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame 1517 as the moment western Europe stops having one church — and ask why THIS complaint, and not the identical ones before it, broke the continent.',
      script:
        'For roughly a thousand years, western Europe had one church. Whatever your language or king, you were baptized, married, and buried by the same institution — and criticizing it was a dangerous hobby. John Wycliffe tried in the 1300s. Jan Hus tried in the early 1400s and was burned at the stake in 1415 for it. Then a German monk named Martin Luther posted a list of complaints in 1517 — many of them the same complaints — and within a few years Europe had permanently split. Same grievances, wildly different outcome. That gap is the whole lesson: ideas do not spread on their own merit. They spread when technology, money, and politics happen to line up behind them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reformation',
      kind: 'concept',
      goal: 'The accumulated grievances, why 1517 caught fire, the core Protestant claims, how the split multiplied, the Catholic response, and the long consequences.',
      keyIdeas: [
        'THE GRIEVANCES WERE OLD — critics had complained for generations about SIMONY (buying and selling church offices), clergy who held several posts at once and lived in none of them, priests with little training, and Renaissance popes such as Julius II and Leo X who behaved like Italian princes — funding wars, palaces, and artists. Reform-minded Catholics said much of this out loud too; wanting reform did not by itself make you a Protestant.',
        "THE INDULGENCE FLASHPOINT — an indulgence remitted temporal punishment for sins already confessed. The abuse was selling them: in 1517 the friar Johann Tetzel marketed indulgences across German lands to help fund the rebuilding of St. Peter's Basilica in Rome and to repay a bishop's debt for acquiring his office. Luther's objection was that this sold hope for cash and told ordinary Germans their money bought what only God gives.",
        "EARLIER CRITICS SHOW TIMING MATTERS — John Wycliffe in England (1380s) and Jan Hus in Bohemia had already attacked church wealth and pushed Bibles in the people's own language. Hus was executed in 1415 and his movement was contained to Bohemia. Their ideas were not weaker than Luther's; their moment lacked the printing press and lacked princes with a reason to protect them.",
        "1517 AND WHY IT CAUGHT — Luther, a monk and professor at Wittenberg, circulated Ninety-Five Theses in October 1517 as points for academic debate. Printing presses (Gutenberg's movable type, c. 1450 — callback to 6.1) carried them across the German lands in weeks, in cheap pamphlets and in German, not just Latin. At the Diet of Worms in 1521 Luther refused to recant; Emperor Charles V outlawed him — and Prince Frederick the Wise of Saxony hid him anyway.",
        'POLITICS PROTECTED THE PREACHER — German princes had their own motives: a break with Rome meant seizing monastic lands and revenues, and resisting an emperor who wanted them obedient. Charles V, ruler of Spain and the Holy Roman Empire at once, was fighting France and facing Ottoman pressure — Suleiman reached Vienna in 1529 — and never had the free hand to crush the movement early. The Peace of Augsburg (1555) conceded that each German prince would choose Lutheranism or Catholicism for his own territory.',
        "THE CORE PROTESTANT CLAIMS — salvation by FAITH ALONE (sola fide): God's grace is received by trust, not earned by works or purchased; SCRIPTURE ALONE (sola scriptura): the Bible, not church tradition or papal authority, is the final word; and a priesthood of all believers, so ordinary people should read scripture themselves. Hence VERNACULAR Bibles — Luther's German New Testament (1522), later Tyndale's English. Catholic teaching answered that faith and works belong together and that tradition interprets scripture alongside it.",
        "THE SPLIT MULTIPLIES, IT DOES NOT STAY BINARY — once scripture alone was the test, reformers read it differently. John Calvin built a disciplined reformed city in Geneva from 1541, teaching PREDESTINATION (God has already chosen the saved). In England, Henry VIII's break was political and dynastic first: denied an annulment, he had Parliament make the monarch head of the Church of England (1534) and dissolved the monasteries — the same king had written AGAINST Luther in 1521. Anabaptists, Presbyterians, and others followed.",
        "THE CATHOLIC COUNTER-REFORMATION DID BOTH THINGS — the Council of Trent (1545-1563) attacked the abuses (ending the sale of indulgences, requiring seminaries to train priests, ordering bishops to live in their dioceses) while firmly REAFFIRMING contested doctrine: faith and works, seven sacraments, tradition alongside scripture, papal authority. The Jesuits (Society of Jesus, founded by Ignatius of Loyola, approved 1540) became teachers and missionaries — Francis Xavier in India and Japan, Matteo Ricci in China — carrying Catholicism along the trade and empire routes of 6.3.",
        'THE CONSEQUENCES RAN FOR A CENTURY — religion fused with politics and produced war: the French Wars of Religion (including the St. Bartholomew\'s Day Massacre, 1572, ended by the Edict of Nantes, 1598) and the Thirty Years\' War (1618-1648), which devastated the German lands before the Peace of Westphalia in 1648 settled the map. Longer-run: vernacular Bible-reading pushed literacy and schooling upward, printing became normal politics, and Europe permanently lost the idea of one church for everyone.',
      ],
      vocabulary: [
        { term: 'indulgence', definition: 'a remission of temporal punishment for sins already confessed; the practice that drew fire was selling them for money.' },
        { term: 'sola fide / sola scriptura', definition: '"faith alone / scripture alone" — the two core Protestant claims: grace is received by trust, and the Bible is the final authority.' },
        { term: 'Counter-Reformation', definition: "the Catholic Church's response, reforming abuses at the Council of Trent while reaffirming disputed doctrine, and expanding through new orders such as the Jesuits." },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-why-1517',
      kind: 'worked_example',
      problem:
        'Jan Hus made criticisms much like Luther\'s and was executed in 1415; his movement stayed inside Bohemia. Luther made his in 1517 and Europe split permanently. Build the comparison step by step: what was different about 1517?',
      steps: [
        'Rule out the easy answer first: "Luther\'s ideas were better" explains nothing. Both men attacked church wealth, indulgence-selling, and the gap between clergy and scripture; both wanted the Bible in the local language. Hold the IDEAS constant and look at what changed around them.',
        'Technology: Hus wrote before movable-type printing was in use in Europe. Luther wrote after. His Ninety-Five Theses were printed and reprinted across the German lands within weeks, and his later pamphlets sold in the hundreds of thousands — cheap, short, and in German. Church authorities could silence a preacher; they could not recall a press run.',
        'Political cover: Hus was summoned, condemned, and burned in 1415 with no prince strong enough or motivated enough to shield him. Luther was outlawed at Worms in 1521 — and Frederick the Wise of Saxony immediately hid him at the Wartburg. Dozens of German princes then had reasons of their own to break: monastic lands, church revenues, and independence from the emperor.',
        'The enforcer was busy: Charles V ruled Spain and the Holy Roman Empire at once, and spent the crucial decades at war with France and under Ottoman pressure — Suleiman besieged Vienna in 1529. Crushing a religious movement inside Germany would have taken sustained force he could never spare, and by 1555 the Peace of Augsburg conceded the point.',
        'Close the comparison: the variable that changed was not the argument but its carriers — printing to spread it faster than it could be suppressed, princes with a material interest in protecting it, and an emperor too stretched to stop either.',
      ],
      answer:
        'Not better ideas — better conditions: printing spread Luther faster than censorship could work, German princes had political and financial motives to protect him, and Charles V was too committed elsewhere to crush the movement while it was small.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-theses-source',
      kind: 'worked_example',
      problem:
        'Two of Luther\'s Ninety-Five Theses, paraphrased in plain modern English: "Any Christian who is truly sorry for sin already has full pardon from God, with or without a letter of indulgence." And: "Why does the pope, whose wealth today exceeds that of the richest men, build the basilica of St. Peter with the money of poor believers rather than with his own?" What does this short pair of statements tell us about the Reformation\'s causes?',
      steps: [
        'Identify the speaker and setting: Martin Luther, a monk and university professor at Wittenberg, writing in 1517 as debating points for other scholars — not, at this stage, a declaration of a new church.',
        'Read the first statement for THEOLOGY: pardon depends on genuine repentance, and God grants it directly. That is the seed of salvation by faith alone, and it makes the purchased certificate spiritually beside the point.',
        'Read the second statement for MONEY AND RESENTMENT: it names where German coins were going — a building project in Rome — and points at papal wealth. This is a grievance about a wealthy, distant institution taxing poorer regions, which is exactly why German princes and townspeople found it useful.',
        'Notice what the pair does together: it fuses a doctrinal argument to an economic and regional complaint. A purely theological dispute stays in the universities; a purely economic one stays local. Fused, it reaches scholars, princes, and townspeople at the same time.',
        'Weigh the limits of two sentences: this is Luther arguing, not a neutral report. Church defenders replied that indulgences were being misrepresented by sellers such as Tetzel rather than being wrong in principle, and the Council of Trent later ended the sale while keeping the doctrine. Use the paraphrase as evidence of what critics claimed, not as proof the claims were fully accurate.',
      ],
      answer:
        'The pair shows the Reformation\'s two engines locked together: a theological claim that God pardons the truly repentant directly, and a regional-economic grievance that German money was funding Roman building — which is why the argument recruited princes and townspeople, not just theologians.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-spread',
      kind: 'try_yourself',
      problem:
        "Wycliffe and Hus attacked church wealth and indulgences more than a century before Luther without splitting Europe. Which best explains why Luther's 1517 challenge spread so far, so fast?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Printing presses carried his writings across the German lands within weeks, and German princes had political and financial reasons to protect him', correct: true },
        { id: 'b', text: 'Luther was the first person in Europe to criticize church practices' },
        { id: 'c', text: 'Emperor Charles V converted and enforced Lutheranism throughout his empire' },
        { id: 'd', text: 'The Peace of Westphalia guaranteed protection to reformers' },
      ],
      expectedAnswer: 'Printing presses carried his writings across the German lands within weeks, and German princes had political and financial reasons to protect him',
      hints: [
        'Hold the ideas constant — they were roughly the same. What was available in 1517 that was not available in 1415?',
        'One answer is a machine and one is a motive: cheap printed pamphlets, plus princes who gained land and independence by breaking with Rome.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-henry-viii',
      kind: 'try_yourself',
      problem:
        'In 1534 Parliament made Henry VIII head of the Church of England, breaking with Rome. What best explains this break?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A dynastic and political dispute — the pope refused to annul his marriage, so the king took authority over the English church himself', correct: true },
        { id: 'b', text: "Henry adopted Calvin's doctrine of predestination and rebuilt English worship around it" },
        { id: 'c', text: 'English peasants forced the change after an uprising demanding vernacular Bibles' },
        { id: 'd', text: "Henry had been Luther's public champion since 1517 and finally acted on his beliefs" },
      ],
      expectedAnswer: 'A dynastic and political dispute — the pope refused to annul his marriage, so the king took authority over the English church himself',
      hints: [
        'Ask what Henry actually wanted changed: church authority, or church doctrine?',
        "Remember that this same king had published a book attacking Luther in 1521 — the English break began over who governs the church, not over faith alone.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-trent',
      kind: 'try_yourself',
      problem: 'Which best describes what the Council of Trent (1545-1563) did in response to the Protestant challenge?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Reformed abuses such as indulgence selling and untrained clergy while reaffirming disputed Catholic doctrine, including faith together with works', correct: true },
        { id: 'b', text: 'Accepted salvation by faith alone and scripture alone in order to reunite with Protestants' },
        { id: 'c', text: 'Abolished the papacy and handed authority to national churches' },
        { id: 'd', text: "Met after the Peace of Westphalia to end the Thirty Years' War" },
      ],
      expectedAnswer: 'Reformed abuses such as indulgence selling and untrained clergy while reaffirming disputed Catholic doctrine, including faith together with works',
      hints: [
        'Trent did two things at once — check whether an answer covers both the housecleaning and the doctrine.',
        'It conceded the practices critics attacked but held firm on the beliefs they attacked; and it met a century before 1648.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-luther-intent',
      kind: 'misconception_check',
      question:
        'A student writes: "The Reformation happened because Luther wanted to start his own church, and the Catholic Church refused to change anything." What needs correcting?',
      commonErrors: [
        {
          answer: 'Luther set out to found Protestantism, and Catholicism never reformed',
          misconception:
            'Reading the outcome backward into the intention, and treating the Catholic response as pure resistance — missing that Luther began as a reformer inside the church and that the church did carry out substantial internal reform.',
          correctsTo:
            "Two corrections. First, intent: in 1517 Luther circulated the Ninety-Five Theses as points for academic debate about indulgences; the break came step by step through excommunication and his outlawing at Worms in 1521. Founding a separate church was an outcome, not a starting plan. Second, the Catholic response was not simply refusal: the Council of Trent (1545-1563) ended the sale of indulgences, required seminaries to train priests, and made bishops reside in their dioceses — real reform of the practices critics attacked — while firmly reaffirming the doctrines Protestants rejected. Both sides argued in good faith from genuinely different readings of scripture and authority; describe each position as its holders stated it.",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Grievances were old — simony, absentee and untrained clergy, worldly Renaissance popes, and indulgence sales (Tetzel, 1517, funding St. Peter's) — and Wycliffe and Hus had voiced them a century earlier.",
        'Why 1517 caught: printing spread the Ninety-Five Theses in weeks, German princes gained lands and independence by protecting Luther, and Charles V was too stretched by France and Ottoman pressure to crush the movement early.',
        'Core Protestant claims: salvation by faith alone, scripture alone, and Bibles in the vernacular — against Catholic teaching that faith and works, scripture and tradition, belong together.',
        "The split multiplied: Calvin's Geneva and predestination; Henry VIII's break in England for political and dynastic reasons, not doctrinal ones.",
        'The Counter-Reformation did both: the Council of Trent (1545-1563) reformed abuses while reaffirming doctrine, and the Jesuits taught and carried Catholicism worldwide — feeding straight into 6.3.',
        "Consequences: a century of religious war ending at the Peace of Westphalia (1648), a literacy push from vernacular Bible-reading, and the permanent end of one church for all of western Europe.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'The Protestant Reformation' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
