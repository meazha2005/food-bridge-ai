import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, PREFIX, recordAudit } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { FoodListing } from '@/types';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const listingId = parseInt(params.id, 10);
    const listing = await queryOne<FoodListing>(
      `SELECT l.*, o.name as supplier_name, o.contact_phone as supplier_phone, o.contact_email as supplier_email
       FROM ${PREFIX}food_listings l
       JOIN ${PREFIX}organizations o ON l.supplier_organization_id = o.id
       WHERE l.id = ?`,
      [listingId]
    );

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const listingId = parseInt(params.id, 10);
    const existing = await queryOne<FoodListing>(
      `SELECT * FROM ${PREFIX}food_listings WHERE id = ?`,
      [listingId]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Role verification: only the owner or admin
    if (user.role !== 'admin' && existing.supplier_organization_id !== user.organization_id) {
      return NextResponse.json({ error: 'Forbidden. You do not own this listing.' }, { status: 403 });
    }

    const body = await req.json();
    const { quantity_total, pickup_deadline, condition_state, storage_type, status } = body;

    const updates: string[] = [];
    const values: any[] = [];

    if (quantity_total !== undefined) {
      const newTotal = parseFloat(quantity_total);
      if (newTotal < Number(existing.quantity_reserved)) {
        return NextResponse.json({ error: `Cannot reduce total quantity below reserved quantity (${existing.quantity_reserved} ${existing.unit})` }, { status: 400 });
      }
      const newAvail = newTotal - Number(existing.quantity_reserved);
      updates.push('quantity_total = ?', 'quantity_available = ?');
      values.push(newTotal, newAvail);
    }

    if (pickup_deadline) {
      updates.push('pickup_deadline = ?');
      values.push(new Date(pickup_deadline));
    }

    if (condition_state) {
      updates.push('condition_state = ?');
      values.push(condition_state);
    }

    if (storage_type) {
      updates.push('storage_type = ?');
      values.push(storage_type);
    }

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: 'No changes provided' });
    }

    values.push(listingId);
    await execute(
      `UPDATE ${PREFIX}food_listings SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    await recordAudit(user.id, user.name, 'UPDATE_LISTING', 'FOOD_LISTING', listingId, body);

    return NextResponse.json({ success: true, message: 'Listing updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Update failed: ' + err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const listingId = parseInt(params.id, 10);
    const existing = await queryOne<FoodListing>(
      `SELECT * FROM ${PREFIX}food_listings WHERE id = ?`,
      [listingId]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (user.role !== 'admin' && existing.supplier_organization_id !== user.organization_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (Number(existing.quantity_reserved) > 0) {
      return NextResponse.json({ error: 'Cannot cancel listing with active reservations.' }, { status: 400 });
    }

    await execute(
      `UPDATE ${PREFIX}food_listings SET status = 'cancelled' WHERE id = ?`,
      [listingId]
    );

    await recordAudit(user.id, user.name, 'CANCEL_LISTING', 'FOOD_LISTING', listingId);

    return NextResponse.json({ success: true, message: 'Listing cancelled successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Cancellation failed: ' + err.message }, { status: 500 });
  }
}
