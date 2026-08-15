import type {
  ClassroomCourse,
  ClassroomAssignment,
  ClassroomSubmission,
} from '../types';

export const mockCourses: ClassroomCourse[] = [
  {
    id: 'course-mock-001',
    name: 'AP English Literature - Period 3',
    section: 'Spring 2026',
    descriptionHeading: 'AP Lit / Composition',
    courseState: 'ACTIVE',
  },
  {
    id: 'course-mock-002',
    name: 'World History - Honors',
    section: 'Block B',
    descriptionHeading: 'WH Honors',
    courseState: 'ACTIVE',
  },
];

export const mockAssignmentsByCourse: Record<string, ClassroomAssignment[]> = {
  'course-mock-001': [
    {
      id: 'asgmt-eng-001',
      courseId: 'course-mock-001',
      title: 'Great Gatsby — Symbol Analysis Essay',
      description: '500-word essay analyzing the green light symbol.',
      dueDate: '2026-05-12',
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED',
    },
    {
      id: 'asgmt-eng-002',
      courseId: 'course-mock-001',
      title: 'Macbeth — Character Study',
      description: 'Compare Macbeth and Lady Macbeth across Acts I-III.',
      dueDate: '2026-05-20',
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED',
    },
  ],
  'course-mock-002': [
    {
      id: 'asgmt-hist-001',
      courseId: 'course-mock-002',
      title: 'Industrial Revolution — Causes',
      description: 'Argue the most decisive cause of British industrialization.',
      dueDate: '2026-05-15',
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED',
    },
    {
      id: 'asgmt-hist-002',
      courseId: 'course-mock-002',
      title: 'Cold War — Origins Essay',
      description: 'Trace the origins of US-Soviet tension between 1945 and 1949.',
      dueDate: '2026-05-22',
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED',
    },
  ],
};

const k = (courseId: string, assignmentId: string) => `${courseId}::${assignmentId}`;

export const mockSubmissionsByAssignment: Record<string, ClassroomSubmission[]> = {
  [k('course-mock-001', 'asgmt-eng-001')]: [
    {
      id: 'sub-eng001-001',
      courseId: 'course-mock-001',
      assignmentId: 'asgmt-eng-001',
      studentId: 'stu-001',
      studentName: 'Aisha Patel',
      studentEmail: 'aisha.patel@example.school',
      state: 'TURNED_IN',
      submittedAt: '2026-05-11T14:22:00Z',
      attachments: [{ driveFileId: 'drive-mock-eng001-001', title: 'Gatsby Symbol Essay - Aisha.gdoc' }],
    },
    {
      id: 'sub-eng001-002',
      courseId: 'course-mock-001',
      assignmentId: 'asgmt-eng-001',
      studentId: 'stu-002',
      studentName: 'Marcus Chen',
      studentEmail: 'marcus.chen@example.school',
      state: 'TURNED_IN',
      submittedAt: '2026-05-12T09:05:00Z',
      attachments: [{ driveFileId: 'drive-mock-eng001-002', title: 'Green Light Essay.gdoc' }],
    },
    {
      id: 'sub-eng001-003',
      courseId: 'course-mock-001',
      assignmentId: 'asgmt-eng-001',
      studentId: 'stu-003',
      studentName: 'Priya Nair',
      studentEmail: 'priya.nair@example.school',
      state: 'TURNED_IN',
      submittedAt: '2026-05-12T11:48:00Z',
      attachments: [{ driveFileId: 'drive-mock-eng001-003', title: 'Symbol Analysis - Priya.gdoc' }],
    },
    {
      id: 'sub-eng001-004',
      courseId: 'course-mock-001',
      assignmentId: 'asgmt-eng-001',
      studentId: 'stu-004',
      studentName: 'Jordan Reeves',
      studentEmail: 'jordan.reeves@example.school',
      state: 'TURNED_IN',
      submittedAt: '2026-05-12T13:12:00Z',
      attachments: [{ driveFileId: 'drive-mock-eng001-004', title: 'Gatsby Essay Final.gdoc' }],
    },
  ],
  [k('course-mock-001', 'asgmt-eng-002')]: [
    {
      id: 'sub-eng002-001',
      courseId: 'course-mock-001',
      assignmentId: 'asgmt-eng-002',
      studentId: 'stu-001',
      studentName: 'Aisha Patel',
      state: 'TURNED_IN',
      submittedAt: '2026-05-19T10:00:00Z',
      attachments: [{ driveFileId: 'drive-mock-eng002-001', title: 'Macbeth Character Study.gdoc' }],
    },
    {
      id: 'sub-eng002-002',
      courseId: 'course-mock-001',
      assignmentId: 'asgmt-eng-002',
      studentId: 'stu-005',
      studentName: 'Sam Whitaker',
      state: 'TURNED_IN',
      submittedAt: '2026-05-19T14:33:00Z',
      attachments: [{ driveFileId: 'drive-mock-eng002-002', title: 'Macbeth Essay.gdoc' }],
    },
    {
      id: 'sub-eng002-003',
      courseId: 'course-mock-001',
      assignmentId: 'asgmt-eng-002',
      studentId: 'stu-006',
      studentName: 'Emma Rodriguez',
      state: 'TURNED_IN',
      submittedAt: '2026-05-20T08:01:00Z',
      attachments: [{ driveFileId: 'drive-mock-eng002-003', title: 'Lady Macbeth Compare.gdoc' }],
    },
  ],
  [k('course-mock-002', 'asgmt-hist-001')]: [
    {
      id: 'sub-hist001-001',
      courseId: 'course-mock-002',
      assignmentId: 'asgmt-hist-001',
      studentId: 'stu-007',
      studentName: 'Liam O\'Connor',
      state: 'TURNED_IN',
      submittedAt: '2026-05-14T16:11:00Z',
      attachments: [{ driveFileId: 'drive-mock-hist001-001', title: 'Industrial Revolution Causes.gdoc' }],
    },
    {
      id: 'sub-hist001-002',
      courseId: 'course-mock-002',
      assignmentId: 'asgmt-hist-001',
      studentId: 'stu-008',
      studentName: 'Zara Ahmed',
      state: 'TURNED_IN',
      submittedAt: '2026-05-15T07:42:00Z',
      attachments: [{ driveFileId: 'drive-mock-hist001-002', title: 'IR Causes Essay.gdoc' }],
    },
    {
      id: 'sub-hist001-003',
      courseId: 'course-mock-002',
      assignmentId: 'asgmt-hist-001',
      studentId: 'stu-009',
      studentName: 'Tomas Mendoza',
      state: 'TURNED_IN',
      submittedAt: '2026-05-15T09:30:00Z',
      attachments: [{ driveFileId: 'drive-mock-hist001-003', title: 'Industrial Britain.gdoc' }],
    },
    {
      id: 'sub-hist001-004',
      courseId: 'course-mock-002',
      assignmentId: 'asgmt-hist-001',
      studentId: 'stu-010',
      studentName: 'Hannah Goldberg',
      state: 'TURNED_IN',
      submittedAt: '2026-05-15T15:55:00Z',
      attachments: [{ driveFileId: 'drive-mock-hist001-004', title: 'Causes of Industrialization.gdoc' }],
    },
    {
      id: 'sub-hist001-005',
      courseId: 'course-mock-002',
      assignmentId: 'asgmt-hist-001',
      studentId: 'stu-011',
      studentName: 'Devon Clark',
      state: 'TURNED_IN',
      submittedAt: '2026-05-15T17:20:00Z',
      attachments: [{ driveFileId: 'drive-mock-hist001-005', title: 'IR Argument.gdoc' }],
    },
  ],
  [k('course-mock-002', 'asgmt-hist-002')]: [
    {
      id: 'sub-hist002-001',
      courseId: 'course-mock-002',
      assignmentId: 'asgmt-hist-002',
      studentId: 'stu-007',
      studentName: 'Liam O\'Connor',
      state: 'TURNED_IN',
      submittedAt: '2026-05-21T19:14:00Z',
      attachments: [{ driveFileId: 'drive-mock-hist002-001', title: 'Cold War Origins.gdoc' }],
    },
    {
      id: 'sub-hist002-002',
      courseId: 'course-mock-002',
      assignmentId: 'asgmt-hist-002',
      studentId: 'stu-012',
      studentName: 'Grace Park',
      state: 'TURNED_IN',
      submittedAt: '2026-05-21T20:00:00Z',
      attachments: [{ driveFileId: 'drive-mock-hist002-002', title: 'Origins of Cold War.gdoc' }],
    },
    {
      id: 'sub-hist002-003',
      courseId: 'course-mock-002',
      assignmentId: 'asgmt-hist-002',
      studentId: 'stu-013',
      studentName: 'Idris Bello',
      state: 'TURNED_IN',
      submittedAt: '2026-05-22T07:10:00Z',
      attachments: [{ driveFileId: 'drive-mock-hist002-003', title: 'Truman to NATO.gdoc' }],
    },
  ],
};

export interface MockDriveFile {
  name: string;
  mimeType: string;
  text: string;
}

const MIME_DOC = 'application/vnd.google-apps.document';

export const mockDriveContent: Record<string, MockDriveFile> = {
  // ─── Gatsby Symbol Essay (mostly original student voice) ───
  'drive-mock-eng001-001': {
    name: 'Gatsby Symbol Essay - Aisha.gdoc',
    mimeType: MIME_DOC,
    text: `When I first read The Great Gatsby, the green light at the end of Daisy's dock felt like a small detail. By the third chapter I realized Fitzgerald keeps coming back to it, and that pulled me in.

The green light works as more than a piece of scenery. Gatsby reaches for it the night the narrator first sees him, before he has even spoken. That gesture sets up the whole pattern: Gatsby reaching for something he cannot quite hold. The color itself matters. Green is the color of money, which Gatsby chases for Daisy's sake, but it is also the color of new growth in spring, which lines up with how Gatsby believes the past can be redone.

What surprised me most was how the light dims later in the book. Once Gatsby and Daisy are together again, Nick notices that the green light has lost some of its meaning to Gatsby. To me this shows Fitzgerald's real point: dreams kept at a distance feel huge, but the closer we get, the smaller they become. The green light is a measuring stick for Gatsby's distance from Daisy, not a symbol of love itself.

I think this matters for the novel's last lines, when Nick connects the green light to all the dreams Americans chase. Fitzgerald is saying the country has its own version of Gatsby's reaching gesture. We do not always notice that what we want gets less real once we have it.`,
  },
  // ─── Gatsby (formal hedging tone — should look more AI-like) ───
  'drive-mock-eng001-002': {
    name: 'Green Light Essay.gdoc',
    mimeType: MIME_DOC,
    text: `In F. Scott Fitzgerald's seminal work The Great Gatsby, the green light situated at the end of Daisy Buchanan's dock functions as a multifaceted and deeply resonant symbol that operates on numerous interpretive levels throughout the narrative. It is widely regarded as one of the most important symbols in twentieth-century American literature, and its significance cannot be overstated.

Furthermore, the green light may be interpreted as representing the unattainable nature of the American Dream itself. It serves as a beacon of hope, but it is simultaneously a reminder of distance and disillusionment. The juxtaposition of these two qualities is central to Fitzgerald's overall thematic project, which seeks to interrogate the very foundations of American aspirational ideology.

In conclusion, it is important to note that the green light should not be considered in isolation. Rather, it must be understood in the broader context of the novel's symbolic architecture, including the valley of ashes, the eyes of Doctor T. J. Eckleburg, and the recurring motif of geography. Each of these elements contributes to a comprehensive critique of the American social order during the Jazz Age. Ultimately, the green light reminds us that aspiration is both noble and tragic, and that the pursuit of an idealized past is, in many cases, doomed to fail. This is, perhaps, the central insight of the novel.`,
  },
  // ─── Gatsby (genuine, even with awkward phrasing) ───
  'drive-mock-eng001-003': {
    name: 'Symbol Analysis - Priya.gdoc',
    mimeType: MIME_DOC,
    text: `My essay is about the green light in The Great Gatsby and what I think it means.

The first time the green light shows up, Gatsby is alone at night reaching out across the water. Nick says he was trembling, which I thought was a strong word. I read this part twice because it surprised me that Gatsby would be that emotional over a light. After thinking about it, I realized the light is not really a light to him. It is everything he wants from Daisy, plus the time he lost when she married Tom.

A lot of people say the light is the American Dream. I sort of agree but I think that reading is too easy. To me the light is more personal than that. It is Gatsby's specific dream, which is to rewrite five years of his life. The American Dream connection only kicks in at the very end, when Nick does that thing where he zooms out and talks about everyone chasing dreams.

One thing I noticed is that the color green keeps coming back even when the light is not on. There is the green car, the lawn at Gatsby's parties, and the spring weather that Nick keeps mentioning. Fitzgerald is layering green into the whole book so the symbol is doing work even when the actual light is off.

The reason the ending hits hard is that Nick stops talking about Gatsby and starts talking about us. The green light becomes our light. I do not think that is a happy ending. I think Fitzgerald is warning us.`,
  },
  // ─── Gatsby (mixed — partly copied-sounding generic phrases) ───
  'drive-mock-eng001-004': {
    name: 'Gatsby Essay Final.gdoc',
    mimeType: MIME_DOC,
    text: `The Great Gatsby is a 1925 novel written by American author F. Scott Fitzgerald. It is considered to be Fitzgerald's magnum opus. The novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.

The green light at the end of Daisy's dock is one of the novel's most famous symbols. It represents Gatsby's hopes and dreams for the future. Fitzgerald uses this symbol to convey the elusive nature of the American Dream. The green light is mentioned several times throughout the book and each time it carries slightly different weight.

I want to focus on what the symbol means for Gatsby personally. Gatsby is a character defined by longing. He bought his mansion specifically because it was across the bay from Daisy. Every party he throws is really for her. So the green light is the closest he can get to her without crossing the bay. When he finally meets her again the light becomes ordinary. That is the point Fitzgerald wants us to feel: dreams cannot survive contact with reality. The closer Gatsby gets to Daisy, the less magic she has.

By the end, the green light is no longer Gatsby's. Nick takes it over and turns it into a national symbol, saying we are all Gatsby reaching for a light that recedes year by year. I think this ending is sad but also true.`,
  },

  // ─── Macbeth ───
  'drive-mock-eng002-001': {
    name: 'Macbeth Character Study.gdoc',
    mimeType: MIME_DOC,
    text: `Macbeth and Lady Macbeth are not the same kind of ambitious. That is the thing that struck me when we read Acts I through III in class.

Macbeth wavers. After he hears the witches he writes home about it but does not act, even when his wife pushes. He gets cold feet at the dinner before Duncan's murder and almost backs out. Even after the killing he is haunted by what he did. The dagger speech is full of doubt, not strategy. To me Macbeth is someone who wants the crown but cannot stomach the cost.

Lady Macbeth in the first three acts is the opposite. She prepares. She drugs the guards. She places the daggers. When her husband panics, she goes back to the murder scene to clean up. Her "unsex me here" speech is one of the strongest pieces of writing in the play because she knows she has to talk herself out of being merciful.

But by Act III things start to flip. Lady Macbeth fades from the action. Macbeth ordering Banquo's murder happens without her input. He is becoming the planner. She is becoming the haunted one, even if we do not see her sleepwalking until later. Shakespeare is showing how the weight of what they did is moving from her to him and then back again.

The reason this comparison matters is that it shows Shakespeare is not writing a simple villain story. Both Macbeths take turns being the conscience and the actor. The play is about how guilt and ambition pass between two people who share a single goal.`,
  },
  'drive-mock-eng002-002': {
    name: 'Macbeth Essay.gdoc',
    mimeType: MIME_DOC,
    text: `In Shakespeare's Macbeth, the relationship between Macbeth and Lady Macbeth undergoes profound transformation throughout the early acts of the play. Their dynamic is one of the most complex spousal portraits in the English literary tradition, and it serves as the engine for much of the tragedy that unfolds.

Initially, Lady Macbeth occupies the dominant position in the relationship. She receives her husband's letter regarding the witches' prophecy and immediately begins to formulate a plan. Her famous soliloquy in Act I, Scene V demonstrates a willingness to abandon all conventional moral restraint in pursuit of power. She invokes the spirits to "unsex" her, requesting that she be stripped of her feminine compassion so that she may carry out the violent act required to secure the throne for her husband.

Macbeth, by contrast, is portrayed as a man of action on the battlefield but a man of hesitation in the domestic sphere. He requires significant prompting from his wife before he will commit to murdering King Duncan. This dynamic is reversed gradually over the course of Acts II and III. Once Duncan has been killed, Macbeth begins to act without consulting his wife. The decision to murder Banquo, for example, is made unilaterally. Lady Macbeth becomes a peripheral figure in her husband's increasingly autonomous descent into tyranny. Shakespeare uses this reversal to dramatize the corrosive effects of guilt and unchecked ambition on the marital bond.`,
  },
  'drive-mock-eng002-003': {
    name: 'Lady Macbeth Compare.gdoc',
    mimeType: MIME_DOC,
    text: `When I started reading Macbeth I thought Lady Macbeth would be the obvious villain. By Act III I changed my mind.

She is the louder of the two characters in Act I. She gets the letter, she does the math, she figures out the only thing standing between her husband and the crown is one night of nerve. Her speech where she asks the spirits to make her cruel feels honest in a strange way. She is admitting she does not have the cruelty she needs and is asking for it. That is different from being naturally evil.

Macbeth is harder to read. He does the killing but he also imagines daggers in the air, hears voices that say he will sleep no more, and basically falls apart at the dinner with Banquo's ghost. So even though he commits the violence, he is the one who feels it more on the page.

The reason I think Lady Macbeth is not the simple villain is what happens after Banquo's murder. She is not in on it. Macbeth plans it, hires the murderers, and surprises her with the result. From that moment Shakespeare hands the violence to Macbeth and starts pulling Lady Macbeth offstage. She is going to break later in the play, and the seeds of that break are in Act III when she realizes she has lost control of him.

I think Shakespeare is doing something subtle. He gives one Macbeth the ambition and the other Macbeth the conscience, and then he switches them. Both characters feel the cost. Neither of them gets to be only one thing.`,
  },

  // ─── Industrial Revolution ───
  'drive-mock-hist001-001': {
    name: 'Industrial Revolution Causes.gdoc',
    mimeType: MIME_DOC,
    text: `If I had to argue for one decisive cause of British industrialization, I would pick coal. Other causes mattered too, but coal is what made the rest possible.

Britain had a lot of accessible coal close to the surface, especially in the north. That meant cheap fuel. Cheap fuel meant steam engines were affordable to run, which meant factories could exist away from rivers. Once factories left the rivers they could be near cities, which meant they could draw on workers from the enclosure movement. So coal kicked off a chain.

Some historians argue the real cause was finance. The Bank of England, joint stock companies, and a culture of investment did matter. But finance existed in the Netherlands too, and the Netherlands did not industrialize first. Britain's banks worked because there was something profitable to invest in, and that something needed coal.

Other arguments focus on enclosure or empire. Enclosure pushed people off the land and into wage labor, which gave factories a workforce. The empire gave Britain raw materials like cotton from India and a captive market. Both are real but both are amplifiers of an industrial economy that was already starting. They sped up something that was already moving.

Coal was the input that turned ambitions into machinery. Without coal, all the finance and labor and raw cotton would have powered something more like a giant version of cottage industry. The steam engine was the breakthrough technology of the Industrial Revolution, and the steam engine is useless without cheap fuel. That is why I think coal was the decisive cause.`,
  },
  'drive-mock-hist001-002': {
    name: 'IR Causes Essay.gdoc',
    mimeType: MIME_DOC,
    text: `The Industrial Revolution, which began in Great Britain during the latter half of the eighteenth century, is one of the most transformative events in modern world history. Numerous causes contributed to this development, including but not limited to the availability of natural resources, the agricultural revolution, the enclosure movement, capital accumulation, technological innovation, and the global reach of the British Empire. It is essential to consider these factors holistically rather than in isolation.

In the first place, Britain possessed an abundance of coal and iron ore, which served as the foundational raw materials for industrial production. These resources were geographically concentrated in regions such as Lancashire, Yorkshire, and the Midlands, which subsequently became the epicenters of industrial activity.

In addition, the agricultural revolution that preceded industrialization led to significant increases in food production. As a consequence, fewer agricultural workers were needed, and a surplus labor force migrated to urban centers in search of employment. This demographic shift provided the manpower necessary for the operation of large-scale factories.

Furthermore, Britain's imperial network supplied a continuous stream of raw materials such as cotton from India and the American South, while simultaneously providing access to markets for finished goods. This dual role of the empire as both source and destination created a self-reinforcing economic loop that accelerated industrial growth.

In conclusion, the Industrial Revolution cannot be attributed to any single cause. Rather, it was the convergence of resources, labor, capital, technology, and empire that produced this unprecedented transformation.`,
  },
  'drive-mock-hist001-003': {
    name: 'Industrial Britain.gdoc',
    mimeType: MIME_DOC,
    text: `My argument is that the most decisive cause of British industrialization was a labor shock caused by enclosure.

Enclosure was the legal process where common land got privatized and fenced off. People who had farmed those lands for generations lost access overnight. Some moved to factory towns, some emigrated, but the net effect was a huge new pool of workers with no land to fall back on. That changes the math for a factory owner. Before enclosure, getting people to leave the village to run a loom was hard. After enclosure, the village was gone.

Coal and iron mattered, but Britain shared those resources with other countries that did not industrialize as fast. France had coal. Germany had iron. The thing they did not have was the same scale of forced labor mobility. Britain's enclosure movement turned the countryside into a labor reservoir for the cities.

Empire and finance were important amplifiers. Cotton from the colonies fed the mills. The Bank of England backed industrial loans. But neither of these explains why the workers showed up to operate the machines in the first place. Empire gave Britain raw materials and markets, but it did not put a person in front of a spinning jenny.

You could argue that the steam engine was the decisive cause, since it changed the physics of production. I think the engine is downstream of the labor question. Steam engines were expensive to build and run. You only build them if you know there are workers who will run them, and goods that will be made profitably. Enclosure made that possible by guaranteeing the labor supply. So I am sticking with enclosure as the most decisive cause.`,
  },
  'drive-mock-hist001-004': {
    name: 'Causes of Industrialization.gdoc',
    mimeType: MIME_DOC,
    text: `The Industrial Revolution began in Britain in the late 1700s. It was caused by a number of factors. In this essay I will discuss the main causes.

One cause was the agricultural revolution. New farming methods like the seed drill and crop rotation made farms more efficient. This meant fewer people were needed to work on farms. Many of these people moved to cities to find work in factories.

Another cause was the abundance of natural resources. Britain had a lot of coal and iron, which were needed for industry. Coal could be used to power steam engines and iron could be used to make machines and railroad tracks.

A third cause was the British Empire. The empire gave Britain raw materials and a market for finished goods. For example, cotton came from India and the American South. Once the cotton was made into cloth, it could be sold back to colonies.

Finally, there was the role of inventors. James Watt improved the steam engine. Richard Arkwright invented the water frame. Edmund Cartwright invented the power loom. These inventions made factory production possible.

In conclusion, the Industrial Revolution had many causes including the agricultural revolution, natural resources, the empire, and inventions. All of these factors worked together to make Britain the first industrial nation in the world.`,
  },
  'drive-mock-hist001-005': {
    name: 'IR Argument.gdoc',
    mimeType: MIME_DOC,
    text: `I want to argue that the most decisive cause of British industrialization was a particular cultural shift toward applied science. This is the cause we usually skip over in textbooks.

In the seventeenth and eighteenth centuries, British society started taking practical engineering seriously as a respectable activity. The Royal Society was founded in 1660, and unlike older European academies it actively encouraged correspondence with skilled craftsmen. People like John Smeaton, the first self-described civil engineer, came out of this environment. He treated water wheels and mill design as scientific problems with measurable answers. That mindset spread.

This is different from saying inventors caused the revolution. Inventors existed everywhere. The decisive thing was a culture that gave engineering inventors social status, market demand, and intellectual community. Once a tinkerer could be respected and paid, the whole pipeline of incremental improvement opened up.

Coal, capital, and empire were necessary conditions. Without coal, the steam engine has no fuel. Without London capital, factories do not get built. Without empire, there is no cotton to weave. But all those conditions could exist in another country and not produce industrialization, because the country might not have anyone willing to spend ten years tweaking a steam condenser.

Britain had James Watt because Britain had a culture in which a Scottish instrument maker could attract the attention of Glasgow professors and a Birmingham investor. That cultural infrastructure is the cause people undersell. It is harder to see than coal seams, but it is the part that explains why Britain industrialized first.`,
  },

  // ─── Cold War Origins ───
  'drive-mock-hist002-001': {
    name: 'Cold War Origins.gdoc',
    mimeType: MIME_DOC,
    text: `The Cold War did not start the day World War II ended. It started before, during, and after, in stages, and tracking the early stages from 1945 to 1949 helps explain why it lasted forty more years.

The first stage was Yalta and Potsdam. At Yalta in February 1945, Roosevelt, Stalin, and Churchill agreed in principle to free elections in Eastern Europe. By Potsdam in July, Roosevelt was dead, the war in Europe was over, and the practical question of who controlled Poland and Germany was on the table. The answer turned out to be: whoever's army was already there. The Red Army was in Poland and eastern Germany. The Western Allies were in western Germany. That occupation map became the political map.

The second stage was the breakdown of trust over the bomb. Truman tested the atomic bomb during Potsdam and let Stalin know in vague terms. Stalin already knew through espionage. The bomb did not start the Cold War, but it did make both sides realize that postwar cooperation was a high stakes question.

The third stage was the Truman Doctrine and Marshall Plan in 1947. The U.S. committed to containing communism in Greece and Turkey, then offered massive economic aid across Europe. Stalin refused the aid for the Soviet bloc. By accepting or refusing Marshall Plan money, every country in Europe effectively chose a side.

The fourth stage was the Berlin Blockade and the founding of NATO in 1948 and 1949. The blockade was the first direct standoff. NATO was the first formal military alliance. By 1949 the rules of the Cold War were set: two blocs, two economies, two armies, and Berlin as the contested seam.`,
  },
  'drive-mock-hist002-002': {
    name: 'Origins of Cold War.gdoc',
    mimeType: MIME_DOC,
    text: `The origins of the Cold War, which spanned the period from 1945 to 1949, can be attributed to a complex array of geopolitical, ideological, and economic factors that emerged in the aftermath of the Second World War. It is widely accepted by historians that the deterioration of the wartime alliance between the United States, the United Kingdom, and the Soviet Union was both gradual and overdetermined.

Ideologically, the United States and the Soviet Union represented fundamentally incompatible visions of political and economic organization. The capitalist liberal democratic model espoused by the United States stood in direct opposition to the Marxist-Leninist framework of the Soviet Union. This ideological divide, which had been temporarily set aside during the wartime alliance, reasserted itself with vigor as soon as the common enemy was defeated.

Geopolitically, the question of postwar settlement in Europe became the central point of contention. The Soviet Union, having borne the brunt of the European war and suffered an estimated twenty million casualties, sought a sphere of influence in Eastern Europe to serve as a buffer against future western aggression. The United States, in turn, sought to promote self-determination and democratic governance in liberated territories.

Furthermore, key events such as the Truman Doctrine of 1947, the Marshall Plan, the Berlin Blockade of 1948, and the establishment of NATO in 1949 progressively crystallized the bipolar structure of international relations. By the end of the decade, the Cold War had become an established feature of the global system, characterized by ideological competition, proxy conflicts, and an arms race that would define the second half of the twentieth century.`,
  },
  'drive-mock-hist002-003': {
    name: 'Truman to NATO.gdoc',
    mimeType: MIME_DOC,
    text: `Between 1945 and 1949 the United States went from being a wartime partner of the Soviet Union to being its formal opponent. Three turning points mattered most: the Iran crisis, the Truman Doctrine, and the Berlin Blockade.

The Iran crisis in 1946 is underrated. Soviet troops stayed in northern Iran past the agreed withdrawal date, hoping to set up a friendly government. Truman's administration pushed back through the new United Nations Security Council, and the Soviets withdrew. It was the first postwar test of whether negotiations could resolve a Soviet expansion. The takeaway in Washington was that pressure worked, and the lesson would shape every later policy.

The Truman Doctrine in 1947 generalized that lesson. After Britain announced it could no longer fund the Greek government against communist insurgents, Truman went to Congress and asked for aid plus a broader principle: the U.S. would help free peoples resist armed minorities or outside pressures. That principle, called containment, made every communist movement a U.S. concern by default. The Marshall Plan a few months later was containment applied to economics. Aid would prevent the conditions that made communism attractive.

The Berlin Blockade in 1948 turned the conflict from policy into confrontation. When the Soviets cut off ground access to West Berlin, the U.S. responded with an airlift that ran for almost a year. The blockade ended with the Soviets backing down, but the airlift made permanent what had been provisional. West Germany would be a Western state. Eastern Germany would not. NATO followed in 1949 as the formal lock on that division.

By the end of 1949 the rules were set, and the next forty years played out within them.`,
  },
};
