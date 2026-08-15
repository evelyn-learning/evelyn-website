/**
 * APUSH Period 3 — Independence and Constitution (1754-1800).
 *
 * French and Indian War, Revolutionary causes/events, Articles, Constitution,
 * Federalist Era. ~12% of exam, recurring DBQ source.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_USH_PERIOD3_INDEPENDENCE: LessonPlan = {
  id: 'evelyn.ap.ush.period3-independence.v1',
  title: 'APUSH Period 3 — Revolution, Constitution, Federalist Era (1754-1800)',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.period3-independence',
      description: 'Trace the political and ideological causes of the American Revolution, evaluate the strengths and weaknesses of the Articles of Confederation, explain the Constitution\'s creation and the Federalist/Anti-Federalist debate, and analyze the policy + party formation of the 1790s.',
      standard: 'APUSH-3.1-3.13',
    },
  ],
  prerequisites: ['apush.period1-encounter'],
  followUps: [],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Period 3 = the highest-yield APUSH unit.',
      script: 'Period 3 is the heart of APUSH — about 12% of MCQs and a frequent DBQ topic. Independence + Constitution + Federalist Era set up every constitutional + political question that follows. Master this period and you handle long-arc essays on federalism, executive power, foreign policy, and party formation cleanly.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-revolution-causes',
      kind: 'concept',
      goal: 'French and Indian War + Imperial Crisis + Revolution.',
      keyIdeas: [
        'FRENCH AND INDIAN WAR (1754-1763): Britain vs France in North America (part of global Seven Years\' War). Britain won; Treaty of Paris 1763 ceded all France\'s North American mainland to Britain.',
        'IMMEDIATE CONSEQUENCES: Britain massively in debt; needed to pay for war + station troops in colonies. PROCLAMATION LINE (1763) banned colonial settlement west of Appalachians (to avoid Native conflict — Pontiac\'s Rebellion 1763). Both irritated colonists.',
        'TAXATION CONFLICTS: Britain imposed taxes WITHOUT colonial representation in Parliament. SUGAR ACT (1764), STAMP ACT (1765 — first internal tax, sparked SONS OF LIBERTY + Stamp Act Congress), TOWNSHEND ACTS (1767), TEA ACT (1773 → BOSTON TEA PARTY), INTOLERABLE/COERCIVE ACTS (1774, in response).',
        'IDEOLOGICAL FRAME: "no taxation without representation" — Whig political theory (Locke + civil-republican) emphasizing consent of governed, virtual vs actual representation debate. Common Sense (Thomas Paine, January 1776) made plain-language case for independence + republic.',
        'COMMITTEES OF CORRESPONDENCE (1772+): inter-colonial coordination via letter. CONTINENTAL CONGRESS first (1774, response to Coercive Acts), second (1775, became revolutionary government).',
        'WAR EVENTS: Lexington + Concord April 1775. Bunker Hill June 1775. Declaration of Independence July 4, 1776 (drafted by Jefferson, edited by Adams + Franklin). SARATOGA October 1777 — turning point, brought FRANCE into the war as US ally (Treaty of Alliance Feb 1778). Yorktown October 1781 — Cornwallis surrendered; British war effort collapsed politically. Treaty of Paris 1783 recognized US independence + boundaries to Mississippi.',
        'KEY FIGURES: George Washington (commander, refused dictatorship), Lafayette + Rochambeau (French aid), Benedict Arnold (defected 1780), Nathanael Greene (Southern strategy).',
      ],
      vocabulary: [
        { term: 'Proclamation Line of 1763', definition: 'British-imposed boundary along Appalachian crest barring colonial settlement westward to avoid conflict with Native nations.' },
        { term: 'no taxation without representation', definition: 'colonial Whig principle that Parliament could not tax colonies whose representatives did not sit in it; key revolutionary slogan.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-articles-constitution',
      kind: 'concept',
      goal: 'Articles weakness, Constitutional Convention, ratification debate.',
      keyIdeas: [
        'ARTICLES OF CONFEDERATION (1781-1789): first US constitution. Each state retained sovereignty; Congress had limited powers — no direct taxation, no commerce regulation, no executive, no national courts, no enforcement mechanism. Required UNANIMITY to amend.',
        'ACHIEVEMENTS under Articles: Treaty of Paris 1783 (peace with Britain), NORTHWEST ORDINANCE 1787 (organized Northwest Territory; banned slavery in new territory; established admission-as-state framework — became APUSH go-to "Articles success").',
        'WEAKNESSES exposed: SHAYS\' REBELLION (1786-1787, MA farmers protesting debt + foreclosures) demonstrated Congress couldn\'t suppress unrest; BARBARY PIRATES extorted tribute; states issued separate currencies; trade wars between states.',
        'CONSTITUTIONAL CONVENTION (May-Sept 1787, Philadelphia): originally to "amend" Articles; instead wrote new Constitution. Madison "Father of Constitution"; Washington presided.',
        'COMPROMISES: VIRGINIA PLAN (Madison, large states — bicameral, population-based) vs NEW JERSEY PLAN (small states — unicameral, state-equal). GREAT/CONNECTICUT COMPROMISE (Sherman): bicameral with House by population + Senate equal per state.',
        'THREE-FIFTHS COMPROMISE: enslaved persons counted as 3/5 of a person for representation + taxation. Inflated Southern political power; embedded slavery in foundational politics.',
        'COMMERCIAL COMPROMISE: Congress could regulate interstate + foreign commerce; couldn\'t tax exports; couldn\'t ban Atlantic slave importation until 1808.',
        'RATIFICATION DEBATE: FEDERALISTS (Hamilton, Madison, Jay; supported Constitution; wrote FEDERALIST PAPERS — 85 essays defending it; Madison #10 on factions, #51 on separation of powers) vs ANTI-FEDERALISTS (Patrick Henry, George Mason, Sam Adams; feared centralized tyranny + lack of bill of rights).',
        'BILL OF RIGHTS (1791, first 10 amendments): Madison drafted to address Anti-Fed concerns. Speech, religion, press, assembly, gun ownership, due process, etc.',
      ],
      vocabulary: [
        { term: 'Articles of Confederation', definition: 'first US constitution (1781-1789); weak central government with no taxation/commerce power; replaced by Constitution.' },
        { term: 'Federalist Papers', definition: '85 essays by Hamilton/Madison/Jay (1787-88) defending the Constitution and arguing for ratification.' },
        { term: 'Three-Fifths Compromise', definition: 'Constitutional clause counting each enslaved person as 3/5 of a person for House apportionment + taxation; embedded slavery in federal politics.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-federalist-era',
      kind: 'concept',
      goal: 'Washington + Adams administrations + party formation.',
      keyIdeas: [
        'WASHINGTON (1789-1797): set precedents for executive — Cabinet structure, two-term limit (broken only by FDR), Farewell Address warning against parties + foreign entanglements.',
        'HAMILTONIAN ECONOMIC PROGRAM: assumption of state debts (assumption), national bank (BANK OF THE UNITED STATES 1791), tariffs to protect industry, whiskey tax. Argued elastic clause + necessary-and-proper for bank — LOOSE construction.',
        'JEFFERSONIAN OPPOSITION: feared concentration of power + commercial elite. Argued bank unconstitutional — STRICT construction. Favored agrarian republic + limited government.',
        'PARTY FORMATION: FEDERALISTS (Hamilton, Adams) — pro-bank, pro-British, pro-merchant, loose construction, strong central govt. DEMOCRATIC-REPUBLICANS (Jefferson, Madison) — anti-bank, pro-French, pro-farmer, strict construction, states\' rights. First party system.',
        'WHISKEY REBELLION (1794): Pennsylvania farmers resisted whiskey tax. Washington personally led federalized militia to suppress. Demonstrated federal authority + capacity, in contrast to Articles.',
        'JAY TREATY (1794, with Britain): resolved post-Revolutionary tensions — Britain evacuated frontier forts, regulated trade. Politically unpopular (perceived as too pro-British).',
        'ADAMS (1797-1801): Federalist. XYZ AFFAIR (1797-98): French ministers demanded bribes from US envoys; provoked QUASI-WAR (undeclared naval conflict with France).',
        'ALIEN AND SEDITION ACTS (1798): Federalist response to dissent — extended naturalization period, allowed deportation of "dangerous" aliens, criminalized criticism of government. Used against Republican newspaper editors. Hugely controversial.',
        'VIRGINIA + KENTUCKY RESOLUTIONS (1798-99, Madison + Jefferson): argued states could NULLIFY unconstitutional federal laws. Foreshadowed nullification crisis (1832) and Civil War.',
        'ELECTION OF 1800: Jefferson defeated Adams. PEACEFUL transfer of power between hostile parties — "Revolution of 1800" Jefferson called it. Cemented constitutional system\'s legitimacy.',
      ],
      vocabulary: [
        { term: 'loose vs strict construction', definition: 'opposed approaches to interpreting the Constitution: loose (Hamilton — implied powers via necessary-and-proper clause) vs strict (Jefferson — only enumerated powers).' },
        { term: 'Whiskey Rebellion', definition: '1794 PA farmers\' uprising against whiskey tax; suppressed by Washington-led militia, demonstrating federal authority.' },
        { term: 'Alien and Sedition Acts', definition: '1798 Federalist laws restricting immigration + criminalizing political criticism; sparked Virginia/Kentucky Resolutions.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How did Hamilton justify the constitutionality of a national bank, and how did Jefferson respond?',
      expectedAnswer: 'HAMILTON (LOOSE construction): argued the NECESSARY-AND-PROPER clause (Article I §8) gave Congress IMPLIED POWERS beyond the enumerated list, as long as those powers were "necessary and proper" for executing enumerated powers. Bank was necessary to manage federal finances + currency + assumption. JEFFERSON (STRICT construction): argued Constitution gave Congress ONLY enumerated powers; "necessary and proper" should be read narrowly as "absolutely indispensable." Bank wasn\'t indispensable, so unconstitutional. Washington sided with Hamilton; signed the bank bill. Set the LOOSE-CONSTRUCTION PRECEDENT that has shaped federal power ever since (e.g., McCulloch v. Maryland 1819 explicitly upheld bank, citing implied powers). The dispute also catalyzed party formation — Federalists vs Democratic-Republicans.',
      responseFormat: 'free',
      hints: [
        'Two readings of "necessary and proper" — wide vs narrow.',
        'Implied powers vs enumerated-only.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-articles-utter-failure',
      kind: 'misconception_check',
      question: 'The Articles of Confederation were a complete failure that produced no lasting accomplishments. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating the Articles as wholly negative.',
          correctsTo: 'False — partly. The Articles had serious weaknesses (no taxation, no commerce regulation, no executive) and Shays\' Rebellion exposed them. BUT Articles-era achievements include: (1) winning the Revolutionary War + negotiating Treaty of Paris 1783; (2) the LAND ORDINANCE OF 1785 (rectangular survey system, set aside lots for schools); (3) the NORTHWEST ORDINANCE OF 1787 — banned slavery in Northwest Territory, set process for new states to enter on equal footing, established religious toleration + due process. The Northwest Ordinance was so consequential it shaped expansion all the way west. APUSH expects nuance: Articles were inadequate for governing a growing nation, but produced lasting territorial framework. Don\'t over-correct in either direction.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'French + Indian War (1763) → British debt → colonial taxes → revolution. Lexington 1775, Independence 1776, Saratoga 1777 (France joins), Yorktown 1781.',
        'Articles 1781-89: too weak (no taxation/commerce). Northwest Ordinance 1787 = key success.',
        'Constitution 1787: Great Compromise (bicameral), 3/5 Compromise, commercial compromise. Federalist Papers (Madison #10, #51) defended ratification.',
        'Bill of Rights 1791. Hamilton\'s program: bank + tariffs + assumption (LOOSE construction) vs Jefferson STRICT construction.',
        'Whiskey Rebellion 1794, XYZ Affair 1798, Alien + Sedition Acts 1798, VA/KY Resolutions, peaceful 1800 transfer.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is Madison\'s Federalist #10 considered one of the most important political theory texts in American history?',
      hint: 'Madison\'s Federalist #10 addressed the central anti-federalist objection: that republics could only survive in small territories (per Montesquieu). Madison REVERSED this, arguing that LARGER republics actually CONTROL the danger of FACTION (groups pursuing self-interest at others\' expense) better than small ones. His argument: in a large diverse republic, no single faction can dominate; factions check each other; representatives filter raw passions. This justified the EXTENDED REPUBLIC of the Constitution and provided a sophisticated answer to the "small republic = liberty" assumption. The argument also implicitly accepts that factions are inevitable + permanent — you don\'t eliminate them, you structure government to balance them. This idea became foundational to American political thought + is cited in debates today (interest-group politics, federalism, Citizens United\'s effect on faction). APUSH DBQs sometimes use Federalist #10 directly as a document.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
