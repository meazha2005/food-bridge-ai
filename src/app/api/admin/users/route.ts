import { NextRequest, NextResponse } from 'next/server';
import { query, execute, PREFIX, recordAudit } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const users = await query(
      `SELECT u.id, u.name, u.email, u.role, u.status, u.phone, u.created_at,
              o.name as organization_name, o.organization_type
       FROM ${PREFIX}users u
       LEFT JOIN ${PREFIX}organizations o ON u.organization_id = o.id
       ORDER BY u.created_at DESC`
    );

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId, status } = await req.json();
    if (!userId || !['active', 'pending', 'suspended'].includes(status)) {
      return NextResponse.json({ error: 'Invalid user or status' }, { status: 400 });
    }

    await execute(`UPDATE ${PREFIX}users SET status = ? WHERE id = ?`, [status, userId]);
    await recordAudit(user.id, user.name, 'UPDATE_USER_STATUS', 'USER', userId, { status });

    return NextResponse.json({ success: true, message: `User status set to ${status}` });
  } catch (err: any) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
