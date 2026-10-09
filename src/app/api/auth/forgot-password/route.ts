import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { queryOne, execute, PREFIX } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await queryOne(`SELECT id, name FROM ${PREFIX}users WHERE email = ?`, [cleanEmail]);

    if (!user) {
      // Don't reveal if user does not exist for security
      return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been dispatched to your email.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await execute(
      `UPDATE ${PREFIX}users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?`,
      [token, expiry, user.id]
    );

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    await sendPasswordResetEmail(cleanEmail, resetUrl);

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your email address.',
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ error: 'Failed to process password reset request' }, { status: 500 });
  }
}
