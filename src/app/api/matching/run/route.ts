import { NextRequest, NextResponse } from 'next/server';
import { runMatchingEngine } from '@/lib/matching';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    // Matching engine can be run by admins, NGOs, or authorized users
    const results = await runMatchingEngine();
    return NextResponse.json({ success: true, ...results });
  } catch (err: any) {
    console.error('Matching engine run error:', err);
    return NextResponse.json({ error: 'Matching failed: ' + err.message }, { status: 500 });
  }
}
