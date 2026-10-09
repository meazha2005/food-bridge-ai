import { NextRequest, NextResponse } from 'next/server';
import { query, execute, PREFIX } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { NotificationItem } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ notifications: [] });
    }

    const notifications = await query<NotificationItem>(
      `SELECT * FROM ${PREFIX}notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30`,
      [user.id]
    );

    return NextResponse.json({ notifications });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, markAll } = await req.json();

    if (markAll) {
      await execute(`UPDATE ${PREFIX}notifications SET read_at = NOW() WHERE user_id = ?`, [user.id]);
    } else if (id) {
      await execute(`UPDATE ${PREFIX}notifications SET read_at = NOW() WHERE id = ? AND user_id = ?`, [id, user.id]);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
