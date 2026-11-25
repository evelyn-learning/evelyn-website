import { JsonLd } from '../../components/JsonLd';
import { breadcrumbLd } from '../../seo';

/** The docs page's place in the site as structured data (BreadcrumbList). Nothing visible: the sidebar is the
 *  visible navigation. */
export function DocsBreadcrumb({ path }: { path: string }) {
  return <JsonLd data={breadcrumbLd(path)} />;
}
