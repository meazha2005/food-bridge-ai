import { NextRequest, NextResponse } from 'next/server';
import { runClimateSimulation, ScenarioParams } from '@/lib/simulator';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    const body: ScenarioParams = await req.json();

    if (!body.scenarioType) {
      return NextResponse.json({ error: 'scenarioType is required' }, { status: 400 });
    }

    const result = await runClimateSimulation(body, user?.id);
    return NextResponse.json({ success: true, simulation: result });
  } catch (err: any) {
    console.error('Simulation error:', err);
    return NextResponse.json({ error: 'Simulation execution failed: ' + err.message }, { status: 500 });
  }
}
