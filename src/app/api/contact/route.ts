import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import { ContactSubmission } from "@/models";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Connect to database
    await connectDB();

    // Save to database
    const submission = await ContactSubmission.create({
      ...data,
      source: "contact-form",
      status: "new",
    });

    // Send email notification
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toISOString()}</small></p>
      `,
    });

    // Auto-reply to user
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: data.email,
      subject: "Thank you for contacting Evelyn Learning",
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Dear ${data.name},</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p>Here's a summary of your inquiry:</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p>Best regards,<br>The Evelyn Learning Team</p>
      `,
    });

    return NextResponse.json(
      { success: true, id: submission._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid form data", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
