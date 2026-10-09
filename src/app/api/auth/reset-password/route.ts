import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, PREFIX } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    const user = await queryOne(
      `SELECT id FROM ${PREFIX}users WHERE reset_token = ? AND reset_token_expiry > NOW()`,
      [token]
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired password reset token' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword);
    await execute(
      `UPDATE ${PREFIX}users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?`,
      [hashedPassword, user.id]
    );

    return NextResponse.json({ success: true, message: 'Password has been successfully updated. You can now log in.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Password reset failed: ' + err.message }, { status: 500 });
  }
}
