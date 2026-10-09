import { NextRequest, NextResponse } from 'next/server';
import { query, execute, PREFIX, recordAudit } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { FoodListing } from '@/types';

// GET /api/food-listings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const supplierId = searchParams.get('supplierId');
    const search = searchParams.get('search');
    const publicOnly = searchParams.get('public') === 'true';

    let sql = `
      SELECT l.*, o.name as supplier_name, o.city as supplier_city, o.verification_status as supplier_verification
      FROM ${PREFIX}food_listings l
      JOIN ${PREFIX}organizations o ON l.supplier_organization_id = o.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category && category !== 'all') {
      sql += ' AND l.category = ?';
      params.push(category);
    }

    if (status && status !== 'all') {
      sql += ' AND l.status = ?';
      params.push(status);
    } else if (publicOnly) {
      // Public board only shows available or partially reserved active listings
      sql += " AND l.status IN ('available', 'partially_reserved') AND l.pickup_deadline > NOW()";
    }

    if (supplierId) {
      sql += ' AND l.supplier_organization_id = ?';
      params.push(supplierId);
    }

    if (search) {
      sql += ' AND (l.food_name LIKE ? OR l.category LIKE ? OR o.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY l.created_at DESC';

    const listings = await query<FoodListing>(sql, params);

    // If public request, sanitize exact pickup address for supplier privacy
    if (publicOnly) {
      const sanitized = listings.map((item) => ({
        ...item,
        pickup_address: item.pickup_address ? `${(item as any).supplier_city || 'Tamil Nadu'} (Approximate Area)` : 'Tamil Nadu',
      }));
      return NextResponse.json({ listings: sanitized });
    }

    return NextResponse.json({ listings });
  } catch (err: any) {
    console.error('Fetch listings error:', err);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

// POST /api/food-listings
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user || (user.role !== 'supplier' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized. Supplier account required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      food_name,
      category,
      quantity_total,
      unit,
      condition_state,
      storage_type,
      available_from,
      expiry_at,
      pickup_deadline,
      pickup_address,
      latitude,
      longitude,
      handling_instructions,
      image_url,
    } = body;

    if (!food_name || !category || !quantity_total || !pickup_deadline || !pickup_address) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const qty = parseFloat(quantity_total);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    const supplierOrgId = user.organization_id || 1;

    const result = await execute(
      `INSERT INTO ${PREFIX}food_listings 
       (supplier_organization_id, created_by_user_id, food_name, category, quantity_total, quantity_available, quantity_reserved, quantity_collected, unit, condition_state, storage_type, available_from, expiry_at, pickup_deadline, pickup_address, latitude, longitude, handling_instructions, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, 0.00, 0.00, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')`,
      [
        supplierOrgId,
        user.id,
        food_name,
        category,
        qty,
        qty,
        unit || 'kg',
        condition_state || 'fresh',
        storage_type || 'ambient',
        available_from ? new Date(available_from) : new Date(),
        expiry_at ? new Date(expiry_at) : new Date(Date.now() + 48 * 3600 * 1000),
        new Date(pickup_deadline),
        pickup_address,
        latitude ? parseFloat(latitude) : 13.0694,
        longitude ? parseFloat(longitude) : 80.1948,
        handling_instructions || null,
        image_url || null,
      ]
    );

    const newId = result.insertId;
    await recordAudit(user.id, user.name, 'CREATE_LISTING', 'FOOD_LISTING', newId, { food_name, quantity: qty, category });

    return NextResponse.json({ success: true, listingId: newId });
  } catch (err: any) {
    console.error('Create listing error:', err);
    return NextResponse.json({ error: 'Failed to create listing: ' + err.message }, { status: 500 });
  }
}
