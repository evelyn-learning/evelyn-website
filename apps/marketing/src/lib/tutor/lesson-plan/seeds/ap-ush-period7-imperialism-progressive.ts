/**
 * APUSH Period 7 (early) — Imperialism + Progressive Era (1890-1920).
 *
 * Spanish-American War, Philippines, "Open Door," Progressive reforms,
 * women's suffrage, WWI domestic + foreign. Complements existing 1920s plan.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_USH_PERIOD7_IMPERIALISM_PROGRESSIVE: LessonPlan = {
  id: 'evelyn.ap.ush.period7-imperialism-progressive.v1',
  title: 'APUSH Period 7 — Imperialism, Progressive Era, WWI (1890-1920)',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.period7-imperialism-progressive',
      description: 'Analyze the rise of US overseas imperialism (Spanish-American War, Philippines, Open Door), the Progressive movement\'s reforms (antitrust, regulation, suffrage), and US entry into WWI + post-war retreat.',
      standard: 'APUSH-7.1-7.10',
    },
  ],
  prerequisites: ['apush.period6-gilded-age'],
  followUps: [],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The era when the US became a global power AND reformed at home.',
      script: 'Between 1890 and 1920, the United States simultaneously emerged as a global imperial power AND undertook the largest set of domestic reforms since Reconstruction. The Spanish-American War in 1898 announced US power abroad; the Progressive Era reshaped corporate regulation, suffrage, and government structure at home. WWI accelerated both — and the post-war retreat into nativism and Red Scare set up the 1920s. This period sits at the heart of how the US became modern.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-imperialism',
      kind: 'concept',
      goal: 'US imperialism abroad.',
      keyIdeas: [
        'IMPERIAL DRIVERS: industrial overproduction needing markets (Frederick Jackson Turner\'s "closed frontier"), Mahan\'s naval theory ("Influence of Sea Power Upon History" 1890 — argued for big navy + bases), missionary impulse + "white man\'s burden" (Kipling 1899), social Darwinism applied to nations.',
        'HAWAII: US planters overthrew Queen Liliuokalani (1893) with US Marine support; annexed by McKinley 1898. Strategic naval base (Pearl Harbor) + sugar economy.',
        'SPANISH-AMERICAN WAR (1898): trigger — sinking of USS MAINE in Havana harbor (Feb 1898, cause unclear but blamed on Spain). YELLOW JOURNALISM (Hearst + Pulitzer) inflamed sentiment. Quick US victory; war over in ~10 weeks.',
        'TREATY OF PARIS (1898): Spain ceded Puerto Rico, Guam, Philippines (latter sold for $20M). Cuba nominally independent under PLATT AMENDMENT (1901) — limited Cuban sovereignty, US right to intervene + base at Guantánamo.',
        'PHILIPPINE-AMERICAN WAR (1899-1902): Filipino independence forces (Aguinaldo) had expected freedom; instead got new colonial ruler. Brutal counterinsurgency by US forces; ~250,000-1M Filipino deaths (mostly from disease + war-related famine). Often glossed over in US textbooks.',
        'ANTI-IMPERIALIST LEAGUE (1898): Mark Twain, Andrew Carnegie, Jane Addams, William James — argued empire violated republican principles; lost the public debate.',
        'CHINA + OPEN DOOR (1899-1900, John Hay): policy demanding equal trade access for all powers in China (vs. European spheres of influence). Followed by US participation in BOXER REBELLION suppression (1900) when Chinese nationalists attacked foreign legations.',
        'PANAMA CANAL (1903-1914): Theodore Roosevelt orchestrated Panama\'s independence from Colombia after Colombia rejected canal terms; US-backed coup. Canal opened 1914 — naval mobility between Atlantic + Pacific. ROOSEVELT COROLLARY (1904) to Monroe Doctrine: US right to intervene in Western Hemisphere to maintain order.',
        'DOLLAR DIPLOMACY (Taft) + MORAL DIPLOMACY (Wilson): variations on US economic + political interventionism, especially in Caribbean + Central America (Haiti, Dominican Republic, Nicaragua, Mexico).',
      ],
      vocabulary: [
        { term: 'Open Door Policy', definition: 'John Hay\'s 1899-1900 declaration demanding equal trading access for all nations in China; framed US Asia policy.' },
        { term: 'Roosevelt Corollary', definition: '1904 extension of Monroe Doctrine asserting US right to intervene in Western Hemisphere to forestall European intervention.' },
        { term: 'Platt Amendment', definition: '1901 conditions on Cuban independence retaining US right to intervene + naval base at Guantánamo.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-progressive-era',
      kind: 'concept',
      goal: 'Domestic reform: Progressives, suffrage, regulation.',
      keyIdeas: [
        'PROGRESSIVISM: middle-class reform movement (~1890-1920) responding to Gilded Age inequalities. Believed in scientific governance, expert administration, and government as remedy for corporate + urban excesses.',
        'MUCKRAKERS (term coined by TR): investigative journalists exposing corruption + abuse. Lincoln Steffens "Shame of the Cities" (1904), Ida Tarbell "History of Standard Oil" (1904), Upton Sinclair "The Jungle" (1906 — meatpacking exposé), Jacob Riis "How the Other Half Lives" (1890).',
        'SETTLEMENT HOUSE MOVEMENT: middle-class reformers (often women) lived in poor neighborhoods providing services. Jane Addams\' HULL HOUSE (Chicago, 1889) — childcare, English classes, civic engagement. Spawned social-work profession.',
        'PROGRESSIVE LEGISLATION (federal): MEAT INSPECTION ACT + PURE FOOD AND DRUG ACT (1906, post-Sinclair). HEPBURN ACT (1906 — strengthened ICC railroad regulation). 16TH AMENDMENT (1913 — federal income tax). 17TH AMENDMENT (1913 — direct election of senators). 18TH AMENDMENT (1919 — Prohibition). 19TH AMENDMENT (1920 — women\'s suffrage). FEDERAL RESERVE ACT (1913). CLAYTON ANTITRUST ACT (1914).',
        'TR\'S TRUST-BUSTING: distinguished "good" trusts from "bad." Northern Securities (1904 RR holding company) broken up. Standard Oil (1911) broken into 34 companies under Sherman Act.',
        'WILSON\'S NEW FREEDOM: federal antitrust + tariff + banking reform. Underwood Tariff (1913) lowered tariffs + introduced income tax; Federal Reserve (1913) created modern central banking; FTC (1914) for ongoing antitrust monitoring.',
        'WOMEN\'S SUFFRAGE MOVEMENT: built from abolition + temperance roots. Susan B. Anthony, Elizabeth Cady Stanton (older generation). Carrie Chapman Catt (NAWSA, mainstream). Alice Paul (NWP, more militant; arrested at White House protests). Wyoming first state to enfranchise women (1869). 19TH AMENDMENT ratified August 1920.',
        'ROBERT LA FOLLETTE (Wisconsin governor + senator): "Wisconsin Idea" — direct primary, referendum, recall. State-level Progressive innovations later spread federally.',
        'LIMITS OF PROGRESSIVISM: largely IGNORED RACE — TR + Wilson both segregationist (Wilson re-segregated federal civil service). Booker T. Washington vs. W.E.B. Du Bois debate over response. Plessy v. Ferguson (1896) "separate but equal" upheld segregation. NAACP founded 1909.',
      ],
      vocabulary: [
        { term: 'muckraker', definition: 'Progressive Era investigative journalist exposing corruption + corporate abuse (Steffens, Tarbell, Sinclair, Riis); term coined by TR.' },
        { term: 'Hull House', definition: 'Jane Addams\' Chicago settlement house (1889) providing services + civic education in poor immigrant neighborhoods.' },
        { term: '17th Amendment', definition: '1913 amendment establishing direct popular election of US senators (previously chosen by state legislatures).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-wwi',
      kind: 'concept',
      goal: 'WWI + domestic effects + post-war retreat.',
      keyIdeas: [
        'NEUTRALITY (1914-1917): Wilson re-elected 1916 on "He Kept Us Out of War." US trade with Allies grew enormously while British blockade limited Central Powers trade.',
        'DRIFT TO WAR: German UNRESTRICTED SUBMARINE WARFARE (sinking neutral ships including LUSITANIA 1915 with 128 Americans aboard). ZIMMERMAN TELEGRAM (Feb 1917, German offer to Mexico of US territory if Mexico joined Central Powers) galvanized opinion. April 1917 Wilson asked Congress for war declaration; passed.',
        'MILITARY ROLE: 4 million Americans mobilized; AEF (American Expeditionary Forces) under Pershing. Arrived in mass mid-1918, helped break stalemate. Armistice November 11, 1918.',
        'HOME FRONT MOBILIZATION: WAR INDUSTRIES BOARD (Bernard Baruch — coordinated production). FOOD ADMINISTRATION (Herbert Hoover). COMMITTEE ON PUBLIC INFORMATION (George Creel — wartime propaganda). Liberty Bonds.',
        'CIVIL LIBERTIES SUPPRESSION: ESPIONAGE ACT (1917) + SEDITION ACT (1918) criminalized anti-war speech. Eugene Debs (Socialist) jailed 10 years for anti-war speech. Schenck v. United States (1919) upheld convictions — Holmes\'s "clear and present danger" doctrine.',
        'GREAT MIGRATION: ~500,000 African Americans moved from South to Northern industrial cities 1915-1920 for war jobs + escape Jim Crow. Reshaped Northern demographics + cultural movements (Harlem Renaissance later).',
        'WOMEN at WORK: war labor opened factory + clerical jobs to women. Leveraged into 19th Amendment passage 1919-20.',
        'WILSONIAN PEACE: FOURTEEN POINTS (Jan 1918) — open diplomacy, freedom of seas, self-determination, League of Nations. Treaty of Versailles (1919) included League but harsher terms than Wilson wanted.',
        'SENATE REJECTION: League opposed by IRRECONCILABLES (anti-League at all) + RESERVATIONISTS (Henry Cabot Lodge — wanted modifications). Wilson refused compromise; suffered debilitating stroke campaigning. Senate rejected Treaty 1919-1920. US never joined League.',
        'POST-WAR DISORDER: 1919 RACE RIOTS + LYNCHINGS (Red Summer); STEEL STRIKE 1919; FIRST RED SCARE (1919-20) — Palmer Raids deported suspected radicals.',
      ],
      vocabulary: [
        { term: 'Zimmermann Telegram', definition: 'intercepted 1917 German cable offering Mexico US territory if it joined Central Powers; helped move US into WWI.' },
        { term: 'Great Migration', definition: '~500,000 African Americans moving from rural South to Northern cities 1915-1920 for war-industry jobs + escape from Jim Crow.' },
        { term: 'Schenck v. United States', definition: '1919 Supreme Court case upholding Espionage Act convictions; Justice Holmes\'s "clear and present danger" doctrine for limiting speech.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is the Spanish-American War of 1898 considered a turning point in US foreign policy?',
      expectedAnswer: 'It marked the US transition from CONTINENTAL EXPANSION to OVERSEAS EMPIRE. Pre-1898, US territorial growth had been across the North American continent (Mexican Cession, Alaska, Hawaii pending). After 1898, the US acquired DISTANT non-contiguous colonies (Puerto Rico, Guam, Philippines) and protectorates (Cuba). It demonstrated MILITARY CAPACITY (a quick + decisive war) and NAVAL POWER (Mahan\'s strategy validated). It positioned the US as a Pacific + Caribbean power, forced national debate over imperialism (Anti-Imperialist League formed), and set up the Open Door (1899) + Roosevelt Corollary (1904) framework that defined 20th-century US interventionism. APUSH treats it as the canonical "America becomes empire" moment.',
      responseFormat: 'free',
      hints: [
        'Continental vs overseas expansion — what changed?',
        'Naval/strategic position before vs after.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-progressive-race',
      kind: 'misconception_check',
      question: 'The Progressive Era\'s reform agenda meaningfully addressed racial discrimination and improved conditions for Black Americans. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Generalizing "Progressive reform" as universally inclusive.',
          correctsTo: 'False. Progressivism was largely SILENT or REGRESSIVE on race. Wilson re-segregated the federal civil service (1913) — a step BACKWARD from post-Civil War integration. TR invited Booker T. Washington to dine at the White House (1901) but did little structurally. Plessy v. Ferguson (1896) "separate but equal" entrenched legal segregation throughout the era. Many white Progressives actively SUPPORTED disenfranchisement of Southern Black voters as part of "good government" reform. Lynching peaked in this period; anti-lynching legislation failed. The NAACP (1909) and W.E.B. Du Bois\'s Niagara Movement (1905) emerged precisely because white Progressivism wouldn\'t address race. APUSH explicitly tests this — the era reformed corporate + government structure but largely abandoned the reconstruction-era civil rights agenda. Recognizing the limits is key to nuanced answers.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Spanish-American War 1898 → Puerto Rico/Guam/Philippines + Platt Cuba. Open Door 1899; Roosevelt Corollary 1904; Panama Canal 1914.',
        'Muckrakers (Sinclair Jungle 1906, Tarbell, Steffens) exposed abuses. Settlement houses (Hull House 1889).',
        'Progressive amendments: 16th income tax, 17th direct senate, 18th Prohibition, 19th women\'s suffrage. Federal Reserve 1913.',
        'WWI 1917-18: drafted 4M, Espionage/Sedition Acts, Great Migration. Wilson\'s Fourteen Points; Senate rejected Versailles + League.',
        'Progressive Era largely IGNORED race; Wilson resegregated federal service; lynching peaked. NAACP 1909.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did the US Senate ultimately reject the Treaty of Versailles + League of Nations in 1919-1920 even though Wilson had largely shaped its terms?',
      hint: 'Three intersecting reasons. (1) PARTISAN politics: Republicans had won Senate majority in 1918 midterms; Wilson refused to include any Republicans on his Versailles delegation, antagonizing Henry Cabot Lodge (Foreign Relations chair). (2) SUBSTANTIVE concerns about Article X (collective security) — would obligate US to defend other League members\' borders, which many senators viewed as compromising Congressional war-declaration power + entangling US in European disputes. Lodge proposed RESERVATIONS that might have passed. (3) WILSON\'S RIGIDITY: Wilson, recovering from stroke in October 1919, refused all compromise, ordering Democratic senators to vote down the modified treaty. Treaty fell short of 2/3 in November 1919; second vote March 1920 again failed. The combination of substantive disagreement + procedural breakdown kept US out of the League. APUSH tests this — knowing it was Wilson\'s rigidity, not just Republican obstruction, marks a more complete answer.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
