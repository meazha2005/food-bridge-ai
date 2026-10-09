import { NextRequest, NextResponse } from 'next/server';
import { query, PREFIX } from '@/lib/db';

export async function GET() {
  try {
    const runs = await query(
      `SELECT id, scenario_type, scenario_config, original_metrics, revised_metrics, created_at
       FROM ${PREFIX}simulation_runs
       ORDER BY created_at DESC
       LIMIT 20`
    );
    return NextResponse.json({ runs });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch simulation runs' }, { status: 500 });
  }
}
