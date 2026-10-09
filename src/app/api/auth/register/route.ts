import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, PREFIX, recordAudit } from '@/lib/db';
import { hashPassword, signToken, getAuthCookieName } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      role,
      phone,
      organizationName,
      organizationType,
      address,
      city,
      latitude,
      longitude,
      storageCapacity,
      storageType,
    } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Name, email, password, and role are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existing = await queryOne(`SELECT id FROM ${PREFIX}users WHERE email = ?`, [cleanEmail]);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    let organizationId: number | null = null;

    // Create organization if role requires it
    if (['supplier', 'ngo', 'recipient'].includes(role) && organizationName) {
      const orgType = organizationType || role;
      const orgResult = await execute(
        `INSERT INTO ${PREFIX}organizations 
         (name, organization_type, verification_status, address, city, latitude, longitude, storage_capacity, storage_type, contact_email, contact_phone)
         VALUES (?, ?, 'verified', ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          organizationName,
          orgType,
          address || 'Chennai, Tamil Nadu',
          city || 'Chennai',
          latitude ? parseFloat(latitude) : 13.0827,
          longitude ? parseFloat(longitude) : 80.2707,
          storageCapacity ? parseFloat(storageCapacity) : 1000.0,
          storageType || 'ambient',
          cleanEmail,
          phone || null,
        ]
      );
      organizationId = orgResult.insertId;
    }

    // Insert user
    const userResult = await execute(
      `INSERT INTO ${PREFIX}users (name, email, password_hash, role, status, organization_id, phone)
       VALUES (?, ?, ?, ?, 'active', ?, ?)`,
      [name, cleanEmail, hashedPassword, role, organizationId, phone || null]
    );
    const userId = userResult.insertId;

    if (organizationId) {
      await execute(
        `INSERT INTO ${PREFIX}organization_members (organization_id, user_id, member_role) VALUES (?, ?, 'owner')`,
        [organizationId, userId]
      );
    }

    // Record audit
    await recordAudit(userId, name, 'USER_REGISTER', 'USER', userId, { role, organizationId });

    // Try sending welcome email asynchronously
    sendWelcomeEmail(cleanEmail, name, role).catch((e) => console.error('Failed to send welcome email:', e));

    // Sign JWT
    const token = signToken({
      userId,
      email: cleanEmail,
      role,
      orgId: organizationId,
    });

    const safeUser = {
      id: userId,
      name,
      email: cleanEmail,
      role,
      status: 'active',
      organization_id: organizationId,
      organization_name: organizationName || null,
      phone,
    };

    const res = NextResponse.json({ success: true, user: safeUser });
    res.cookies.set(getAuthCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Registration failed. ' + err.message }, { status: 500 });
  }
}
