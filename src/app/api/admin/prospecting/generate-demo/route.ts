import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { ShowcaseSite, ProspectingConfig, generateAccessCode, type BusinessType } from '@/models';

interface GenerateDemoRequest {
  // Required
  businessName: string;
  websiteUrl: string;
  businessType: BusinessType;

  // Status control
  status?: 'draft' | 'needs_review';
  reviewNotes?: string; // Questions or clarifications needed

  // Optional - extracted from website
  tagline?: string;
  location?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    businessHours?: string;
  };
  contactFormUrl?: string;

  // Branding
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string;

  // Content
  heroTitle?: string;
  heroSubtitle?: string;
  aboutContent?: string;
  services?: Array<{
    name: string;
    description: string;
    icon?: string;
  }>;
  programs?: Array<{
    name: string;
    description: string;
    features?: string[];
    price?: string;
  }>;
  team?: Array<{
    name: string;
    role: string;
    bio?: string;
    imageUrl?: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    role?: string;
  }>;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

// POST - Generate a demo site from scraped content
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const data: GenerateDemoRequest = await request.json();

    // Validate required fields
    if (!data.businessName || !data.websiteUrl || !data.businessType) {
      return NextResponse.json(
        { error: 'businessName, websiteUrl, and businessType are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate slug from business name
    const baseSlug = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug exists, append number if needed
    let slug = baseSlug;
    let counter = 1;
    while (await ShowcaseSite.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Check if website URL already has a showcase
    const existingSite = await ShowcaseSite.findOne({
      originalWebsiteUrl: data.websiteUrl,
    });
    if (existingSite) {
      return NextResponse.json(
        { error: 'A showcase site already exists for this website', existingSlug: existingSite.slug },
        { status: 409 }
      );
    }

    // Generate access code
    const accessCode = generateAccessCode(data.businessName);

    // Calculate expiry date (14 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14);

    // Determine status (default: draft, can be needs_review)
    const status = data.status || 'draft';

    // Build the showcase site
    const site = await ShowcaseSite.create({
      slug,
      businessName: data.businessName,
      tagline: data.tagline || `Expert ${data.businessType.replace('-', ' ')} services`,
      businessType: data.businessType,
      originalWebsiteUrl: data.websiteUrl,
      accessCode,
      status,
      reviewNotes: data.reviewNotes,
      reviewCreatedAt: data.reviewNotes ? new Date() : undefined,
      expiryDate,
      trialDays: 14,

      // Branding
      branding: {
        primaryColor: data.primaryColor || '#10B981',
        secondaryColor: data.secondaryColor || '#0F766E',
        accentColor: data.accentColor || '#F59E0B',
        logoText: data.businessName,
        logoUrl: data.logoUrl,
      },

      // Contact
      contact: {
        email: data.contact?.email || '',
        phone: data.contact?.phone || '',
        address: data.contact?.address || '',
        businessHours: data.contact?.businessHours || '',
      },

      // Contact form URL for outreach
      contactFormUrl: data.contactFormUrl || `${data.websiteUrl}/contact`,

      // Multi-page content
      pages: {
        home: {
          hero: {
            title: data.heroTitle || data.businessName,
            subtitle: data.heroSubtitle || data.tagline || 'Helping students achieve their academic goals',
            ctaText: 'Get Started',
            ctaLink: '/contact',
          },
          services: data.services || [
            { name: 'Personalized Tutoring', description: 'One-on-one instruction tailored to your needs', icon: 'BookOpen' },
            { name: 'Test Preparation', description: 'SAT, ACT, and other standardized test prep', icon: 'Target' },
            { name: 'Academic Support', description: 'Help with homework, essays, and projects', icon: 'GraduationCap' },
          ],
          stats: data.stats || [
            { value: '500+', label: 'Students Helped' },
            { value: '95%', label: 'Success Rate' },
            { value: '10+', label: 'Years Experience' },
          ],
        },
        about: {
          title: `About ${data.businessName}`,
          content: data.aboutContent || `${data.businessName} is dedicated to helping students achieve their full academic potential. We provide personalized instruction and support to help every student succeed.`,
          mission: 'To empower students with the knowledge and skills they need to excel academically and beyond.',
        },
        programs: {
          title: 'Our Programs',
          description: 'Comprehensive programs designed to help you succeed',
          programs: data.programs || [
            {
              name: 'SAT Prep',
              description: 'Comprehensive SAT preparation program',
              features: ['Practice tests', 'Strategy sessions', 'Score improvement guarantee'],
            },
            {
              name: 'Academic Tutoring',
              description: 'One-on-one tutoring for all subjects',
              features: ['Math', 'Science', 'English', 'History'],
            },
          ],
        },
        team: data.team && data.team.length > 0 ? {
          title: 'Meet Our Team',
          description: 'Experienced educators dedicated to your success',
          members: data.team,
        } : null,
        contact: {
          title: 'Contact Us',
          description: 'Ready to get started? Reach out to us today.',
        },
      },

      // Testimonials
      testimonials: data.testimonials || [
        { quote: 'Amazing results! My test scores improved significantly.', author: 'Happy Student', role: 'SAT Prep Student' },
        { quote: 'The tutors are knowledgeable and patient.', author: 'Parent', role: 'Parent of tutoring student' },
      ],

      // Stats
      stats: data.stats || [
        { value: '500+', label: 'Students Helped' },
        { value: '95%', label: 'Success Rate' },
      ],

      // AI Tools
      enabledTools: ['test-generator', 'homework-helper', 'essay-scorer'],
      toolLimits: {
        'test-generator': 5,
        'homework-helper': 10,
        'essay-scorer': 3,
      },

      // Analytics
      analytics: {
        totalViews: 0,
        uniqueVisitors: 0,
        toolUsage: {},
        viewHistory: [],
      },
    });

    // Update prospecting config - add to candidates and increment stats
    const config = await ProspectingConfig.findOne();
    if (config) {
      // Add or update candidate
      const existingCandidateIndex = config.candidates.findIndex(
        (c: { websiteUrl: string }) => c.websiteUrl === data.websiteUrl
      );

      if (existingCandidateIndex >= 0) {
        config.candidates[existingCandidateIndex].status = 'demo_created';
        config.candidates[existingCandidateIndex].showcaseSlug = slug;
      } else {
        config.candidates.push({
          businessName: data.businessName,
          websiteUrl: data.websiteUrl,
          location: data.location,
          contactEmail: data.contact?.email,
          contactPhone: data.contact?.phone,
          contactFormUrl: data.contactFormUrl,
          discoveredAt: new Date(),
          status: 'demo_created',
          showcaseSlug: slug,
        });
        config.totalDiscovered += 1;
      }

      config.totalDemosCreated += 1;
      config.lastProspectingRun = new Date();
      await config.save();
    }

    console.log(`[GENERATE_DEMO] Created demo site ${slug} for ${data.businessName} (status: ${status})`);

    return NextResponse.json({
      success: true,
      site: {
        slug: site.slug,
        businessName: site.businessName,
        accessCode: site.accessCode,
        status: site.status,
        expiryDate: site.expiryDate,
      },
      demoUrl: `/showcase/${slug}`,
      accessCode,
    });
  } catch (error) {
    console.error('[GENERATE_DEMO] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate demo site' },
      { status: 500 }
    );
  }
}
