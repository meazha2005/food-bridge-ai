import { NextRequest, NextResponse } from 'next/server';
import { execute, PREFIX, recordAudit } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 403 });
    }

    const orgId = parseInt(params.id, 10);
    const { status, notes } = await req.json();

    if (!status || !['pending', 'verified', 'rejected', 'suspended'].includes(status)) {
      return NextResponse.json({ error: 'Invalid verification status' }, { status: 400 });
    }

    await execute(
      `UPDATE ${PREFIX}organizations 
       SET verification_status = ?, verification_notes = ?, verified_at = CASE WHEN ? = 'verified' THEN NOW() ELSE verified_at END 
       WHERE id = ?`,
      [status, notes || null, status, orgId]
    );

    await recordAudit(user.id, user.name, 'ORGANIZATION_VERIFICATION', 'ORGANIZATION', orgId, { status, notes });

    return NextResponse.json({ success: true, message: `Organization status updated to ${status}` });
  } catch (err: any) {
    return NextResponse.json({ error: 'Update failed: ' + err.message }, { status: 500 });
  }
}
