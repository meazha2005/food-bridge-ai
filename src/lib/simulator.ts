import { query, PREFIX } from './db';
import { runMatchingEngine, calculateDistanceKm, estimateTravelMinutes } from './matching';
import { SimulationResult } from '@/types';

export interface ScenarioParams {
  scenarioType: 'supply_reduction' | 'demand_surge' | 'heavy_rainfall' | 'road_closure' | 'vehicle_shortage' | 'shortened_window';
  supplyReductionPct?: number; // e.g. 30
  demandSurgePct?: number;     // e.g. 50
  rainfallDelayPct?: number;   // e.g. 60
  blockedCorridor?: string;    // e.g. 'GST Road' or 'Maduravoyal Bypass'
  vehicleCapacityCutPct?: number; // e.g. 40
  windowReductionHours?: number; // e.g. 4
  targetRegion?: string;       // e.g. 'Tambaram' or 'Chennai'
}

export async function runClimateSimulation(params: ScenarioParams, userId?: number): Promise<SimulationResult> {
  // Step 1: Run baseline (original plan)
  const baseline = await runMatchingEngine();

  // Baseline metrics
  const origSupply = baseline.summary.totalAvailableSupplyKg;
  const origDemand = baseline.summary.totalRequestedDemandKg;
  const origFulfilled = baseline.summary.totalRecommendedAllocationKg;
  const origFulfillmentRate = baseline.summary.demandFulfillmentRatePct;
  const origUnmet = origDemand - origFulfilled;
  const origAvgMins =
    baseline.matches.length > 0
      ? Math.round(baseline.matches.reduce((sum, m) => sum + m.estimatedTravelMinutes, 0) / baseline.matches.length)
      : 35;

  // Step 2: Apply Disruption Scenario on an ISOLATED in-memory copy
  let revisedSupply = origSupply;
  let revisedDemand = origDemand;
  let revisedAvgMins = origAvgMins;
  let delayMultiplier = 1.0;
  const disruptedRoutes: string[] = [];
  const recommendedActions: string[] = [];

  const revisedAllocations = baseline.matches.map((match) => ({
    supplierName: match.supplierName,
    recipientName: match.recipientName,
    foodName: match.foodName,
    originalQty: match.recommendedQuantity,
    revisedQty: match.recommendedQuantity,
    feasible: true,
    delayFactor: 1.0,
    notes: 'Normal operational transit',
  }));

  // Apply scenario logic:
  switch (params.scenarioType) {
    case 'supply_reduction': {
      const cutPct = params.supplyReductionPct || 30;
      revisedSupply = Math.round(origSupply * (1 - cutPct / 100));
      recommendedActions.push(`Mobilize regional buffer grain stocks from Chengalpattu / Kanchipuram dry warehouses`);
      recommendedActions.push(`Subsidize local micro-farm direct-rescue hubs`);

      revisedAllocations.forEach((item) => {
        item.revisedQty = Math.round(item.originalQty * (1 - cutPct / 100));
        item.notes = `Reduced by ${cutPct}% due to unseasonal rainfall crop damage at supplier source`;
      });
      break;
    }

    case 'demand_surge': {
      const surgePct = params.demandSurgePct || 40;
      revisedDemand = Math.round(origDemand * (1 + surgePct / 100));
      recommendedActions.push(`Activate community kitchens network in ${params.targetRegion || 'South Chennai'}`);
      recommendedActions.push(`Open emergency supplemental food drop-points at metro transit stations`);

      // Allocations remain capped by available supply
      revisedAllocations.forEach((item) => {
        item.notes = `Regional demand surged by ${surgePct}%. Allocation at maximum capacity of available stock.`;
      });
      break;
    }

    case 'heavy_rainfall': {
      const rainDelayPct = params.rainfallDelayPct || 50;
      delayMultiplier = 1 + rainDelayPct / 100;
      revisedAvgMins = Math.round(origAvgMins * delayMultiplier);
      disruptedRoutes.push('Kathipara Junction -> Guindy Inner Ring Road (Slow-moving waterlogging)');
      disruptedRoutes.push('GST Road Tambaram East Approach (Submerged underpass detours active)');

      recommendedActions.push(`Deploy high-clearance rescue vehicles (Tata 407 / mini-trucks) for waterlogged sectors`);
      recommendedActions.push(`Shift scheduled delivery windows 2 hours earlier before high-tide rainfall peaks`);

      revisedAllocations.forEach((item) => {
        item.delayFactor = delayMultiplier;
        const newMins = Math.round(origAvgMins * delayMultiplier);
        if (newMins > 90) {
          item.feasible = false;
          item.notes = `Critical transit delay (${newMins} mins). Cold-chain temperature boundary violated!`;
        } else {
          item.notes = `Expected transit delay +${rainDelayPct}%. Feasible with insulated thermal blankets.`;
        }
      });
      break;
    }

    case 'road_closure': {
      const blockedRoad = params.blockedCorridor || 'Maduravoyal Bypass Corridor';
      disruptedRoutes.push(`${blockedRoad} (Fully impassable due to flash flooding)`);
      recommendedActions.push(`Reroute all Koyambedu dispatch convoys through Chennai Outer Ring Road (ORR) via Vandalur`);
      recommendedActions.push(`Establish temporary transshipment waypoint at Porur Toll plaza`);

      revisedAllocations.forEach((item, idx) => {
        if (idx % 2 === 0) {
          // Half routes affected by arterial closure
          item.delayFactor = 1.6;
          item.notes = `Route detour required around ${blockedRoad}. +35 mins transit penalty.`;
        }
      });
      revisedAvgMins = Math.round(origAvgMins * 1.35);
      break;
    }

    case 'vehicle_shortage': {
      const cutPct = params.vehicleCapacityCutPct || 40;
      recommendedActions.push(`Dispatch two-tier staggered deliveries using volunteer two-wheelers for small crates (<30kg)`);
      recommendedActions.push(`Prioritize Category-1 medical shelter requests first`);

      revisedAllocations.forEach((item, idx) => {
        if (idx === revisedAllocations.length - 1) {
          item.feasible = false;
          item.revisedQty = 0;
          item.notes = `Vehicle shortage: Fleet capacity exhausted. Delivery postponed to Next Shift.`;
        } else {
          item.revisedQty = Math.round(item.originalQty * 0.85);
          item.notes = `Consolidated cargo payload due to vehicle shortage.`;
        }
      });
      break;
    }

    case 'shortened_window': {
      const hoursCut = params.windowReductionHours || 4;
      recommendedActions.push(`Immediate expedited dispatch required within next 120 minutes`);
      recommendedActions.push(`Deploy insulated dry-ice cooling crates for high-risk perishables`);

      revisedAllocations.forEach((item) => {
        item.notes = `Safe consumption window curtailed by ${hoursCut}h due to elevated ambient temperature/humidity.`;
      });
      break;
    }
  }

  // Calculate revised metrics
  const revisedFulfilled = revisedAllocations.reduce(
    (sum, m) => sum + (m.feasible ? m.revisedQty : 0),
    0
  );
  const revisedUnmet = Math.max(0, revisedDemand - revisedFulfilled);
  const revisedFulfillmentRate =
    revisedDemand > 0 ? Math.round((revisedFulfilled / revisedDemand) * 100) : 0;
  const infeasibleCount = revisedAllocations.filter((m) => !m.feasible).length;

  const affectedRecipients = baseline.unmetRequests.map((r) => ({
    id: r.requestId,
    name: r.recipientName,
    deficit_kg: r.unmetQuantity + (origDemand > origSupply ? 40 : 15),
  }));

  if (affectedRecipients.length === 0 && revisedUnmet > 0) {
    affectedRecipients.push({
      id: 1,
      name: 'Hope Harbor Children Shelter & Community Kitchen',
      deficit_kg: revisedUnmet,
    });
  }

  const simulationData: SimulationResult = {
    id: Date.now(),
    scenario_type: params.scenarioType,
    scenario_config: params,
    original_metrics: {
      total_supply_kg: origSupply,
      total_demand_kg: origDemand,
      fulfilled_kg: origFulfilled,
      fulfillment_rate_pct: origFulfillmentRate,
      unmet_demand_kg: origUnmet,
      avg_delivery_mins: origAvgMins,
    },
    revised_metrics: {
      total_supply_kg: revisedSupply,
      total_demand_kg: revisedDemand,
      fulfilled_kg: revisedFulfilled,
      fulfillment_rate_pct: revisedFulfillmentRate,
      unmet_demand_kg: revisedUnmet,
      avg_delivery_mins: revisedAvgMins,
      infeasible_deliveries_count: infeasibleCount,
    },
    results: {
      disrupted_routes: disruptedRoutes,
      affected_recipients: affectedRecipients,
      recommended_actions: recommendedActions,
      revised_allocations: revisedAllocations,
    },
    created_by_user_id: userId || null,
    created_at: new Date().toISOString(),
  };

  // Record simulation run in database for review and history (does NOT modify inventory!)
  try {
    await query(
      `INSERT INTO ${PREFIX}simulation_runs 
       (scenario_type, scenario_config, original_metrics, revised_metrics, results, created_by_user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        params.scenarioType,
        JSON.stringify(params),
        JSON.stringify(simulationData.original_metrics),
        JSON.stringify(simulationData.revised_metrics),
        JSON.stringify(simulationData.results),
        userId || null,
      ]
    );
  } catch (err) {
    console.error('Failed to persist simulation run to database:', err);
  }

  return simulationData;
}
