'use client';

import { usePathname } from 'next/navigation';
import { EducationalOrganizationJsonLd, WebSiteJsonLd } from '@core/components/seo/JsonLd';
import { isPartnerFramePath } from '@/lib/tutor/portal/partner-frame-metadata';

/**
 * The site's organisation / website structured data, on every page EXCEPT
 * the two documents served inside a partner's product (session embed and
 * replay) — there it named this company in the page source of a white-label
 * session. The root layout cannot know the path, so the choice is made here.
 * Every other page renders exactly the two scripts the root layout rendered
 * directly before.
 */
export function SiteJsonLd() {
  const pathname = usePathname();
  if (isPartnerFramePath(pathname)) return null;
  return (
    <>
      <EducationalOrganizationJsonLd />
      <WebSiteJsonLd />
    </>
  );
}
