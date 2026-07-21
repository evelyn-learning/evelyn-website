/** Assembles the mock-review tutor context: getReview() + focus selection
 *  + score header. Throws getReview's own errors (not_found/forbidden/
 *  not_ready) untranslated — the route maps them to HTTP codes. */
import { getReview } from './report';
import type { MockStores } from './service';
import { buildMockReviewContext, type MockReviewContext } from './review-focus';

export async function getMockReviewContext(
  stores: MockStores,
  studentId: string,
  attemptId: string,
): Promise<MockReviewContext> {
  const review = await getReview(stores, studentId, attemptId);
  const attempt = await stores.findAttempt(attemptId);
  if (!attempt) throw new Error('not_found');
  const form = await stores.findForm(attempt.formId);
  return buildMockReviewContext({
    formLabel: form?.label ?? attempt.formId,
    composite: attempt.scaled?.composite ?? 0,
    compositeMax: attempt.scaled?.compositeMax ?? 0,
    items: review.items,
  });
}
