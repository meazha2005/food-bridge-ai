import { NextRequest, NextResponse } from 'next/server';
import { query, PREFIX } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const logs = await query(
      `SELECT * FROM ${PREFIX}audit_logs ORDER BY created_at DESC LIMIT 50`
    );

    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
