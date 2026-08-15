import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const info = await transporter.sendMail({
      from: `"Evelyn Learning" <${process.env.EMAIL_FROM || 'info@evelynlearning.com'}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('[EMAIL] Message sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EMAIL] Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Template variable replacement
export function replaceTemplateVars(
  template: string,
  vars: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

// Parse subject from template (expects "Subject: ..." on first line)
export function parseSubjectAndBody(template: string): { subject: string; body: string } {
  const lines = template.split('\n');
  let subject = '';
  let bodyStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().startsWith('subject:')) {
      subject = line.substring(8).trim();
      bodyStartIndex = i + 1;
      // Skip empty line after subject
      if (lines[bodyStartIndex]?.trim() === '') {
        bodyStartIndex++;
      }
      break;
    }
  }

  const body = lines.slice(bodyStartIndex).join('\n').trim();

  return { subject, body };
}

// Send outreach email for a showcase site
export async function sendOutreachEmail(
  template: string,
  recipientEmail: string,
  vars: {
    businessName: string;
    demoUrl: string;
    accessCode: string;
    [key: string]: string;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Replace template variables
  const filledTemplate = replaceTemplateVars(template, vars);

  // Parse subject and body
  const { subject, body } = parseSubjectAndBody(filledTemplate);

  if (!subject) {
    return { success: false, error: 'No subject line found in template' };
  }

  // Convert plain text to simple HTML (preserve line breaks)
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      ${body.split('\n').map(line =>
        line.trim() === '' ? '<br>' : `<p style="margin: 0 0 10px 0;">${line}</p>`
      ).join('')}
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    subject,
    text: body,
    html,
  });
}
