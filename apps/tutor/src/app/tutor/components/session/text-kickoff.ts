/** Round 4 (E5): when the text-mode tutor speaks first. Round 2: a homework
 *  session once its problems are loaded. Round 4: ANY goal when the host sets
 *  the `tutor_opens` claim — once the plan is loaded, or at once when there is
 *  no plan. Voice never (the mic tap starts it). Pure. */
export function textKickoffReady(i: {
  sessionMode: string;
  sessionGoal: string;
  tutorOpens: boolean;
  homeworkReady: boolean;
  hasPlanId: boolean;
  planLoaded: boolean;
}): boolean {
  if (i.sessionMode !== 'text') return false;
  if (i.sessionGoal === 'homework-help' && i.homeworkReady) return true;
  if (!i.tutorOpens) return false;
  return i.hasPlanId ? i.planLoaded : true;
}

/** Same opener the mic-tap start sends: a plan → [start lesson], else [start session]. */
export function textKickoffMessage(hasPlan: boolean): '[start lesson]' | '[start session]' {
  return hasPlan ? '[start lesson]' : '[start session]';
}
