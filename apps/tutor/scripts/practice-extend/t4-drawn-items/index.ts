/** Every T4 drawn item, by writing group (objectives.ts). */
import type { DrawnItem } from './kit';
import { ITEMS as ALG1 } from './alg1';
import { ITEMS as GEOM } from './geom';
import { ITEMS as CALCBC_STATS } from './calcbc-stats';
import { ITEMS as ALG2 } from './alg2';
import { ITEMS as PRECALC } from './precalc';
import { ITEMS as CALCAB } from './calcab';

export const T4_ITEMS: Record<string, DrawnItem[]> = {
  alg1: ALG1,
  geom: GEOM,
  'calcbc-stats': CALCBC_STATS,
  alg2: ALG2,
  precalc: PRECALC,
  calcab: CALCAB,
};
