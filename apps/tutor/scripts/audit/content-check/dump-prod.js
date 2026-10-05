// READ-ONLY (find/count only). Dumps everything the engine's practice retrieval reads for the 21 GAC Self Study courses.
const ga=db.getSiblingDB("greenapple");
const keys=['ALGEBRA_1','GEOMETRY','BIOLOGY','CHEMISTRY','AP_CALCULUS_BC','AP_STATISTICS','AP_ENVIRONMENTAL_SCIENCE','AP_PSYCHOLOGY','AP_MACROECONOMICS','AP_US_GOVERNMENT','AP_US_HISTORY','AP_WORLD_HISTORY','AP_ENGLISH_LANGUAGE','HS_ENGLISH','WORLD_HISTORY','PHYSICS','PRECALCULUS','ALGEBRA_2','AP_CALCULUS_AB','AP_BIOLOGY','AP_CHEMISTRY'];
const out={dumpedAt:new Date().toISOString(),courses:[],bankIdsByLo:{},bankTotalByLo:{},planIdsByLo:{},bank:[],plans:[]};
const bankIds=new Set(), planIds=new Set();
for(const k of keys){
  const c=ga.courses.findOne({key:k});
  if(!c){out.courses.push({key:k,missing:true});continue;}
  const nodes=ga.coursenodes.find({courseId:c._id}).sort({order:1}).toArray();
  out.courses.push({key:k,id:String(c._id),title:c.title,published:c.published,nodes:nodes.map(n=>({loId:n.loId,title:n.title,unit:n.unit,order:n.order,type:n.type,isFreestyle:n.isFreestyle,seedLessonPlanId:n.seedLessonPlanId}))});
  for(const n of nodes){
    const lo=n.loId; if(!lo||out.bankIdsByLo[lo]) continue;
    const f={loId:lo,id:{$not:/^brain-gen\./},bankScope:{$ne:"mock"}};
    const ids=db.problembanks.find(f,{id:1,_id:0}).limit(50).toArray().map(r=>r.id);
    out.bankIdsByLo[lo]=ids; ids.forEach(i=>bankIds.add(i));
    if(ids.length>=50) out.bankTotalByLo[lo]=db.problembanks.countDocuments(f);
    const pids=db.lessonplans.find({'los.id':lo,_id:{$not:/^rev-/},'metadata.reviewPlan':{$ne:true}},{_id:1}).limit(20).toArray().map(r=>String(r._id));
    out.planIdsByLo[lo]=pids; pids.forEach(i=>planIds.add(i));
  }
}
out.bank=db.problembanks.find({id:{$in:[...bankIds]}},{embedding:0}).toArray();
out.plans=db.lessonplans.find({_id:{$in:[...planIds]}}).toArray();
out.genCounterToday=db.practicegencounters.findOne({day:new Date().toISOString().slice(0,10),scopeKey:"global"});
print(EJSON.stringify(out,{relaxed:true}));
