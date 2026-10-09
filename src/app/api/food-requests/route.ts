import { NextRequest, NextResponse } from 'next/server';
import { query, execute, PREFIX, recordAudit } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { FoodRequest } from '@/types';

// GET /api/food-requests
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const urgency = searchParams.get('urgency');
    const status = searchParams.get('status');
    const recipientId = searchParams.get('recipientId');
    const search = searchParams.get('search');

    let sql = `
      SELECT r.*, o.name as recipient_name, o.city as recipient_city, o.contact_phone as recipient_phone
      FROM ${PREFIX}food_requests r
      JOIN ${PREFIX}organizations o ON r.recipient_organization_id = o.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category && category !== 'all') {
      sql += ' AND r.category = ?';
      params.push(category);
    }

    if (urgency && urgency !== 'all') {
      sql += ' AND r.urgency = ?';
      params.push(urgency);
    }

    if (status && status !== 'all') {
      sql += ' AND r.status = ?';
      params.push(status);
    }

    if (recipientId) {
      sql += ' AND r.recipient_organization_id = ?';
      params.push(recipientId);
    }

    if (search) {
      sql += ' AND (r.category LIKE ? OR r.urgency_reason LIKE ? OR o.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY r.created_at DESC';

    const requests = await query<FoodRequest>(sql, params);
    return NextResponse.json({ requests });
  } catch (err: any) {
    console.error('Fetch requests error:', err);
    return NextResponse.json({ error: 'Failed to fetch food requests' }, { status: 500 });
  }
}

// POST /api/food-requests
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user || (user.role !== 'recipient' && user.role !== 'ngo' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized. Recipient or NGO account required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      category,
      quantity_requested,
      unit,
      people_to_serve,
      urgency,
      urgency_reason,
      deadline,
      delivery_address,
      latitude,
      longitude,
      acceptable_alternatives,
      storage_facilities,
    } = body;

    if (!category || !quantity_requested || !deadline || !delivery_address) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const qty = parseFloat(quantity_requested);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    const recipientOrgId = user.organization_id || 6;

    const result = await execute(
      `INSERT INTO ${PREFIX}food_requests
       (recipient_organization_id, requested_by_user_id, category, quantity_requested, quantity_allocated, quantity_delivered, unit, people_to_serve, urgency, urgency_reason, deadline, delivery_address, latitude, longitude, acceptable_alternatives, storage_facilities, status)
       VALUES (?, ?, ?, ?, 0.00, 0.00, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')`,
      [
        recipientOrgId,
        user.id,
        category,
        qty,
        unit || 'kg',
        people_to_serve ? parseInt(people_to_serve, 10) : 0,
        urgency || 'medium',
        urgency_reason || null,
        new Date(deadline),
        delivery_address,
        latitude ? parseFloat(latitude) : 12.9220,
        longitude ? parseFloat(longitude) : 80.1340,
        acceptable_alternatives || null,
        storage_facilities || null,
      ]
    );

    const newId = result.insertId;
    await recordAudit(user.id, user.name, 'CREATE_REQUEST', 'FOOD_REQUEST', newId, { category, quantity: qty, urgency });

    return NextResponse.json({ success: true, requestId: newId });
  } catch (err: any) {
    console.error('Create request error:', err);
    return NextResponse.json({ error: 'Failed to create request: ' + err.message }, { status: 500 });
  }
}
