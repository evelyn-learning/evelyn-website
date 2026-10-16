import { redirect } from "next/navigation";

/** Moved into the Tutor Sessions page as its "Practice grading" view. */
export default function PracticeGradingPage() {
  redirect("/admin/tutor-sessions?view=grading");
}
