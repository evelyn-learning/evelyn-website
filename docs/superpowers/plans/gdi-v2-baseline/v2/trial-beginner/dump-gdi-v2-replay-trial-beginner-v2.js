const d = db.tutorsessions.find({studentId:"gdi-v2-replay-trial-beginner-v2"}).sort({createdAt:-1}).limit(1).toArray()[0];
if (!d) { print("NOT FOUND"); quit(1); }
const t0 = new Date(d.createdAt || d.startedAt).getTime();
const rel = (ts) => ts ? (Math.round((new Date(ts).getTime()-t0)/1000)+"s").padStart(6) : "     ?";
print(JSON.stringify({sessionId:d.sessionId, studentId:d.studentId, createdAt:d.createdAt, endedAt:d.endedAt, turns:(d.transcript||[]).length, events:(d.debugEvents||[]).length, wb:(d.whiteboardCommands||[]).length, lp:d.lessonProgress}));
print("=== TRANSCRIPT");
(d.transcript||[]).forEach((t,i)=>print(`${rel(t.timestamp)} ${String(i).padStart(3)} ${t.role}: ${t.text}`));
print("=== WHITEBOARD");
(d.whiteboardCommands||[]).forEach((w,i)=>print(`${rel(w.timestamp)} ${String(i).padStart(3)} ${JSON.stringify(w).slice(0,3000)}`));
print("=== EVENTS");
(d.debugEvents||[]).forEach((e)=>print(`${rel(e.timestamp)} ${e.type}: ${String(e.message).slice(0,500)}`));
