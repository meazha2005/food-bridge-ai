import { NextRequest, NextResponse } from 'next/server';
import { query, PREFIX } from '@/lib/db';
import { Organization } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let sql = `SELECT * FROM ${PREFIX}organizations WHERE 1=1`;
    const params: any[] = [];

    if (type && type !== 'all') {
      sql += ' AND organization_type = ?';
      params.push(type);
    }
    if (status && status !== 'all') {
      sql += ' AND verification_status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const organizations = await query<Organization>(sql, params);
    return NextResponse.json({ organizations });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}
