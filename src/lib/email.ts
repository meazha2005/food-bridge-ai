import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || 'founder@ztoitech.com';
const SMTP_PASS = process.env.SMTP_PASS || 'hdtamaqpmfwhyghg';
const SMTP_FROM = process.env.SMTP_FROM || '"FoodBridge AI" <founder@ztoitech.com>';

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('Email send failed:', err);
    return { success: false, error: err.message };
  }
}

export async function sendWelcomeEmail(to: string, name: string, role: string) {
  const subject = `Welcome to FoodBridge AI — ${role.toUpperCase()} Portal`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="background-color: #1b4d3e; padding: 15px; border-radius: 6px; text-align: center; color: white;">
        <h2 style="margin: 0;">FoodBridge AI</h2>
        <p style="margin: 5px 0 0 0; font-size: 13px;">Climate-Resilient Food Rescue & Distribution (SDG 2)</p>
      </div>
      <div style="padding: 20px 10px; color: #333;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for registering on <strong>FoodBridge AI</strong> as a <strong>${role}</strong>.</p>
        <p>Your account is ready. You can log in and start participating in dynamic food rescue operations across Tamil Nadu.</p>
        <div style="margin: 25px 0; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" 
             style="background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Access Dashboard
          </a>
        </div>
        <p style="font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 15px;">
          FoodBridge AI &bull; SDG 2 Zero Hunger &bull; Automated Climate-Disruption Resilient Logistics
        </p>
      </div>
    </div>
  `;
  return sendEmail({ to, subject, html });
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const subject = 'Password Reset Request — FoodBridge AI';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="background-color: #1b4d3e; padding: 15px; border-radius: 6px; text-align: center; color: white;">
        <h2 style="margin: 0;">FoodBridge AI</h2>
        <p style="margin: 5px 0 0 0; font-size: 13px;">Security & Password Recovery</p>
      </div>
      <div style="padding: 20px 10px; color: #333;">
        <p>You requested a password reset for your FoodBridge AI account.</p>
        <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
        <div style="margin: 25px 0; text-align: center;">
          <a href="${resetLink}" 
             style="background-color: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 12px; color: #888;">If you did not request this, you can safely ignore this email.</p>
      </div>
    </div>
  `;
  return sendEmail({ to, subject, html });
}
