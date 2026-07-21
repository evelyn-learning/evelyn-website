import type { Passage } from '../types';

/**
 * AP U.S. History — Practice Exam A stimuli (mock exam).
 *
 * Coverage: 15 MCQ stimulus passages (`-st01` … `-st15`, spread across
 * Periods 1-9 to anchor the 55-item MCQ stimulus sets), 2 SAQ stimuli
 * (`-saq1` secondary-source historian's argument, `-saq2` primary source),
 * and 1 compiled DBQ packet (`-dbq-packet`, Document 1..7 on the Progressive
 * Era). None of these reuse an existing store passage id.
 *
 * PD-vs-original policy (guardrail 8): to avoid presenting paraphrase as
 * quotation, nearly every stimulus is either an EXPLICITLY FICTIONAL/composite
 * original document (license 'internal-original', "composed for this exam")
 * or a DESCRIBED visual/table/map (also internal-original). Only two verbatim
 * public-domain texts are quoted, both canonical and well-known near-verbatim:
 * the Declaration of Independence (1776, st03) and the Nineteenth Amendment
 * (1920, DBQ Document 7). Everything else is original — no "adapted from"
 * pseudo-quotation anywhere. Every MCQ set built on these passages requires
 * INTERPRETING the source or supplying outside context (no "which phrase
 * appears in the excerpt" items), so no stimulus leaks its items' keys.
 */
export const APUSH_MOCK_A_PASSAGES: Passage[] = [
  // ── st01 · Period 1 (1491-1607) · described table (Columbian Exchange) ──
  {
    id: 'evelyn.passage.apush-mock-a-st01.v1',
    title: 'The Columbian Exchange (data table described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The table below, compiled for this exam, summarizes major biological transfers between the Eastern and Western Hemispheres after 1492.\n\n` +
      `TRANSFERS FROM THE AMERICAS TO EUROPE, AFRICA, AND ASIA\n` +
      `Crops: maize (corn), potatoes, tomatoes, cacao, tobacco\n` +
      `Effect noted by historians: new calorie-rich crops such as potatoes and maize contributed to sustained population growth in Europe, Africa, and China over the following centuries.\n\n` +
      `TRANSFERS FROM EUROPE AND AFRICA TO THE AMERICAS\n` +
      `Animals: horses, cattle, pigs, sheep\n` +
      `Crops: wheat, rice, sugarcane\n` +
      `Diseases: smallpox, measles, influenza\n` +
      `Effect noted by historians: Indigenous American populations, having no prior exposure and thus little immunity, suffered catastrophic mortality — in many regions losing well over half their people within a century of contact. Horses reintroduced to the Great Plains later reshaped the mobility and hunting practices of several Native nations.\n\n` +
      `The table also notes that sugar cultivation transferred to the Americas relied increasingly on the forced labor of enslaved Africans.`,
    lineNumbered: false,
    wordCount: 190,
  },

  // ── st02 · Period 2 (1607-1754) · fictional Chesapeake planter's letter ──
  {
    id: 'evelyn.passage.apush-mock-a-st02.v1',
    title: 'Letter of a Chesapeake tobacco planter (fictional, composed for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'letter',
    fullText:
      `The following is a fictional letter, composed for this exam, in the voice of a Virginia tobacco planter writing to his brother in England around 1710. It is an original composition, not a transcription of any real document.\n\n` +
      `Brother — Our tobacco fills the ships again this season, though the price the merchants offer falls a little each year. You ask why I have laid out so much of my estate to purchase enslaved Africans rather than take on more servants from home as our father did. The truth is that the servants who once came for a term of years, and then claimed their freedom dues and land at the end of it, have grown scarce and troublesome. After the late rising here — when landless men who had finished their service marched against the governor and burned Jamestown — the better sort among us resolved that a laboring people held for life, and their children after them, would be both more profitable and more governable than free men hungry for land of their own.\n\n` +
      `And so our county fills with great tobacco estates worked by enslaved hands, while the small men drift to the frontier. I do not write this with an easy heart, but I write it plainly, as the way our country now runs.`,
    lineNumbered: false,
    wordCount: 220,
  },

  // ── st03 · Period 3 (1754-1800) · Declaration of Independence (PD, verbatim) ──
  {
    id: 'evelyn.passage.apush-mock-a-st03.v1',
    title: 'Declaration of Independence (excerpt)',
    author: 'Thomas Jefferson and the Second Continental Congress',
    year: 1776,
    sourceUrl: 'https://www.archives.gov/founding-docs/declaration-transcript',
    license: 'public-domain',
    genre: 'document',
    fullText:
      `We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.\n\n` +
      `That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed, — That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness.\n\n` +
      `Prudence, indeed, will dictate that Governments long established should not be changed for light and transient causes; and accordingly all experience hath shewn, that mankind are more disposed to suffer, while evils are sufferable, than to right themselves by abolishing the forms to which they are accustomed.`,
    lineNumbered: true,
    wordCount: 165,
  },

  // ── st04 · Period 3 (1754-1800) · fictional ratifying-convention delegate ──
  {
    id: 'evelyn.passage.apush-mock-a-st04.v1',
    title: "Notes of a state ratifying-convention delegate (fictional, composed for this exam)",
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'document',
    fullText:
      `The following notes are a fictional original composition, written for this exam in the voice of a delegate to a state convention debating ratification of the proposed federal Constitution in 1788. It is not a transcription of any real speech.\n\n` +
      `Mr. President, we are told that the Confederation has failed us — that Congress cannot pay the soldiers who won our independence, cannot answer the risings of debtors in Massachusetts, cannot compel a single state to honor the requisitions it owes. All this I grant. A government that can only beg is no government.\n\n` +
      `Yet I cannot give my voice freely to this new plan. It raises a distant national authority that may tax us directly, keep armies in peacetime, and override our own assemblies — and it does so without one line securing the trial by jury, the liberty of the press, or the rights of conscience that our state constitution guards. Ratify it if we must, for the Union's sake; but let us demand, as the price of our assent, that amendments be added at once to bind this new power within known limits.`,
    lineNumbered: false,
    wordCount: 195,
  },

  // ── st05 · Period 4 (1800-1848) · described table (transportation/market rev.) ──
  {
    id: 'evelyn.passage.apush-mock-a-st05.v1',
    title: 'Travel and freight in the early Republic (data table described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The table below, compiled for this exam, illustrates changes in transportation in the northern United States between 1800 and 1840.\n\n` +
      `APPROXIMATE TRAVEL TIME, NEW YORK CITY TO BUFFALO\n` +
      `1800: about three weeks by wagon road\n` +
      `1840: about five days, chiefly by the Erie Canal and connecting steamboats\n\n` +
      `APPROXIMATE COST TO SHIP ONE TON OF FREIGHT, BUFFALO TO NEW YORK CITY\n` +
      `Before the Erie Canal (opened 1825): roughly \$100 by overland wagon\n` +
      `After the canal: roughly \$10\n\n` +
      `MILES OF RAILROAD TRACK IN OPERATION, UNITED STATES\n` +
      `1830: fewer than 40 miles\n` +
      `1840: about 2,800 miles\n\n` +
      `Historians associate these changes with a broad "market revolution" in which farm households in the interior increasingly produced crops and goods for distant cash markets rather than for local use.`,
    lineNumbered: false,
    wordCount: 165,
  },

  // ── st06 · Period 4 (1800-1848) · fictional reform-society circular ──
  {
    id: 'evelyn.passage.apush-mock-a-st06.v1',
    title: 'Circular of a moral-reform society (fictional, composed for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'document',
    fullText:
      `The following is a fictional original circular, composed for this exam in the voice of a Northern moral-reform society of the 1830s. It is not a transcription of any real document.\n\n` +
      `FRIENDS OF HUMAN IMPROVEMENT — The same awakening of the spirit that has filled our meeting-houses now calls us to labor for the perfecting of society itself. If men and women can be reborn in their hearts, then surely the institutions among which they live can be reformed as well.\n\n` +
      `We therefore pledge ourselves: to the cause of temperance, that the laboring man's wages may clothe his children rather than enrich the tavern-keeper; to the building of common schools open to every child; to the humane care of the insane and the imprisoned, who have too long been hidden away and forgotten; and — most solemnly — to the day when no human being shall be held as property upon American soil. Let none say that these are matters for government alone. They are the duty of every awakened conscience.`,
    lineNumbered: false,
    wordCount: 175,
  },

  // ── st07 · Period 5 (1844-1877) · described map (mid-century expansion) ──
  {
    id: 'evelyn.passage.apush-mock-a-st07.v1',
    title: 'United States territorial growth, 1845-1853 (map described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The map described below was prepared for this exam. It shows the continental United States as it stood after the acquisitions of the 1840s and early 1850s.\n\n` +
      `A shaded band across the far West marks the lands the United States took from Mexico in the Mexican Cession of 1848, following the U.S.-Mexican War, together with the annexation of Texas (1845) and the Oregon Territory secured by treaty with Britain (1846). Arrows on the map trace overland trails carrying settlers westward toward California and Oregon.\n\n` +
      `A heavy dashed line runs westward across the new territories at the latitude 36°30′. A caption beside it reads: "The question that consumed Congress after 1846 was not whether the nation would expand, but whether the vast new territory would be open or closed to slavery — a question the Missouri Compromise line had been drawn to settle a generation earlier, and which expansion now reopened."`,
    lineNumbered: false,
    wordCount: 165,
  },

  // ── st08 · Period 5 (1844-1877) · fictional Union soldier's letter ──
  {
    id: 'evelyn.passage.apush-mock-a-st08.v1',
    title: "Letter of a Union soldier (fictional, composed for this exam)",
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'letter',
    fullText:
      `The following is a fictional letter, composed for this exam in the voice of a Union soldier writing home early in 1863. It is an original composition, not a transcription of any real letter.\n\n` +
      `Dear Mother — You write that some of our neighbors grumble at the President's new Proclamation, and say they enlisted to save the Union and not to free the slaves. I confess I once thought as they did. But I have marched now through the plantations of the South, and I have seen with my own eyes the thing that this war is truly about.\n\n` +
      `I have come to believe that the Union we are fighting to save cannot be the same Union as before — that so long as one half of the country is built on holding men in bondage, there will be no lasting peace between the sections. The Proclamation has made our cause larger than it was. The contrabands who come into our lines by the hundreds ask only to work, and many of the men now say they would gladly see them carry a musket beside us. Save your prayers for a quick end, and for a Union worth the saving.`,
    lineNumbered: false,
    wordCount: 200,
  },

  // ── st09 · Period 6 (1865-1898) · described table (industrial growth) ──
  {
    id: 'evelyn.passage.apush-mock-a-st09.v1',
    title: 'Industrial growth in the Gilded Age (data table described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The table below was compiled for this exam to illustrate the scale of American industrial growth in the decades after the Civil War.\n\n` +
      `MILES OF RAILROAD TRACK IN OPERATION, UNITED STATES\n` +
      `1865: about 35,000 miles\n` +
      `1900: about 193,000 miles\n\n` +
      `ANNUAL STEEL PRODUCTION\n` +
      `1865: negligible (Bessemer process just introduced)\n` +
      `1900: about 10 million tons, the largest of any nation in the world\n\n` +
      `SHARE OF AMERICANS LIVING IN CITIES OF 2,500 OR MORE\n` +
      `1865: roughly one in five\n` +
      `1900: roughly two in five\n\n` +
      `IMMIGRATION\n` +
      `Between 1865 and 1900 nearly 14 million immigrants arrived, an increasing share of them from southern and eastern Europe, many of whom filled jobs in the new mills, mines, and factories.\n\n` +
      `Historians note that this growth was accompanied by the rise of large corporations, sharp inequalities of wealth, and repeated, sometimes violent, conflict between organized labor and management.`,
    lineNumbered: false,
    wordCount: 175,
  },

  // ── st10 · Period 6 (1865-1898) · fictional Populist farmer's speech ──
  {
    id: 'evelyn.passage.apush-mock-a-st10.v1',
    title: "Speech of a Populist farmer (fictional, composed for this exam)",
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'speech',
    fullText:
      `The following is a fictional original speech, composed for this exam in the voice of a Kansas farmer addressing a People's Party (Populist) gathering around 1892. It is not a transcription of any real speech.\n\n` +
      `Neighbors, we raise the wheat and the corn that feed this nation, and yet we grow poorer every year that we work harder. When our crop is good the price falls; when the price is fair the railroad's freight charge and the banker's interest carry off whatever the market left us. The money of the country has been made dear on purpose, so that every debt we signed in good times must be paid back in coin worth twice what we borrowed.\n\n` +
      `We do not ask for charity. We ask that the government our fathers built for the people serve the people again: that the railroads and telegraph be brought under public control, that the currency be enlarged so that debtors are not crushed, and that United States senators be chosen by the voters and not by the corporations. If the two old parties will not hear us, then we shall build a party that will.`,
    lineNumbered: false,
    wordCount: 195,
  },

  // ── st11 · Period 7 (1890-1945) · described political cartoon (imperialism) ──
  {
    id: 'evelyn.passage.apush-mock-a-st11.v1',
    title: 'Anti-imperialist cartoon, c. 1899 (political cartoon described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'political-cartoon',
    fullText:
      `The political cartoon described below was created for this exam in the style of magazine cartoons from around 1899, during the debate over what the United States should do with the territories won in the war with Spain.\n\n` +
      `At the center of the cartoon, a figure labeled "UNCLE SAM" stands at a crossroads. In one hand he holds a scroll marked "CONSENT OF THE GOVERNED"; with the other he reaches toward a distant island labeled "PHILIPPINES," where small figures raise a banner reading "WE WANT SELF-RULE."\n\n` +
      `Behind Uncle Sam, a well-dressed businessman labeled "TRADE" whispers in his ear and points eagerly across the ocean toward markets in Asia. A soldier stands ready at Uncle Sam's side. Beneath the drawing runs the caption: "Which promise will he keep?"`,
    lineNumbered: false,
    wordCount: 150,
  },

  // ── st12 · Period 7 (1890-1945) · described table (Depression/New Deal) ──
  {
    id: 'evelyn.passage.apush-mock-a-st12.v1',
    title: 'The United States in the Great Depression (data table described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The table below was compiled for this exam to show economic conditions in the United States from 1929 through 1940.\n\n` +
      `UNEMPLOYMENT RATE (approximate share of the labor force)\n` +
      `1929: about 3 percent\n` +
      `1933: about 25 percent\n` +
      `1937: about 14 percent\n` +
      `1940: about 15 percent\n\n` +
      `NUMBER OF U.S. BANKS SUSPENDING OPERATIONS\n` +
      `1929: several hundred\n` +
      `1933: roughly 4,000 in that year alone, before the federal "bank holiday" and new deposit-insurance law\n\n` +
      `The table notes that Franklin Roosevelt's New Deal, beginning in 1933, created federal programs to provide relief to the unemployed, regulate banks and securities, insure deposits, and give the federal government a permanent new role in managing the economy — even as unemployment remained high through the end of the decade.`,
    lineNumbered: false,
    wordCount: 150,
  },

  // ── st13 · Period 8 (1945-1980) · fictional diplomatic memo (Cold War origins) ──
  {
    id: 'evelyn.passage.apush-mock-a-st13.v1',
    title: 'State Department memorandum on Soviet policy (fictional, composed for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'document',
    fullText:
      `The following is a fictional original memorandum, composed for this exam in the voice of a U.S. State Department official writing in 1947. It is not a transcription of any real document.\n\n` +
      `The central fact of the postwar world is that the Soviet Union does not seek a settled peace but the steady extension of its system wherever weakness invites it. It has fastened governments of its own choosing upon the nations of Eastern Europe, and it now presses upon Greece, Turkey, and the exhausted democracies of the West.\n\n` +
      `We cannot answer this by a return to the isolation of the 1930s, nor by a war we do not want. I recommend a third course: the patient but firm containment of Soviet expansion at every point where it threatens free peoples — through economic aid that restores prosperity and hope to war-ruined nations, so that they need not turn to communism out of despair, and through a standing commitment to resist further Soviet advances. This will be the work not of a season but of a generation.`,
    lineNumbered: false,
    wordCount: 180,
  },

  // ── st14 · Period 8 (1945-1980) · fictional civil-rights organizer's account ──
  {
    id: 'evelyn.passage.apush-mock-a-st14.v1',
    title: "Account of a civil rights organizer (fictional, composed for this exam)",
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'memoir',
    fullText:
      `The following is a fictional original account, composed for this exam in the voice of a young civil rights organizer recalling the early 1960s. It is not a transcription of any real memoir.\n\n` +
      `We were students, most of us, and we had grown impatient. The courts had ruled against segregation in the schools years before, and still the lunch counters of our city would not serve us. So we decided we would not wait for the law to be obeyed on its own; we would put our own bodies in the way of the thing that was wrong.\n\n` +
      `We trained for weeks before we ever sat down at a counter — how to keep our hands still when we were struck, how to answer insult with silence, how to fill the jails faster than the city could empty them. Some of the older people thought us reckless. But we believed that only by making the whole nation see the daily cruelty of segregation, and refuse to look away, could we force the federal government to act. It was slow, and it was dangerous, and it worked.`,
    lineNumbered: false,
    wordCount: 190,
  },

  // ── st15 · Period 9 (1980-present) · described table (recent change) ──
  {
    id: 'evelyn.passage.apush-mock-a-st15.v1',
    title: 'The United States since 1980 (data table described for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `The table below was compiled for this exam to summarize several changes in the United States between 1980 and about 2010.\n\n` +
      `LARGEST REGIONS OF ORIGIN AMONG NEW IMMIGRANTS\n` +
      `Early 20th century (for comparison): chiefly southern and eastern Europe\n` +
      `1980-2010: chiefly Latin America and Asia\n\n` +
      `MANUFACTURING SHARE OF U.S. EMPLOYMENT\n` +
      `1980: about one in five workers\n` +
      `2010: about one in eleven workers, as production shifted overseas and toward automation\n\n` +
      `HOUSEHOLDS OWNING A PERSONAL COMPUTER\n` +
      `1984: about 8 percent\n` +
      `2010: about 77 percent, with the internet reshaping commerce, work, and communication\n\n` +
      `The table notes that these decades also saw a resurgence of political conservatism beginning around 1980, the end of the Cold War in 1991, and, after the terrorist attacks of September 11, 2001, a lengthy U.S. engagement in conflicts in the Middle East.`,
    lineNumbered: false,
    wordCount: 165,
  },

  // ── SAQ 1 stimulus · secondary source: fictional historian's argument ──
  {
    id: 'evelyn.passage.apush-mock-a-saq1.v1',
    title: "A historian's interpretation of Reconstruction (fictional secondary source, composed for this exam)",
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'essay',
    fullText:
      `The following is a fictional secondary-source excerpt, composed for this exam in the voice of a modern historian. The historian and the passage are invented for this exam; they are not a real publication.\n\n` +
      `"It has long been fashionable to dismiss Reconstruction as a failure — a doomed experiment that collapsed when federal troops withdrew from the South in 1877, leaving the freedpeople to a century of segregation and disenfranchisement. There is obvious truth in this verdict. Yet to end the story there is to miss what Reconstruction accomplished. In barely a decade, formerly enslaved people voted, held office at every level from the county courthouse to the United States Senate, built independent churches and schools, and reunited families torn apart by sale. Above all, Reconstruction wrote into the Constitution itself — in the Fourteenth and Fifteenth Amendments — guarantees of birthright citizenship, equal protection, and voting rights that a later generation of Americans would use to complete the work its own era left unfinished. Reconstruction did not fail so much as it was overthrown; and even in defeat it left the legal foundations on which the civil rights movement would one day build."`,
    lineNumbered: false,
    wordCount: 185,
  },

  // ── SAQ 2 stimulus · primary source: fictional Progressive muckraker ──
  {
    id: 'evelyn.passage.apush-mock-a-saq2.v1',
    title: 'A muckraking magazine report (fictional primary source, composed for this exam)',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'essay',
    fullText:
      `The following is a fictional primary-source excerpt, composed for this exam in the style of a muckraking magazine article of about 1906. It is an original composition, not a transcription of any real article.\n\n` +
      `"I have spent three months among the tenements and the packing-houses of this city, and I set down here only what I have seen with my own eyes. In a single block I counted nine families to a floor, sharing one tap and one privy, their children set to piecework by lamplight when they should have been at school or asleep. In the great meat-packing plants the same disregard reigns: diseased carcasses passed by inspectors who answer to the company, floors awash with filth, men maimed at machines the owners will not guard.\n\n` +
      `The managers tell me the market demands cheapness, and that what I have seen is simply the price of progress. I answer that a Republic which permits its citizens to be ground up for profit — whether the citizen be the laborer or the family that eats the tainted meat — has mistaken the meaning of the word. The remedy is not charity. It is law, and inspectors who answer to the public and not to the packers."`,
    lineNumbered: false,
    wordCount: 200,
  },

  // ── DBQ packet · Progressive Era (1890-1920) · Documents 1-7 ──
  {
    id: 'evelyn.passage.apush-mock-a-dbq-packet.v1',
    title: 'DBQ Document Packet — The Progressive Era and the role of government, 1890-1920',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:apush-mock-a',
    license: 'internal-original',
    genre: 'document',
    fullText:
      `The following seven-document packet was compiled for this exam. Documents 1-6 are ORIGINAL compositions or described visuals created for this exam and are clearly labeled as such; they are not transcriptions of real historical sources. Document 7 is a verbatim public-domain text (the Nineteenth Amendment to the U.S. Constitution). The packet supports one prompt on the extent to which Progressive Era reformers changed the role of the United States government, 1890-1920.\n\n` +

      `Document 1\n` +
      `Source: Fictional muckraking magazine article, c. 1902, composed for this exam.\n` +
      `"The city's water is drawn from the same river into which its factories pour their waste, and every summer the fever returns to the tenement districts and carries off the children first. The private company that holds the water contract answers to its shareholders, not to the sick. Until the public itself takes charge of the common necessities of life — its water, its milk, its streets — reform will remain a matter of private charity arriving too late."\n\n` +

      `Document 2\n` +
      `Source: Fictional speech by a reform governor to a state legislature, 1905, composed for this exam.\n` +
      `"The corporation is a creature of the law, and what the law has created the law may regulate. I ask this legislature to establish a commission with real power to set fair railroad rates, to inspect the conditions under which men and women labor, and to publish what it finds. The people did not surrender their government to the great combinations of capital; it is time their government answered to them once more."\n\n` +

      `Document 3\n` +
      `Source: Political cartoon described for this exam (fictional, in the style of c. 1904).\n` +
      `The cartoon shows an enormous figure labeled "THE TRUSTS," seated on bulging money-bags atop the dome of the United States Capitol. Tiny senators scurry at his feet, and a sign around his neck reads "MONOPOLY." In the foreground a small figure labeled "THE PUBLIC" looks up helplessly. The caption reads: "Who governs here?"\n\n` +

      `Document 4\n` +
      `Source: Fictional account by a settlement-house worker, 1908, composed for this exam.\n` +
      `"We opened our house among the immigrant poor to teach English and care for the children of mothers who must work. But we soon learned that no kindergarten can undo what a fourteen-hour day in the mill does to a child of ten. Charity binds the wound; only law can stop the injury. We have therefore turned from soup and lessons to the lobbying of legislatures for laws to limit the hours of women and to drive the youngest children out of the factories altogether."\n\n` +

      `Document 5\n` +
      `Source: Data table described for this exam (fictional figures).\n` +
      `A table titled "Children aged 10-15 employed in a manufacturing state" reports: 1900 — about 120,000 employed; 1910 — about 90,000, after a state child-labor law; 1920 — about 25,000, after further state and federal action. A note beneath the table reads: "Reformers cited such figures as proof that legislation, not persuasion alone, reduced child labor."\n\n` +

      `Document 6\n` +
      `Source: Fictional letter from a factory owner to a newspaper, 1911, composed for this exam.\n` +
      `"These reformers and their inspectors would have the state stand between an employer and the men who freely agree to work for him. If a law fixes the hours, sets the wage, and dictates the very guarding of my machines, then I am no longer master of my own business, and the enterprise that has made this country rich is smothered in the name of protecting people well able to look after themselves."\n\n` +

      `Document 7\n` +
      `Source: Nineteenth Amendment to the United States Constitution, ratified 1920 (verbatim, public domain).\n` +
      `"The right of citizens of the United States to vote shall not be denied or abridged by the United States or by any State on account of sex. Congress shall have power to enforce this article by appropriate legislation."`,
    lineNumbered: false,
    wordCount: 560,
  },
];
