import type { LeadSegment } from "../../models/Lead";

// Targets are the /solutions/[segment] pages (separate plan:
// 2026-08-04-solutions-segment-pages.md). Fallback "/" until a page ships.
const MAP: Record<LeadSegment, string> = {
  nursing_program: "/solutions/nursing",
  testprep_academy: "/solutions/test-prep-academies",
  homeschool_charter: "/solutions/homeschool-charters",
  microschool: "/solutions/schools",
  school_district: "/solutions/schools",
  private_school: "/solutions/schools",
  intl_school: "/solutions/schools",
  library: "/",
  publisher: "/solutions/publishers-agencies",
  agency: "/solutions/publishers-agencies",
  corporate_ld: "/solutions/corporate-ld",
  other: "/",
};

export function landingPathForSegment(segment: LeadSegment): string {
  return MAP[segment] ?? "/";
}
