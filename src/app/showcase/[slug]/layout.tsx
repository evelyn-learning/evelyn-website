import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB, isDBConfigured } from '@core/db';
import { ShowcaseSite } from '@/models';
import { ShowcaseLayoutClient } from './ShowcaseLayoutClient';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSiteData(slug: string): Promise<any | null> {
  if (!isDBConfigured()) return null;

  try {
    await connectDB();
    const site = await ShowcaseSite.findOne({ slug }).lean();
    if (!site) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const siteDoc = site as any;

    // Convert MongoDB document to plain object for client components
    return {
      slug: siteDoc.slug,
      businessName: siteDoc.businessName,
      tagline: siteDoc.tagline || '',
      businessType: siteDoc.businessType,
      originalWebsiteUrl: siteDoc.originalWebsiteUrl,
      branding: {
        primaryColor: siteDoc.branding?.primaryColor || '#10B981',
        secondaryColor: siteDoc.branding?.secondaryColor || '#0F766E',
        accentColor: siteDoc.branding?.accentColor || '#F59E0B',
        logoUrl: siteDoc.branding?.logoUrl,
        logoText: siteDoc.branding?.logoText || siteDoc.businessName?.split(' ').map((w: string) => w[0]).join('').slice(0, 3),
        heroImageUrl: siteDoc.branding?.heroImageUrl,
      },
      contact: {
        phone: siteDoc.contact?.phone || '',
        email: siteDoc.contact?.email || '',
        address: siteDoc.contact?.address || '',
        businessHours: siteDoc.contact?.businessHours || '',
      },
      // Social media links
      social: siteDoc.social ? {
        facebook: siteDoc.social.facebook,
        twitter: siteDoc.social.twitter,
        instagram: siteDoc.social.instagram,
        linkedin: siteDoc.social.linkedin,
        youtube: siteDoc.social.youtube,
      } : undefined,
      pages: siteDoc.pages || {},
      // Serialize nested arrays to remove MongoDB _id fields
      testimonials: (siteDoc.testimonials || []).map((t: { quote?: string; author?: string; role?: string; imageUrl?: string }) => ({
        quote: t.quote || '',
        author: t.author || '',
        role: t.role || '',
        imageUrl: t.imageUrl,
      })),
      stats: (siteDoc.stats || []).map((s: { value?: string; label?: string }) => ({
        value: s.value || '',
        label: s.label || '',
      })),
      // Team members with their images
      team: (siteDoc.team || []).map((m: { name?: string; role?: string; bio?: string; imageUrl?: string }) => ({
        name: m.name || '',
        role: m.role || '',
        bio: m.bio || '',
        imageUrl: m.imageUrl,
      })),
      // All extracted images
      images: (siteDoc.images || []).map((i: { url?: string; alt?: string; context?: string }) => ({
        url: i.url || '',
        alt: i.alt || '',
        context: i.context || 'general',
      })),
      // Navigation items from original site (legacy)
      navItems: siteDoc.navItems || [],
      // Navigation with paths for dynamic routing
      navigation: (siteDoc.navigation || []).map((n: { label?: string; path?: string; originalUrl?: string }) => ({
        label: n.label || '',
        path: n.path || '/',
        originalUrl: n.originalUrl,
      })),
      // Scraped pages with sections for dynamic rendering
      scrapedPages: (siteDoc.scrapedPages || []).map((p: {
        path?: string;
        title?: string;
        navLabel?: string;
        sections?: Array<{
          type?: string;
          title?: string;
          subtitle?: string;
          content?: string;
          items?: string[];
          images?: Array<{ url?: string; alt?: string; caption?: string }>;
          cards?: Array<{ title?: string; description?: string; image?: string; price?: string; link?: string }>;
          backgroundColor?: string;
          textAlign?: string;
          fullWidth?: boolean;
        }>;
        heroImage?: string;
        metaDescription?: string;
      }) => ({
        path: p.path || '/',
        title: p.title || '',
        navLabel: p.navLabel,
        sections: (p.sections || []).map(s => ({
          type: s.type || 'text',
          title: s.title,
          subtitle: s.subtitle,
          content: s.content,
          items: s.items,
          images: s.images?.map(img => ({
            url: img.url || '',
            alt: img.alt || '',
            caption: img.caption,
          })),
          cards: s.cards?.map(c => ({
            title: c.title || '',
            description: c.description,
            image: c.image,
            price: c.price,
            link: c.link,
          })),
          backgroundColor: s.backgroundColor,
          textAlign: s.textAlign,
          fullWidth: s.fullWidth,
        })),
        heroImage: p.heroImage,
        metaDescription: p.metaDescription,
      })),
      enabledTools: siteDoc.enabledTools || ['test-generator', 'homework-helper', 'essay-scorer'],
      status: siteDoc.status,
      daysRemaining: Math.max(0, Math.ceil((new Date(siteDoc.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
      // Scrape metadata
      scrapeQuality: siteDoc.scrapeQuality,
      pagesScraped: siteDoc.pagesScraped,
    };
  } catch (error) {
    console.error('Error fetching showcase site:', error);
    return null;
  }
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteData(slug);

  if (!site) {
    return {
      title: 'Site Not Found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${site.businessName} | Powered by Evelyn Learning`,
    description: site.tagline || `${site.businessName} - AI-Powered Education`,
    robots: { index: false, follow: false },
  };
}

export default async function ShowcaseLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const site = await getSiteData(slug);

  if (!site) {
    notFound();
  }

  return <ShowcaseLayoutClient site={site}>{children}</ShowcaseLayoutClient>;
}
