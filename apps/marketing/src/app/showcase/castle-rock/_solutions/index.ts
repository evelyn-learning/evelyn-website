import type { Solution, Subject } from "../_lib/types";
import { biology304631 } from "./biology-304631";
import { chemistry193246 } from "./chemistry-193246";
import { math303439 } from "./math-303439";
import { physics234035 } from "./physics-234035";

/** Every published sample. Add a solution file, then list it here. */
export const SOLUTIONS: Solution[] = [math303439, physics234035, chemistry193246, biology304631];

export const SUBJECT_ORDER: Subject[] = ["Mathematics", "Physics", "Chemistry", "Biology"];

export const findSolution = (itemId: string) => SOLUTIONS.find((s) => s.itemId === itemId);
