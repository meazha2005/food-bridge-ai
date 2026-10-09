import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute, PREFIX, recordAudit } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { FoodAllocation } from '@/types';

// GET /api/allocations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const orgId = searchParams.get('orgId');

    let sql = `
      SELECT a.*, 
             l.food_name, l.category, l.unit, l.pickup_address,
             s.name as supplier_name, s.address as supplier_address,
             r.delivery_address, r.urgency as recipient_urgency,
             rec.name as recipient_name,
             d.id as delivery_id, d.delivery_status, d.driver_id, u.name as driver_name
      FROM ${PREFIX}food_allocations a
      JOIN ${PREFIX}food_listings l ON a.food_listing_id = l.id
      JOIN ${PREFIX}organizations s ON l.supplier_organization_id = s.id
      JOIN ${PREFIX}food_requests r ON a.food_request_id = r.id
      JOIN ${PREFIX}organizations rec ON r.recipient_organization_id = rec.id
      LEFT JOIN ${PREFIX}deliveries d ON a.id = d.allocation_id
      LEFT JOIN ${PREFIX}users u ON d.driver_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    if (orgId) {
      sql += ' AND (l.supplier_organization_id = ? OR r.recipient_organization_id = ?)';
      params.push(orgId, orgId);
    }

    sql += ' ORDER BY a.created_at DESC';

    const allocations = await query<FoodAllocation>(sql, params);
    return NextResponse.json({ allocations });
  } catch (err: any) {
    console.error('Fetch allocations error:', err);
    return NextResponse.json({ error: 'Failed to fetch allocations' }, { status: 500 });
  }
}

// POST /api/allocations (Approve and Apply Allocation)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      food_listing_id,
      food_request_id,
      quantity_allocated,
      match_score,
      match_reasons,
      override_reason,
      driver_id,
    } = body;

    const allocQty = parseFloat(quantity_allocated);
    if (!food_listing_id || !food_request_id || isNaN(allocQty) || allocQty <= 0) {
      return NextResponse.json({ error: 'Valid food listing, request ID, and allocation quantity required' }, { status: 400 });
    }

    // Step 1: Check listing inventory
    const listing = await queryOne(`SELECT * FROM ${PREFIX}food_listings WHERE id = ?`, [food_listing_id]);
    if (!listing) {
      return NextResponse.json({ error: 'Food listing not found' }, { status: 404 });
    }

    const availableSupply = Number(listing.quantity_available);
    if (availableSupply < allocQty) {
      return NextResponse.json({
        error: `Insufficient inventory: only ${availableSupply} ${listing.unit} available (requested: ${allocQty})`,
      }, { status: 400 });
    }

    // Step 2: Check request outstanding demand
    const request = await queryOne(`SELECT * FROM ${PREFIX}food_requests WHERE id = ?`, [food_request_id]);
    if (!request) {
      return NextResponse.json({ error: 'Food request not found' }, { status: 404 });
    }

    const unmetDemand = Number(request.quantity_requested) - Number(request.quantity_allocated);
    if (unmetDemand <= 0) {
      return NextResponse.json({ error: 'Request is already completely fulfilled.' }, { status: 400 });
    }

    // Apply capped allocation if requested > unmet
    const finalAllocQty = Math.min(allocQty, unmetDemand, availableSupply);

    // Step 3: Atomic database update
    // Update listing: increment reserved, decrement available
    const listingUpdate = await execute(
      `UPDATE ${PREFIX}food_listings 
       SET quantity_reserved = quantity_reserved + ?,
           quantity_available = quantity_available - ?,
           status = CASE WHEN (quantity_available - ?) <= 0.01 THEN 'fully_reserved' ELSE 'partially_reserved' END
       WHERE id = ? AND quantity_available >= ?`,
      [finalAllocQty, finalAllocQty, finalAllocQty, food_listing_id, finalAllocQty]
    );

    if (listingUpdate.affectedRows === 0) {
      return NextResponse.json({ error: 'Concurrency conflict: inventory was reserved by another user.' }, { status: 409 });
    }

    // Update food request
    await execute(
      `UPDATE ${PREFIX}food_requests
       SET quantity_allocated = quantity_allocated + ?,
           status = CASE WHEN (quantity_requested - (quantity_allocated + ?)) <= 0.01 THEN 'allocated' ELSE 'partially_allocated' END
       WHERE id = ?`,
      [finalAllocQty, finalAllocQty, food_request_id]
    );

    // Insert allocation record
    const allocResult = await execute(
      `INSERT INTO ${PREFIX}food_allocations
       (food_listing_id, food_request_id, quantity_allocated, status, match_score, match_reasons, approved_by_user_id, override_reason)
       VALUES (?, ?, ?, 'approved', ?, ?, ?, ?)`,
      [
        food_listing_id,
        food_request_id,
        finalAllocQty,
        match_score ? parseFloat(match_score) : 90.0,
        match_reasons || 'Approved AI constraint matching',
        user.id,
        override_reason || null,
      ]
    );

    const allocationId = allocResult.insertId;

    // Create delivery job
    // Auto assign driver 5 (Murugan K.) if none provided
    const assignedDriverId = driver_id ? parseInt(driver_id, 10) : 5;
    const delivResult = await execute(
      `INSERT INTO ${PREFIX}deliveries
       (allocation_id, driver_id, vehicle_type, vehicle_capacity, pickup_status, delivery_status, estimated_arrival, quantity_collected, quantity_delivered, route_distance_km, route_estimated_minutes)
       VALUES (?, ?, 'Tata Ace Mini Van', 500.0, 'pending', 'assigned', DATE_ADD(NOW(), INTERVAL 2 HOUR), 0.00, 0.00, 18.5, 40)`,
      [allocationId, assignedDriverId]
    );

    const deliveryId = delivResult.insertId;

    // Insert delivery event
    await execute(
      `INSERT INTO ${PREFIX}delivery_events (delivery_id, event_type, notes) VALUES (?, 'ASSIGNED', 'Delivery created and assigned')`,
      [deliveryId]
    );

    // Record audit
    await recordAudit(user.id, user.name, 'APPROVE_ALLOCATION', 'FOOD_ALLOCATION', allocationId, {
      listing_id: food_listing_id,
      request_id: food_request_id,
      quantity_allocated: finalAllocQty,
    });

    return NextResponse.json({
      success: true,
      allocationId,
      deliveryId,
      allocatedQuantity: finalAllocQty,
      message: `Successfully reserved and allocated ${finalAllocQty} ${listing.unit}. Delivery assignment created.`,
    });
  } catch (err: any) {
    console.error('Approve allocation error:', err);
    return NextResponse.json({ error: 'Allocation failed: ' + err.message }, { status: 500 });
  }
}
