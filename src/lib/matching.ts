import { query, PREFIX } from './db';
import { FoodListing, FoodRequest } from '@/types';

// Calculate Haversine distance between two coordinates in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function estimateTravelMinutes(distanceKm: number, weatherDelayFactor = 1.0): number {
  // Average urban/semi-urban speed in Tamil Nadu corridor ~ 30 km/h + 10 mins baseline handling
  const baseMinutes = Math.round((distanceKm / 30) * 60) + 10;
  return Math.round(baseMinutes * weatherDelayFactor);
}

export interface MatchRecommendation {
  listingId: number;
  requestId: number;
  foodName: string;
  category: string;
  supplierId: number;
  supplierName: string;
  supplierAddress: string;
  recipientId: number;
  recipientName: string;
  recipientAddress: string;
  requestedQuantity: number;
  availableQuantity: number;
  recommendedQuantity: number;
  matchScore: number;
  distanceKm: number;
  estimatedTravelMinutes: number;
  scoreBreakdown: {
    recipientUrgencyScore: number; // weight 30%
    expiryUrgencyScore: number;    // weight 25%
    unmetDemandScore: number;      // weight 20%
    suitabilityScore: number;      // weight 15%
    proximityScore: number;        // weight 10%
  };
  reasons: string[];
  warnings: string[];
  feasible: boolean;
}

export interface MatchingResult {
  matches: MatchRecommendation[];
  unmetRequests: Array<{
    requestId: number;
    recipientName: string;
    category: string;
    unmetQuantity: number;
    urgency: string;
    alternativeSuggestions: string[];
  }>;
  summary: {
    totalAvailableSupplyKg: number;
    totalRequestedDemandKg: number;
    totalRecommendedAllocationKg: number;
    avgMatchScore: number;
    demandFulfillmentRatePct: number;
  };
}

export async function runMatchingEngine(): Promise<MatchingResult> {
  // 1. Fetch eligible available food listings
  const listings = await query<FoodListing>(`
    SELECT l.*, o.name as supplier_name, o.address as supplier_address, o.latitude as supplier_lat, o.longitude as supplier_lng
    FROM ${PREFIX}food_listings l
    JOIN ${PREFIX}organizations o ON l.supplier_organization_id = o.id
    WHERE l.status IN ('available', 'partially_reserved')
      AND l.quantity_available > 0
      AND l.pickup_deadline > NOW()
    ORDER BY l.pickup_deadline ASC
  `);

  // 2. Fetch outstanding food requests
  const requests = await query<FoodRequest>(`
    SELECT r.*, o.name as recipient_name, o.address as recipient_address, o.latitude as recipient_lat, o.longitude as recipient_lng
    FROM ${PREFIX}food_requests r
    JOIN ${PREFIX}organizations o ON r.recipient_organization_id = o.id
    WHERE r.status IN ('open', 'partially_allocated')
      AND (r.quantity_requested - r.quantity_allocated) > 0
      AND r.deadline > NOW()
    ORDER BY 
      CASE r.urgency 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        ELSE 4 
      END ASC,
      r.deadline ASC
  `);

  // Clone available quantities for constraint-based simulation during matching
  const supplyPool = new Map<number, number>();
  listings.forEach((l) => supplyPool.set(l.id, Number(l.quantity_available)));

  const demandPool = new Map<number, number>();
  requests.forEach((r) => demandPool.set(r.id, Number(r.quantity_requested) - Number(r.quantity_allocated)));

  const candidateMatches: MatchRecommendation[] = [];

  for (const req of requests) {
    const needed = demandPool.get(req.id) || 0;
    if (needed <= 0) continue;

    for (const listing of listings) {
      const avail = supplyPool.get(listing.id) || 0;
      if (avail <= 0) continue;

      // Category check: direct match or compatible alternative
      const categoryMatch = listing.category.toLowerCase() === req.category.toLowerCase();
      let suitabilityScore = categoryMatch ? 100 : 0;

      if (!categoryMatch && req.acceptable_alternatives) {
        if (req.acceptable_alternatives.toLowerCase().includes(listing.category.toLowerCase())) {
          suitabilityScore = 70;
        }
      }

      if (suitabilityScore === 0) continue; // Incompatible food type

      // Calculate distance
      const distKm = calculateDistanceKm(
        Number(listing.latitude || 13.0694),
        Number(listing.longitude || 80.1948),
        Number(req.latitude || 12.9220),
        Number(req.longitude || 80.1340)
      );

      // Travel time estimation
      const travelMins = estimateTravelMinutes(distKm);

      // Check pickup deadline vs request deadline constraint
      const now = Date.now();
      const pickupDeadlineMs = new Date(listing.pickup_deadline).getTime();
      const requestDeadlineMs = new Date(req.deadline).getTime();
      const hoursToPickup = Math.max(0, (pickupDeadlineMs - now) / (1000 * 3600));

      const warnings: string[] = [];
      let feasible = true;

      if (travelMins > 180) {
        warnings.push(`Long transit distance (${distKm} km, ~${travelMins} mins)`);
      }
      if (hoursToPickup < (travelMins / 60)) {
        feasible = false;
        warnings.push(`Pickup window too tight (${hoursToPickup.toFixed(1)}h remaining vs ${travelMins}m travel time)`);
      }

      // Calculate Multi-Factor Scores:
      // 1. Recipient Urgency (30%)
      let urgencyScore = 50;
      if (req.urgency === 'critical') urgencyScore = 100;
      else if (req.urgency === 'high') urgencyScore = 85;
      else if (req.urgency === 'medium') urgencyScore = 65;
      else urgencyScore = 40;

      // 2. Expiry & Pickup urgency (25%): Closer to deadline = higher rescue urgency
      let expiryScore = 50;
      if (hoursToPickup <= 6) expiryScore = 100;
      else if (hoursToPickup <= 18) expiryScore = 85;
      else if (hoursToPickup <= 48) expiryScore = 70;
      else expiryScore = 50;

      // 3. Unmet Demand (20%): Larger proportion of unmet requirement satisfied
      const allocQty = Math.min(avail, needed);
      const unmetDemandRatio = allocQty / needed;
      const unmetDemandScore = Math.min(100, Math.round(unmetDemandRatio * 100));

      // 4. Proximity (10%): Inverse relation with distance
      let proximityScore = Math.max(10, Math.round(100 - distKm * 1.5));
      if (distKm <= 10) proximityScore = 100;

      // Weighted Total Score
      const totalScore = Math.round(
        urgencyScore * 0.30 +
        expiryScore * 0.25 +
        unmetDemandScore * 0.20 +
        suitabilityScore * 0.15 +
        proximityScore * 0.10
      );

      const reasons: string[] = [];
      if (categoryMatch) reasons.push(`Direct category match: ${listing.category}`);
      if (req.urgency === 'critical') reasons.push(`Prioritized for Critical community urgency`);
      if (hoursToPickup <= 12) reasons.push(`Imminent pickup deadline (${hoursToPickup.toFixed(1)} hrs left)`);
      if (distKm <= 25) reasons.push(`High proximity (${distKm} km, ~${travelMins} mins)`);
      reasons.push(`Can fulfill ${allocQty} ${req.unit} (${Math.round((allocQty / needed) * 100)}% of request)`);

      candidateMatches.push({
        listingId: listing.id,
        requestId: req.id,
        foodName: listing.food_name,
        category: listing.category,
        supplierId: listing.supplier_organization_id,
        supplierName: (listing as any).supplier_name || 'Verified Supplier',
        supplierAddress: (listing as any).supplier_address || listing.pickup_address,
        recipientId: req.recipient_organization_id,
        recipientName: (req as any).recipient_name || 'Community Recipient',
        recipientAddress: (req as any).recipient_address || req.delivery_address,
        requestedQuantity: needed,
        availableQuantity: avail,
        recommendedQuantity: allocQty,
        matchScore: totalScore,
        distanceKm: distKm,
        estimatedTravelMinutes: travelMins,
        scoreBreakdown: {
          recipientUrgencyScore: urgencyScore,
          expiryUrgencyScore: expiryScore,
          unmetDemandScore: unmetDemandScore,
          suitabilityScore,
          proximityScore,
        },
        reasons,
        warnings,
        feasible,
      });
    }
  }

  // Sort candidate matches by highest match score and feasibility
  candidateMatches.sort((a, b) => {
    if (a.feasible !== b.feasible) return a.feasible ? -1 : 1;
    return b.matchScore - a.matchScore;
  });

  // Constrained allocation resolution
  const finalMatches: MatchRecommendation[] = [];
  const assignedSupply = new Map<number, number>();
  const fulfilledDemand = new Map<number, number>();

  for (const match of candidateMatches) {
    if (!match.feasible) continue;

    const currentSupply = supplyPool.get(match.listingId) || 0;
    const currentDemand = demandPool.get(match.requestId) || 0;

    const usedSupply = assignedSupply.get(match.listingId) || 0;
    const remSupply = currentSupply - usedSupply;

    const satisfiedDemand = fulfilledDemand.get(match.requestId) || 0;
    const remDemand = currentDemand - satisfiedDemand;

    if (remSupply <= 0 || remDemand <= 0) continue;

    const allocateAmount = Math.min(remSupply, remDemand);
    if (allocateAmount <= 0) continue;

    assignedSupply.set(match.listingId, usedSupply + allocateAmount);
    fulfilledDemand.set(match.requestId, satisfiedDemand + allocateAmount);

    finalMatches.push({
      ...match,
      recommendedQuantity: allocateAmount,
    });
  }

  // Determine unmet demand & alternative suggestions
  const unmetRequests: MatchingResult['unmetRequests'] = [];
  for (const req of requests) {
    const totalRequested = Number(req.quantity_requested) - Number(req.quantity_allocated);
    const fulfilled = fulfilledDemand.get(req.id) || 0;
    const deficit = totalRequested - fulfilled;

    if (deficit > 0) {
      const suggestions: string[] = [];
      // Look for other categories that might be available
      for (const [lid, rem] of Array.from(supplyPool.entries())) {
        const used = assignedSupply.get(lid) || 0;
        if (rem - used > 0) {
          const l = listings.find((x) => x.id === lid);
          if (l && l.category !== req.category) {
            suggestions.push(`Alternative ${l.category} (${l.food_name}): ${rem - used} ${l.unit} available at ${l.pickup_address}`);
          }
        }
      }
      if (suggestions.length === 0) {
        suggestions.push('Broaden search radius beyond 30 km to Chengalpattu / Kanchipuram buffer hubs');
        suggestions.push('Trigger Regional Climate Buffer stock release');
      }

      unmetRequests.push({
        requestId: req.id,
        recipientName: (req as any).recipient_name || 'Community Recipient',
        category: req.category,
        unmetQuantity: deficit,
        urgency: req.urgency,
        alternativeSuggestions: suggestions.slice(0, 3),
      });
    }
  }

  const totalAvailableSupplyKg = listings.reduce((sum, l) => sum + Number(l.quantity_available), 0);
  const totalRequestedDemandKg = requests.reduce((sum, r) => sum + (Number(r.quantity_requested) - Number(r.quantity_allocated)), 0);
  const totalRecommendedAllocationKg = finalMatches.reduce((sum, m) => sum + m.recommendedQuantity, 0);
  const avgMatchScore =
    finalMatches.length > 0
      ? Math.round(finalMatches.reduce((sum, m) => sum + m.matchScore, 0) / finalMatches.length)
      : 0;
  const demandFulfillmentRatePct =
    totalRequestedDemandKg > 0
      ? Math.round((totalRecommendedAllocationKg / totalRequestedDemandKg) * 100)
      : 100;

  return {
    matches: finalMatches,
    unmetRequests,
    summary: {
      totalAvailableSupplyKg,
      totalRequestedDemandKg,
      totalRecommendedAllocationKg,
      avgMatchScore,
      demandFulfillmentRatePct,
    },
  };
}
