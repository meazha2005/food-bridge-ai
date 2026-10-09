import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, PREFIX, recordAudit } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { Delivery } from '@/types';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deliveryId = parseInt(params.id, 10);
    const delivery = await queryOne<Delivery>(
      `SELECT d.*, 
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
       WHERE d.id = ?`,
      [deliveryId]
    );

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Also get events
    const events = await queryOne(
      `SELECT * FROM ${PREFIX}delivery_events WHERE delivery_id = ? ORDER BY created_at DESC`,
      [deliveryId]
    );

    return NextResponse.json({ delivery, events });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch delivery' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deliveryId = parseInt(params.id, 10);
    const delivery = await queryOne<any>(
      `SELECT d.*, a.food_listing_id, a.food_request_id, a.quantity_allocated
       FROM ${PREFIX}deliveries d
       JOIN ${PREFIX}food_allocations a ON d.allocation_id = a.id
       WHERE d.id = ?`,
      [deliveryId]
    );

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    const body = await req.json();
    const {
      status, // 'en_route_pickup' | 'picked_up' | 'in_transit' | 'delivered' | 'failed'
      quantity_collected,
      quantity_delivered,
      notes,
      latitude,
      longitude,
      recipient_confirmation_notes,
    } = body;

    if (!status) {
      return NextResponse.json({ error: 'New status is required' }, { status: 400 });
    }

    const now = new Date();

    if (status === 'picked_up') {
      const qCollected = parseFloat(quantity_collected) || Number(delivery.quantity_allocated);
      await execute(
        `UPDATE ${PREFIX}deliveries 
         SET delivery_status = 'picked_up', pickup_status = 'picked_up', actual_pickup_at = NOW(), quantity_collected = ?
         WHERE id = ?`,
        [qCollected, deliveryId]
      );

      // Update food listing collected qty
      await execute(
        `UPDATE ${PREFIX}food_listings 
         SET quantity_collected = quantity_collected + ?
         WHERE id = ?`,
        [qCollected, delivery.food_listing_id]
      );

      // Record event
      await execute(
        `INSERT INTO ${PREFIX}delivery_events (delivery_id, event_type, notes, latitude, longitude)
         VALUES (?, 'PICKED_UP', ?, ?, ?)`,
        [deliveryId, notes || `Driver picked up ${qCollected} kg`, latitude || null, longitude || null]
      );
    } else if (status === 'in_transit') {
      await execute(
        `UPDATE ${PREFIX}deliveries SET delivery_status = 'in_transit' WHERE id = ?`,
        [deliveryId]
      );
      await execute(
        `INSERT INTO ${PREFIX}delivery_events (delivery_id, event_type, notes, latitude, longitude)
         VALUES (?, 'IN_TRANSIT', ?, ?, ?)`,
        [deliveryId, notes || 'En route to destination kitchen', latitude || null, longitude || null]
      );
    } else if (status === 'delivered') {
      const qDelivered = parseFloat(quantity_delivered) || (Number(delivery.quantity_collected) > 0 ? Number(delivery.quantity_collected) : Number(delivery.quantity_allocated));

      await execute(
        `UPDATE ${PREFIX}deliveries 
         SET delivery_status = 'delivered', actual_delivery_at = NOW(), quantity_delivered = ?, recipient_confirmation_notes = ?
         WHERE id = ?`,
        [qDelivered, recipient_confirmation_notes || 'Recipient signed and verified receipt', deliveryId]
      );

      // Update food request delivered qty
      await execute(
        `UPDATE ${PREFIX}food_requests 
         SET quantity_delivered = quantity_delivered + ?,
             status = CASE WHEN (quantity_requested - (quantity_delivered + ?)) <= 0.01 THEN 'fulfilled' ELSE status END
         WHERE id = ?`,
        [qDelivered, qDelivered, delivery.food_request_id]
      );

      // Update allocation status to delivered
      await execute(
        `UPDATE ${PREFIX}food_allocations SET status = 'delivered' WHERE id = ?`,
        [delivery.allocation_id]
      );

      // Record event
      await execute(
        `INSERT INTO ${PREFIX}delivery_events (delivery_id, event_type, notes, latitude, longitude)
         VALUES (?, 'DELIVERED', ?, ?, ?)`,
        [deliveryId, notes || `Successfully handed over ${qDelivered} kg to recipient`, latitude || null, longitude || null]
      );
    } else if (status === 'failed') {
      await execute(
        `UPDATE ${PREFIX}deliveries SET delivery_status = 'failed', exception_reason = ? WHERE id = ?`,
        [notes || 'Delivery failed due to roadblock or weather disruption', deliveryId]
      );
      await execute(
        `INSERT INTO ${PREFIX}delivery_events (delivery_id, event_type, notes) VALUES (?, 'EXCEPTION', ?)`,
        [deliveryId, notes || 'Delivery marked failed']
      );
    } else {
      await execute(
        `UPDATE ${PREFIX}deliveries SET delivery_status = ? WHERE id = ?`,
        [status, deliveryId]
      );
      await execute(
        `INSERT INTO ${PREFIX}delivery_events (delivery_id, event_type, notes) VALUES (?, ?, ?)`,
        [deliveryId, status.toUpperCase(), notes || `Status updated to ${status}`]
      );
    }

    await recordAudit(user.id, user.name, 'UPDATE_DELIVERY_STATUS', 'DELIVERY', deliveryId, { status, notes });

    return NextResponse.json({ success: true, message: `Delivery updated to ${status}` });
  } catch (err: any) {
    console.error('Update delivery error:', err);
    return NextResponse.json({ error: 'Update failed: ' + err.message }, { status: 500 });
  }
}
