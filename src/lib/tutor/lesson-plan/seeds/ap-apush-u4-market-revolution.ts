/**
 * AP US History — CED Unit 4.5-4.7: The Market Revolution.
 *
 * Period-4 content plan (follows the causes-of-revolution calibration
 * template — see ap-apush-u3-causes-of-revolution.ts for the full
 * rationale). Covers the transportation revolution (the Erie Canal),
 * the Lowell mill system, interchangeable parts, the shift to
 * commercial agriculture, Irish and German immigration, and the "cult
 * of domesticity" that accompanied the separation of home and work.
 *
 * No passage wired for this plan (per the Period-4 content-plan spec) —
 * the worked example instead analyzes a data comparison of the market
 * revolution's uneven regional reach, addressing the plan's misconception
 * directly through evidence rather than a quoted document.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U4_MARKET_REVOLUTION: LessonPlan = {
  id: 'evelyn.ap.apush.market-revolution.v1',
  title: 'U4.5 The Market Revolution',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.market-revolution',
      description:
        'Explain the causes and effects of the Market Revolution, including the transportation revolution (the Erie Canal), the factory system (Lowell mills, interchangeable parts), the shift toward commercial agriculture, Irish and German immigration, and the emerging cult of domesticity, and evaluate the unevenness of its regional and social reach.',
      standard: 'AP-APUSH-4.5',
    },
  ],
  prerequisites: ['apush.jefferson-era'],
  followUps: ['apush.jacksonian-democracy'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the shift from household self-sufficiency to a cash market economy feel like a genuine transformation of daily life, not a background detail.',
      script:
        "In 1800, most American families grew their own food, spun their own thread, and rarely handled cash at all — they were largely self-sufficient. By 1840, a farm family in upstate New York might be growing wheat specifically to sell in New York City, buying factory-made cloth instead of weaving it, and reading news that arrived by canal boat in days instead of by wagon in weeks. Nothing about human nature changed in those forty years. What changed was a network — canals, then railroads; factories, then wage labor; markets that stretched from a local town to the whole Atlantic seaboard. Today we're tracing how the Market Revolution rewired how ordinary Americans worked, lived, and even organized their own families — and why some regions transformed radically while others barely changed at all.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-market-revolution',
      kind: 'concept',
      goal: 'Explain the transportation revolution, the factory system, commercial agriculture, immigration, and the cult of domesticity as interconnected pieces of the Market Revolution.',
      keyIdeas: [
        "THE TRANSPORTATION REVOLUTION: a wave of infrastructure building connected once-isolated regions to national markets. The ERIE CANAL (completed 1825), linking the Hudson River to Lake Erie, cut the cost and time of shipping goods between the Midwest and New York City dramatically, turning New York into the nation's leading port and setting off a canal-building boom across other states. Railroads expanded even further in the following decades, reaching areas canals could not.",
        "THE FACTORY SYSTEM AND INTERCHANGEABLE PARTS: the LOWELL MILLS (Massachusetts, beginning in the 1820s) pioneered a factory system employing young unmarried women (\"Lowell girls\") recruited from New England farms, housed in company boardinghouses, and paid wages to produce textiles at a scale impossible for individual households. Separately, INTERCHANGEABLE PARTS — standardized, identical machine-made components that could be assembled or repaired without custom-fitting each piece — made mass production of firearms and other goods dramatically faster and cheaper, a manufacturing innovation associated with figures like Eli Whitney.",
        "COMMERCIAL AGRICULTURE: farmers increasingly shifted from subsistence farming (growing food mainly for their own family's use) to COMMERCIAL AGRICULTURE — growing cash crops for sale in distant markets, made possible by the new transportation network. A farmer in Ohio could now profitably grow wheat for sale in New York City, tying rural households directly into the national market for the first time.",
        "IRISH AND GERMAN IMMIGRATION: the 1830s-1840s saw a sharp rise in immigration, especially Irish Catholics (fleeing poverty and, later, the Great Famine) and Germans (fleeing economic hardship and political upheaval). Irish immigrants concentrated heavily in Eastern port cities and provided crucial labor for canal and railroad construction and factory work; this influx also provoked nativist backlash from some native-born Protestant Americans.",
        "THE CULT OF DOMESTICITY: as wage labor moved men (and some unmarried women) out of the household and into factories, offices, and workshops, a new ideology arose idealizing a SEPARATE SPHERE for middle-class white women — the home — as a moral sanctuary the woman was responsible for maintaining, distinct from the competitive, cash-driven world of work. This ideal did not describe most working-class, immigrant, enslaved, or rural women, whose labor remained economically essential to their households.",
        "THE MARKET REVOLUTION'S UNEVEN REACH: these changes did not touch the whole country equally or all at once. The Northeast urbanized and industrialized fastest; the Midwest was reshaped mainly by commercial agriculture and canal/rail access; large parts of the rural South and the trans-Appalachian frontier remained comparatively untouched by wage-factory labor for decades, continuing to rely on a plantation-slave agricultural economy oriented toward staple-crop exports rather than domestic industrial wage work.",
      ],
      vocabulary: [
        {
          term: 'Erie Canal',
          definition:
            "canal completed in 1825 linking the Hudson River to Lake Erie, dramatically cutting the cost and time of shipping goods between the Midwest and New York City and setting off a broader canal-building boom.",
        },
        {
          term: 'Lowell mills',
          definition:
            "Massachusetts textile factories (from the 1820s) that pioneered a factory system employing young, unmarried New England women housed in company boardinghouses — an early large-scale application of wage labor outside the household.",
        },
        {
          term: 'interchangeable parts',
          definition:
            "standardized, identical machine-made components that could be assembled or repaired without custom-fitting, enabling faster, cheaper mass production of goods like firearms.",
        },
        {
          term: 'commercial agriculture',
          definition:
            "farming oriented toward growing cash crops for sale in distant markets, rather than subsistence farming for a household's own use — enabled by the new transportation network.",
        },
        {
          term: 'cult of domesticity',
          definition:
            "the emerging ideology that idealized a separate domestic sphere for middle-class white women as men's (and some women's) labor moved into wage work outside the home; it did not describe most working-class, immigrant, enslaved, or rural women's lives.",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-uneven-reach',
      kind: 'worked_example',
      problem:
        "Consider this regional comparison: by the 1840s, the Northeast had extensive canal and rail networks, a growing factory workforce, and a rising urban population; the rural South, by contrast, still relied overwhelmingly on plantation agriculture worked by enslaved labor, with comparatively little factory-based wage industry. Explain why the Market Revolution transformed these two regions so differently, and what this reveals about the Market Revolution's actual reach.",
      steps: [
        'START WITH THE COMPARISON ITSELF. Two regions of the same country, in the same decades, experiencing very different economic transformations — one significant piece of evidence already tells you the Market Revolution was not a single, uniform national event.',
        "IDENTIFY WHAT DROVE NORTHEAST TRANSFORMATION. The Erie Canal and expanding rail lines gave the Northeast direct, cheap access to national and Atlantic markets, which made factory investment (like the Lowell mills) profitable — capital, waterpower, and a labor supply of young rural women and, increasingly, immigrants concentrated there.",
        "IDENTIFY WHY THE SOUTH TRANSFORMED DIFFERENTLY, NOT SIMPLY 'LESS.' The South's existing agricultural economy — especially cotton, worked by enslaved labor — was already highly profitable and oriented toward export markets (mainly to Britain). Planters had strong economic incentive to reinvest in more land and more enslaved labor rather than in factories, so the region's market integration deepened along an agricultural-export axis rather than an industrial-wage axis.",
        "NAME THE MISCONCEPTION THIS CORRECTS. It is tempting to describe the Market Revolution as something that industrialized 'the whole country,' with the South simply lagging behind on the same path. That is inaccurate: the South was fully integrated into a market economy — through the international cotton trade — but along a different track that reinforced plantation slavery rather than replacing it with wage labor.",
        'CONNECT TO THE BROADER PATTERN. The same unevenness shows up west of the Appalachians too: areas with canal or rail access commercialized quickly (Ohio wheat farmers selling to Eastern cities); areas without it changed far more slowly. Access to transportation infrastructure, not simple regional character, is the key variable explaining where and how fast market integration occurred.',
        "STATE THE LINK TO THE COURSE THESIS. The Market Revolution reorganized how Americans worked and lived, but it did so unevenly — deepening wage-factory labor in the Northeast, commercial grain farming in parts of the Midwest, and export-oriented plantation slavery in the South, rather than converting the whole country to a single industrial model.",
      ],
      answer:
        "The Northeast and the rural South both became more deeply tied to national and international markets by the 1840s, but along very different tracks. The Northeast's canal and rail access made factory investment profitable, producing the Lowell-mill-style wage-labor system and rapid urbanization. The South's existing plantation economy — especially cotton, worked by enslaved labor — was already highly profitable for export to markets like Britain, so planters reinvested in more land and enslaved labor rather than in factories; its market integration deepened along an agricultural-export axis, not an industrial-wage axis. This shows the Market Revolution did not industrialize the whole country evenly: transportation access, not a single uniform national shift, determined whether a region moved toward wage-factory labor, commercial farming, or (in the South's case) an intensified slave-based export economy.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE specific development of the transportation revolution or the factory system during the Market Revolution. (b) Briefly explain ONE effect of that development on how Americans worked or produced goods. (c) Briefly explain ONE way the Market Revolution's effects were unevenly distributed across regions or social groups.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine Market Revolution development — the Erie Canal (1825), the Lowell mill factory system, or interchangeable parts. No credit for a vague statement ("technology improved") with no specific development named.',
            modelResponse:
              'One development was the Erie Canal, completed in 1825, which linked the Hudson River to Lake Erie and dramatically cut the cost and time of shipping goods between the Midwest and New York City.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate effect of the named development on work or production — e.g. the Erie Canal enabling commercial agriculture and Midwest-to-Northeast trade, or the Lowell mills introducing large-scale wage labor outside the household. No credit for a disconnected or vague effect.',
            modelResponse:
              "The Erie Canal made it profitable for Midwestern farmers to shift toward commercial agriculture, growing cash crops like wheat specifically for sale in Eastern cities rather than mainly for their own household's use.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate example of uneven distribution — e.g. the Northeast industrializing and urbanizing far faster than the rural South or trans-Appalachian frontier, or the cult of domesticity describing middle-class white women's lives but not those of working-class, immigrant, or enslaved women. No credit for a vague or unsupported claim.",
            modelResponse:
              "The Market Revolution's factory-wage economy transformed the Northeast rapidly through mills like Lowell's, but the rural South remained oriented around plantation agriculture worked by enslaved labor rather than wage-factory labor, showing the transformation did not reach all regions the same way or at the same pace.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-uniform-industrialization',
      kind: 'misconception_check',
      question:
        "True or false: the Market Revolution industrialized the whole country evenly, converting all regions to the same factory-wage-labor economy by the mid-1800s.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Treating a major economic transformation as automatically nationwide and uniform, rather than checking which regions had the transportation access and existing economic structures that shaped how (and how fast) they changed.",
          correctsTo:
            "FALSE. The Market Revolution transformed different regions along different tracks, at different speeds. The Northeast, with canal and rail access, industrialized fastest, producing wage-factory labor systems like the Lowell mills. Parts of the Midwest were reshaped mainly through commercial agriculture enabled by canal access, not factories. The rural South, by contrast, remained oriented around plantation agriculture worked by enslaved labor — fully integrated into international markets through cotton exports, but along an agricultural-export track rather than an industrial-wage one. Treating the Market Revolution as a single uniform national event erases exactly the regional variation AP US History expects you to explain.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Erie Canal (1825) and later railroads connected once-isolated regions to national markets, enabling commercial agriculture far from Eastern cities.',
        'The Lowell mills pioneered factory-based wage labor (young, unmarried New England women); interchangeable parts enabled faster, cheaper mass production.',
        'Irish and German immigration surged in the 1830s-40s, providing labor for canal/rail construction and factories, and provoking nativist backlash.',
        'The cult of domesticity idealized a separate home sphere for middle-class white women as wage work moved outside the household — it did not describe most working-class, immigrant, or enslaved women\'s lives.',
        'The Market Revolution did NOT industrialize the whole country evenly: the Northeast industrialized fastest, while the South deepened a plantation-slave export economy instead of a wage-factory one.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.5-4.7',
    cedTitle: 'The Market Revolution',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP US History' }],
  },
};
