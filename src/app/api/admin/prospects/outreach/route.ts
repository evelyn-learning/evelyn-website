import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Prospect, ShowcaseSite, type IScrapedData } from "@/models";
import OpenAI from "openai";
import nodemailer from "nodemailer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Email transporter (configure in .env)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface OutreachContent {
  emailSubject: string;
  emailBody: string;
  contactFormMessage: string;
}

// Generate personalized outreach content
async function generateOutreachContent(
  prospect: {
    instituteName: string;
    website: string;
    services: string;
    techAssessment: string;
    potentialSolutions: string;
    scrapedData?: IScrapedData;
  },
  showcaseUrl: string,
  accessCode: string
): Promise<OutreachContent> {
  const scrapedData = prospect.scrapedData;
  const ownerName = scrapedData?.team?.[0]?.name || "there";
  const businessName = scrapedData?.businessName || prospect.instituteName;

  const prompt = `You are writing outreach messages for Evelyn Learning, an AI-powered education technology company. We've built a personalized demo website for this prospect to show them how AI can transform their business.

PROSPECT INFO:
- Business: ${businessName}
- Services: ${prospect.services}
- Tech Assessment: ${prospect.techAssessment}
- Suggested Solutions: ${prospect.potentialSolutions}
- Contact: ${ownerName}

DEMO INFO:
- Demo URL: ${showcaseUrl}
- Access Code: ${accessCode}

Write TWO messages:

1. EMAIL (4-5 paragraphs):
- Professional but warm tone
- Personalize based on their specific business and challenges
- Highlight how AI tools can help their specific services
- Include the demo URL and access code
- Include a clear call to action
- Sign off as "Praveen from Evelyn Learning"

2. CONTACT FORM MESSAGE (2-3 short paragraphs):
- Shorter, more direct version
- Same personalization
- Include demo URL and access code
- Friendly but professional

Return JSON:
{
  "emailSubject": "Subject line (personalized, compelling)",
  "emailBody": "Full email body with proper line breaks",
  "contactFormMessage": "Shorter contact form message"
}

Make both messages feel personal and specific to THIS business, not generic. Reference their actual services and potential pain points based on the tech assessment.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert at writing personalized, compelling sales outreach. Return only valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const text = response.choices[0]?.message?.content || "{}";

  // Parse JSON
  let jsonStr = text.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/```json?\n?/g, "").replace(/```$/g, "");
  }

  try {
    return JSON.parse(jsonStr);
  } catch {
    // Fallback content
    return {
      emailSubject: `AI-Powered Demo Site Built Just for ${businessName}`,
      emailBody: `Hi ${ownerName},

I noticed ${businessName} and was impressed by your ${prospect.services}. I'm reaching out from Evelyn Learning because we've built something specifically for education businesses like yours.

We've created a personalized demo website showing how AI can transform your operations - from automated practice test generation to 24/7 homework help bots to essay scoring tools.

Check out your custom demo here:
${showcaseUrl}
Access Code: ${accessCode}

I'd love to hear what you think. Feel free to reach out with any questions!

Best,
Praveen
Evelyn Learning
praveen@stayfari.com`,
      contactFormMessage: `Hi! I'm Praveen from Evelyn Learning. I built a personalized AI demo site just for ${businessName} to show how AI tools can enhance your ${prospect.services}.

Check it out: ${showcaseUrl}
Access Code: ${accessCode}

Would love to hear your thoughts!`,
    };
  }
}

// POST - Generate outreach content and optionally send
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, action, customEmail } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    await connectDB();

    const prospect = await Prospect.findOne({ slug });
    if (!prospect) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
    }

    // Get showcase info
    if (!prospect.showcaseSlug || !prospect.showcaseAccessCode) {
      return NextResponse.json(
        { error: "Showcase not created yet. Generate showcase first." },
        { status: 400 }
      );
    }

    const showcase = await ShowcaseSite.findOne({ slug: prospect.showcaseSlug });
    if (!showcase) {
      return NextResponse.json(
        { error: "Showcase not found" },
        { status: 404 }
      );
    }

    // Build showcase URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://evelynlearning.com";
    const showcaseUrl = `${baseUrl}/showcase/${prospect.showcaseSlug}`;

    // Generate outreach content
    const outreachContent = await generateOutreachContent(
      {
        instituteName: prospect.instituteName,
        website: prospect.website,
        services: prospect.services,
        techAssessment: prospect.techAssessment,
        potentialSolutions: prospect.potentialSolutions,
        scrapedData: prospect.scrapedData as IScrapedData | undefined,
      },
      showcaseUrl,
      prospect.showcaseAccessCode
    );

    // If action is just 'generate', return the content without sending
    if (action === "generate" || !action) {
      return NextResponse.json({
        success: true,
        outreach: outreachContent,
        showcaseUrl,
        accessCode: prospect.showcaseAccessCode,
        contactFormUrl: showcase.contactFormUrl || `${prospect.website}/contact`,
      });
    }

    // If action is 'send_email', actually send the email
    if (action === "send_email") {
      const recipientEmail = customEmail || prospect.scrapedData?.email;

      if (!recipientEmail) {
        return NextResponse.json(
          { error: "No email address available. Provide customEmail or scrape contact info first." },
          { status: 400 }
        );
      }

      // Send email
      await transporter.sendMail({
        from: `"Praveen from Evelyn Learning" <${process.env.SMTP_USER || "praveen@stayfari.com"}>`,
        to: recipientEmail,
        subject: outreachContent.emailSubject,
        text: outreachContent.emailBody,
        html: outreachContent.emailBody.replace(/\n/g, "<br>"),
      });

      // Log the outreach
      await Prospect.updateOne(
        { slug },
        {
          $push: {
            outreachLogs: {
              type: "email",
              sentAt: new Date(),
              subject: outreachContent.emailSubject,
              message: outreachContent.emailBody,
              status: "sent",
            },
          },
          $set: {
            lastOutreachAt: new Date(),
            status: prospect.status === "showcase_created" || prospect.status === "outreach_pending"
              ? "email_sent"
              : prospect.status,
          },
          $inc: { followUpCount: 1 },
        }
      );

      return NextResponse.json({
        success: true,
        message: `Email sent to ${recipientEmail}`,
        outreach: outreachContent,
      });
    }

    // If action is 'log_contact_form', just log that contact form was filled
    if (action === "log_contact_form") {
      await Prospect.updateOne(
        { slug },
        {
          $push: {
            outreachLogs: {
              type: "contact_form",
              sentAt: new Date(),
              message: outreachContent.contactFormMessage,
              status: "sent",
            },
          },
          $set: {
            lastOutreachAt: new Date(),
            status: prospect.status === "email_sent" ? "contacted" : prospect.status,
          },
        }
      );

      // Also update showcase
      await ShowcaseSite.updateOne(
        { slug: prospect.showcaseSlug },
        {
          $set: {
            contactFormFilledAt: new Date(),
            pendingContactForm: false,
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: "Contact form submission logged",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[PROSPECTS] Outreach Error:", error);
    return NextResponse.json(
      { error: `Failed to process outreach: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// GET - Get outreach content for preview
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    await connectDB();

    const prospect = await Prospect.findOne({ slug });
    if (!prospect) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
    }

    if (!prospect.showcaseSlug) {
      return NextResponse.json(
        { error: "Showcase not created yet" },
        { status: 400 }
      );
    }

    const showcase = await ShowcaseSite.findOne({ slug: prospect.showcaseSlug });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://evelynlearning.com";
    const showcaseUrl = `${baseUrl}/showcase/${prospect.showcaseSlug}`;

    const outreachContent = await generateOutreachContent(
      {
        instituteName: prospect.instituteName,
        website: prospect.website,
        services: prospect.services,
        techAssessment: prospect.techAssessment,
        potentialSolutions: prospect.potentialSolutions,
        scrapedData: prospect.scrapedData as IScrapedData | undefined,
      },
      showcaseUrl,
      prospect.showcaseAccessCode || ""
    );

    return NextResponse.json({
      outreach: outreachContent,
      showcaseUrl,
      accessCode: prospect.showcaseAccessCode,
      contactFormUrl: showcase?.contactFormUrl || `${prospect.website}/contact`,
      recipientEmail: prospect.scrapedData?.email,
    });
  } catch (error) {
    console.error("[PROSPECTS] Get Outreach Error:", error);
    return NextResponse.json(
      { error: `Failed to get outreach: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
