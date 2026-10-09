import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, PREFIX, recordAudit } from '@/lib/db';
import { verifyPassword, signToken, getAuthCookieName } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user
    const user = await queryOne<any>(
      `SELECT u.*, o.name as organization_name, o.organization_type, o.verification_status as org_verification_status
       FROM ${PREFIX}users u
       LEFT JOIN ${PREFIX}organizations o ON u.organization_id = o.id
       WHERE u.email = ?`,
      [email.trim().toLowerCase()]
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.status === 'suspended') {
      return NextResponse.json({ error: 'Account suspended. Please contact platform admin.' }, { status: 403 });
    }

    // Verify password
    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Sign JWT
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      orgId: user.organization_id,
    });

    // Record Audit
    await recordAudit(user.id, user.name, 'USER_LOGIN', 'USER', user.id, { email: user.email, role: user.role });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      organization_id: user.organization_id,
      organization_name: user.organization_name,
      org_verification_status: user.org_verification_status,
      phone: user.phone,
    };

    const res = NextResponse.json({ success: true, user: safeUser });
    res.cookies.set(getAuthCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
