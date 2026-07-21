import type { Passage } from '../types';

/**
 * AP Psychology Form A (mock exam) — Section II stimuli, 2 original passages.
 * ORIGINAL content authored for this mock; not derived from any released AP
 * exam. `appsych-mock-a-aaq` is a single research-study summary supporting
 * the Article Analysis Question (fr-01, 7 pts). `appsych-mock-a-ebq` is a
 * three-source packet (Source A / Source B / Source C) supporting the
 * Evidence-Based Question (fr-02, 7 pts) — one compiled passage per the
 * "multi-document packet = one passage" rule.
 */
export const APPSYCH_MOCK_A_PASSAGES: Passage[] = [
  {
    id: 'evelyn.passage.appsych-mock-a-aaq.v1',
    title: 'Breathing and Attention: A Classroom Intervention Study',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:appsych-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `Researchers at a suburban school district investigated whether a brief breathing exercise could improve high school students' sustained attention during the school day. The study recruited 120 students (ages 15-17) from introductory psychology classes at a single high school; all students and their parents provided informed consent before participation, and students were told they could withdraw from the study at any time without penalty.\n\n` +
      `Using a true experimental design, the researchers randomly assigned each student to one of two groups. Students in the breathing group listened to a recorded 10-minute diaphragmatic breathing script through headphones, following prompts to slow and deepen their breathing. Students in the control group spent the same 10 minutes silently reading a neutral, non-emotional magazine article about home gardening. This activity type served as the independent variable: each group completed a different, clearly defined 10-minute task (guided breathing versus silent reading).\n\n` +
      `Immediately afterward, all students completed the same 10-minute computerized continuous performance task (CPT), a standard measure in which students press a key whenever a target letter appears on screen among frequent distractor letters. The researchers operationally defined sustained attention as the number of correct target responses out of 100 possible trials on the CPT, with higher scores indicating better sustained attention.\n\n` +
      `Students in the breathing group scored a mean of 82.4 correct responses (SD = 6.1), compared to a mean of 74.7 (SD = 7.3) for the control group. An independent-samples t-test found this difference to be statistically significant, t(118) = 6.85, p < .001, indicating that the breathing group substantially outperformed the control group on the attention task.\n\n` +
      `The researchers noted several limitations. All participants were drawn from a single suburban high school and a single introductory psychology course, so the sample may not represent the broader population of adolescents in different school settings, socioeconomic circumstances, or geographic regions. The study protocol was reviewed and approved by the school district's institutional review board, which required that every student receive a full debriefing explaining the true purpose of the attention task, and that students in the control group be offered a copy of the breathing script afterward if they wished to try the exercise themselves.`,
    lineNumbered: false,
    wordCount: 360,
  },
  {
    id: 'evelyn.passage.appsych-mock-a-ebq.v1',
    title: 'Social Media Use and Adolescent Well-Being: Three Studies',
    author: 'Evelyn (original)',
    year: 2026,
    sourceUrl: 'internal:appsych-mock-a',
    license: 'internal-original',
    genre: 'informational',
    fullText:
      `Source A\n\n` +
      `A team of researchers surveyed 800 adolescents (ages 13-17) recruited from public middle and high schools in three states about their daily social media use and administered a validated anxiety questionnaire to each participant. Adolescents reported using social media apps for a combined average of 3.2 hours per day. Results showed a positive correlation between average daily social media use and self-reported anxiety scores (r = .35): adolescents who reported spending more time on social media tended to also report higher anxiety scores. The researchers cautioned that because the study was correlational, it cannot establish that social media use causes anxiety; a third variable, such as pre-existing anxiety leading adolescents to spend more time online seeking distraction, could also explain the pattern.\n\n` +
      `Source B\n\n` +
      `In a one-week experiment, 150 adolescents were randomly assigned to either a restricted-use condition, in which they limited social media use to 30 minutes per day using a phone-monitoring app, or a control condition, in which they continued their normal social media habits with no restriction. All participants completed the same life-satisfaction questionnaire both before and after the one-week period, so the researchers could compare each adolescent's change in score rather than relying on a single measurement. At the end of the week, adolescents in the restricted-use condition scored significantly higher on the standardized life-satisfaction questionnaire than adolescents in the control condition. Because participants were randomly assigned to conditions, the researchers concluded that reducing social media use caused an improvement in short-term self-reported life satisfaction for this sample of adolescents.\n\n` +
      `Source C\n\n` +
      `A separate study distinguished between two types of adolescent social media use: active use (for example, messaging close friends or commenting on posts) and passive use (for example, scrolling through others' posts without interacting). Researchers classified each adolescent's dominant use pattern from two weeks of app-usage logs rather than self-report, reducing the chance that participants misremembered their own habits. Adolescents who primarily engaged in active use showed well-being scores similar to adolescents who used social media only rarely. In contrast, adolescents who primarily engaged in passive use showed significantly lower well-being scores than both other groups, even after the researchers statistically controlled for total time spent on social media. The researchers concluded that the type of engagement, not simply the total amount of time spent on social media, may be the more important factor influencing adolescent well-being.`,
    lineNumbered: false,
    wordCount: 395,
  },
];
