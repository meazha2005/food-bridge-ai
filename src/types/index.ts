export type UserRole = 'admin' | 'supplier' | 'ngo' | 'recipient' | 'delivery';
export type UserStatus = 'active' | 'pending' | 'suspended';
export type OrgType = 'supplier' | 'ngo' | 'recipient';
export type OrgVerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  organization_id?: number | null;
  organization_name?: string;
  organization_type?: OrgType;
  phone?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: number;
  name: string;
  organization_type: OrgType;
  verification_status: OrgVerificationStatus;
  verification_notes?: string | null;
  verified_at?: string | null;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  storage_capacity: number;
  storage_type: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  operating_hours?: string | null;
  created_at: string;
  updated_at: string;
}

export type FoodCategory = 'vegetables' | 'fruits' | 'cooked_meals' | 'grains_dry' | 'dairy' | 'bakery' | 'other';
export type ListingStatus = 'available' | 'partially_reserved' | 'fully_reserved' | 'completed' | 'cancelled' | 'expired';

export interface FoodListing {
  id: number;
  supplier_organization_id: number;
  supplier_name?: string;
  supplier_city?: string;
  supplier_verification?: string;
  created_by_user_id?: number | null;
  food_name: string;
  category: FoodCategory;
  quantity_total: number;
  quantity_available: number;
  quantity_reserved: number;
  quantity_collected: number;
  unit: string;
  condition_state: string;
  storage_type: string;
  available_from: string;
  expiry_at: string;
  pickup_deadline: string;
  pickup_address: string;
  latitude: number;
  longitude: number;
  handling_instructions?: string | null;
  image_url?: string | null;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';
export type RequestStatus = 'open' | 'partially_allocated' | 'allocated' | 'in_transit' | 'fulfilled' | 'cancelled';

export interface FoodRequest {
  id: number;
  recipient_organization_id: number;
  recipient_name?: string;
  requested_by_user_id?: number | null;
  category: FoodCategory;
  quantity_requested: number;
  quantity_allocated: number;
  quantity_delivered: number;
  unit: string;
  people_to_serve: number;
  urgency: UrgencyLevel;
  urgency_reason?: string | null;
  deadline: string;
  delivery_address: string;
  latitude: number;
  longitude: number;
  acceptable_alternatives?: string | null;
  storage_facilities?: string | null;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export type AllocationStatus = 'recommended' | 'approved' | 'rejected' | 'in_transit' | 'delivered' | 'cancelled';

export interface FoodAllocation {
  id: number;
  food_listing_id: number;
  food_request_id: number;
  quantity_allocated: number;
  status: AllocationStatus;
  match_score: number;
  match_reasons?: string | null;
  approved_by_user_id?: number | null;
  override_reason?: string | null;
  created_at: string;
  updated_at: string;
  // Join properties
  food_name?: string;
  category?: string;
  unit?: string;
  supplier_name?: string;
  supplier_address?: string;
  recipient_name?: string;
  recipient_address?: string;
  recipient_urgency?: string;
  delivery_id?: number;
  delivery_status?: string;
  driver_id?: number;
  driver_name?: string;
}

export type DeliveryStatus = 'assigned' | 'en_route_pickup' | 'picked_up' | 'in_transit' | 'delivered' | 'partially_delivered' | 'failed' | 'cancelled';
export type PickupStatus = 'pending' | 'scheduled' | 'picked_up' | 'failed';

export interface Delivery {
  id: number;
  allocation_id: number;
  driver_id?: number | null;
  driver_name?: string;
  driver_phone?: string;
  vehicle_type: string;
  vehicle_capacity: number;
  pickup_status: PickupStatus;
  delivery_status: DeliveryStatus;
  estimated_arrival?: string | null;
  actual_pickup_at?: string | null;
  actual_delivery_at?: string | null;
  quantity_collected: number;
  quantity_delivered: number;
  recipient_confirmation_notes?: string | null;
  exception_reason?: string | null;
  route_distance_km: number;
  route_estimated_minutes: number;
  created_at: string;
  updated_at: string;
  // Joined details
  food_name?: string;
  quantity_allocated?: number;
  unit?: string;
  supplier_name?: string;
  supplier_address?: string;
  supplier_phone?: string;
  pickup_address?: string;
  supplier_lat?: number;
  supplier_lng?: number;
  recipient_name?: string;
  recipient_address?: string;
  recipient_phone?: string;
  recipient_urgency?: string;
  recipient_lat?: number;
  recipient_lng?: number;
  category?: string;
}

export interface Disruption {
  id: number;
  disruption_type: 'rainfall' | 'road_closure' | 'supply_shock' | 'demand_surge' | 'vehicle_breakdown';
  affected_area: string;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  parameters: any;
  status: 'active' | 'monitoring' | 'resolved';
  created_at: string;
}

export interface SimulationResult {
  id: number;
  scenario_type: string;
  scenario_config: any;
  original_metrics: {
    total_supply_kg: number;
    total_demand_kg: number;
    fulfilled_kg: number;
    fulfillment_rate_pct: number;
    unmet_demand_kg: number;
    avg_delivery_mins: number;
  };
  revised_metrics: {
    total_supply_kg: number;
    total_demand_kg: number;
    fulfilled_kg: number;
    fulfillment_rate_pct: number;
    unmet_demand_kg: number;
    avg_delivery_mins: number;
    infeasible_deliveries_count: number;
  };
  results: {
    disrupted_routes: string[];
    affected_recipients: Array<{ id: number; name: string; deficit_kg: number }>;
    recommended_actions: string[];
    revised_allocations: Array<{
      supplierName: string;
      recipientName: string;
      foodName: string;
      originalQty: number;
      revisedQty: number;
      feasible: boolean;
      delayFactor: number;
      notes: string;
    }>;
  };
  created_by_user_id?: number | null;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  link_url?: string | null;
  type: 'info' | 'success' | 'warning' | 'danger';
  read_at?: string | null;
  created_at: string;
}

export interface AuditLogItem {
  id: number;
  actor_id?: number | null;
  actor_name?: string | null;
  action: string;
  entity_type: string;
  entity_id?: number | null;
  details?: any;
  ip_address?: string | null;
  created_at: string;
}
