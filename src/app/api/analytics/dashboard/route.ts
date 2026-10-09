import { NextResponse } from 'next/server';
import { getPlatformAnalytics } from '@/lib/analytics';

export async function GET() {
  try {
    const data = await getPlatformAnalytics();
    return NextResponse.json({ success: true, analytics: data });
  } catch (err: any) {
    console.error('Analytics error:', err);
    return NextResponse.json({ error: 'Failed to compute analytics: ' + err.message }, { status: 500 });
  }
}
