import type { ExamBlueprint } from './types';
import { FIXTURE_BLUEPRINT } from './fixture';
import { DIGITAL_SAT_BLUEPRINT } from './digital-sat';

const REGISTRY: Record<string, ExamBlueprint> = {
  [FIXTURE_BLUEPRINT.examKey]: FIXTURE_BLUEPRINT,
  [DIGITAL_SAT_BLUEPRINT.examKey]: DIGITAL_SAT_BLUEPRINT,
};

export function getBlueprint(examKey: string): ExamBlueprint {
  const bp = REGISTRY[examKey];
  if (!bp) throw new Error(`Unknown exam blueprint: ${examKey}`);
  return bp;
}

export function registerBlueprint(bp: ExamBlueprint): void {
  REGISTRY[bp.examKey] = bp;   // used by digital-sat.ts and future blueprints
}

export function validateBlueprint(bp: ExamBlueprint): string[] {
  const problems: string[] = [];
  if (!bp.sections.length) problems.push('no sections');
  for (const sec of bp.sections) {
    if (!sec.modules.length) problems.push(`${sec.sectionId}: no modules`);
    if (sec.adaptive) {
      const from = sec.modules.find((m) => m.moduleId === sec.adaptive!.fromModuleId);
      if (!from) problems.push(`${sec.sectionId}: adaptive.fromModuleId not found`);
      const variants = sec.modules.filter((m) => m.variant).map((m) => m.variant);
      if (!variants.includes('easy') || !variants.includes('hard'))
        problems.push(`${sec.sectionId}: adaptive section needs easy+hard variant modules`);
    }
    const curve = bp.scoring.curves[sec.sectionId];
    if (!curve || !Object.keys(curve).length) problems.push(`${sec.sectionId}: no curve`);
    else {
      for (const [variant, anchors] of Object.entries(curve)) {
        for (let i = 1; i < anchors.length; i++) {
          if (anchors[i][0] <= anchors[i - 1][0] || anchors[i][1] < anchors[i - 1][1])
            problems.push(`${sec.sectionId}/${variant}: curve anchors not monotone`);
        }
      }
    }
  }
  if (bp.scoring.kind === 'ap-composite' && !bp.scoring.ap) problems.push('ap-composite without ap spec');
  return problems;
}

export * from './types';
