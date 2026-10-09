import { NextRequest, NextResponse } from 'next/server';
import { query, PREFIX } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { Delivery } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const driverId = searchParams.get('driverId');

    let sql = `
      SELECT d.*, 
             a.quantity_allocated, a.food_listing_id, a.food_request_id,
             l.food_name, l.category, l.unit, l.pickup_address, l.handling_instructions,
             s.name as supplier_name, s.latitude as supplier_lat, s.longitude as supplier_lng, s.contact_phone as supplier_phone,
             r.delivery_address, r.people_to_serve, r.urgency as recipient_urgency,
             rec.name as recipient_name, rec.latitude as recipient_lat, rec.longitude as recipient_lng, rec.contact_phone as recipient_phone,
             u.name as driver_name, u.phone as driver_phone
      FROM ${PREFIX}deliveries d
      JOIN ${PREFIX}food_allocations a ON d.allocation_id = a.id
      JOIN ${PREFIX}food_listings l ON a.food_listing_id = l.id
      JOIN ${PREFIX}organizations s ON l.supplier_organization_id = s.id
      JOIN ${PREFIX}food_requests r ON a.food_request_id = r.id
      JOIN ${PREFIX}organizations rec ON r.recipient_organization_id = rec.id
      LEFT JOIN ${PREFIX}users u ON d.driver_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      sql += ' AND d.delivery_status = ?';
      params.push(status);
    }

    if (driverId) {
      sql += ' AND d.driver_id = ?';
      params.push(driverId);
    }

    sql += ' ORDER BY d.created_at DESC';

    const deliveries = await query<Delivery>(sql, params);
    return NextResponse.json({ deliveries });
  } catch (err: any) {
    console.error('Fetch deliveries error:', err);
    return NextResponse.json({ error: 'Failed to fetch deliveries' }, { status: 500 });
  }
}
