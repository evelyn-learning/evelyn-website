// Targets are the /solutions/[segment] pages (separate plan:
// 2026-08-04-solutions-segment-pages.md). Fallback "/" until a page ships.
//
// Round 2 §2: the segment list is open, so this is keyed by plain string
// rather than the (now string) LeadSegment alias — an operator-created
// segment simply has no landing page and falls through to "/". Importing the
// type from models/Lead would also drag mongoose into this module.
const MAP: Record<string, string> = {
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

export function landingPathForSegment(segment: string): string {
  return MAP[segment] ?? "/";
}
