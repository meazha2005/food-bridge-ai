// In-memory resilient data repository for FoodBridge AI
// Used as high-availability fallback when remote MySQL experiences network latency or connection drops.

export interface MemoryListing {
  id: number;
  supplier_organization_id: number;
  created_by_user_id: number | null;
  food_name: string;
  category: string;
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
  handling_instructions: string | null;
  image_url?: string | null;
  status: string;
  created_at: string;
  supplier_name?: string;
  supplier_city?: string;
  supplier_verification?: string;
}

export interface MemoryRequest {
  id: number;
  recipient_organization_id: number;
  requested_by_user_id: number | null;
  food_category: string;
  quantity_needed: number;
  unit: string;
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  servings_count: number;
  storage_capacity_available: number;
  required_by_time: string;
  dietary_restrictions: string | null;
  status: 'pending' | 'partially_fulfilled' | 'fulfilled' | 'cancelled';
  created_at: string;
  recipient_name?: string;
  recipient_address?: string;
  recipient_city?: string;
  latitude?: number;
  longitude?: number;
}

export interface MemoryOrganization {
  id: number;
  name: string;
  organization_type: 'supplier' | 'ngo' | 'recipient';
  verification_status: 'pending' | 'verified' | 'rejected';
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  storage_capacity: number;
  storage_type: string;
  contact_email: string;
  contact_phone: string;
  verified_at: string;
}

export interface MemoryUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'supplier' | 'ngo' | 'recipient' | 'delivery' | 'admin';
  status: string;
  organization_id: number | null;
  phone: string;
  created_at: string;
}

export interface MemoryAllocation {
  id: number;
  food_listing_id: number;
  food_request_id: number;
  quantity_allocated: number;
  status: 'recommended' | 'approved' | 'rejected' | 'in_transit' | 'completed' | 'cancelled';
  match_score: number;
  match_reasons: string;
  approved_by_user_id: number | null;
  created_at: string;
  food_name?: string;
  category?: string;
  unit?: string;
  pickup_address?: string;
  supplier_name?: string;
  recipient_name?: string;
  recipient_address?: string;
  delivery_id?: number | null;
  delivery_status?: string | null;
  driver_name?: string | null;
}

export interface MemoryDelivery {
  id: number;
  allocation_id: number;
  driver_id: number | null;
  vehicle_type: string;
  vehicle_capacity: number;
  pickup_status: string;
  delivery_status: string;
  estimated_arrival: string;
  quantity_collected: number;
  quantity_delivered: number;
  route_distance_km: number;
  route_estimated_minutes: number;
  created_at: string;
  food_name?: string;
  category?: string;
  quantity_allocated?: number;
  unit?: string;
  pickup_address?: string;
  recipient_address?: string;
  supplier_name?: string;
  recipient_name?: string;
  driver_name?: string;
  driver_phone?: string;
}

export interface MemoryDisruption {
  id: number;
  disruption_type: string;
  affected_area: string;
  severity: string;
  parameters: any;
  status: string;
  created_at: string;
}

class MemoryStore {
  organizations: MemoryOrganization[] = [
    {
      id: 1,
      name: "Koyambedu Wholesale Agro Hub",
      organization_type: "supplier",
      verification_status: "verified",
      address: "Gate 4, Koyambedu Wholesale Market Complex, Chennai",
      city: "Chennai",
      latitude: 13.0694,
      longitude: 80.1948,
      storage_capacity: 5000.0,
      storage_type: "ambient",
      contact_email: "agro@koyambedu.tn.gov.in",
      contact_phone: "+91 94441 23456",
      verified_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Chengalpattu Organic Farmers Producer Co",
      organization_type: "supplier",
      verification_status: "verified",
      address: "Old GST Road, Chengalpattu Rural",
      city: "Chengalpattu",
      latitude: 12.6825,
      longitude: 79.9836,
      storage_capacity: 3000.0,
      storage_type: "ambient",
      contact_email: "farmers@cpt-organic.org",
      contact_phone: "+91 98402 34567",
      verified_at: new Date().toISOString()
    },
    {
      id: 3,
      name: "Sriperumbudur Mega Food Retailers",
      organization_type: "supplier",
      verification_status: "verified",
      address: "Bangalore Highway, Sriperumbudur",
      city: "Sriperumbudur",
      latitude: 12.9675,
      longitude: 79.9406,
      storage_capacity: 2500.0,
      storage_type: "cold_storage",
      contact_email: "logistics@sriperumbudurretail.com",
      contact_phone: "+91 97910 88990",
      verified_at: new Date().toISOString()
    },
    {
      id: 4,
      name: "Chennai Food Rescue Bank",
      organization_type: "ngo",
      verification_status: "verified",
      address: "14, 2nd Main Road, Anna Nagar, Chennai",
      city: "Chennai",
      latitude: 13.0850,
      longitude: 80.2100,
      storage_capacity: 4000.0,
      storage_type: "cold_storage",
      contact_email: "relief@chennaiaid.org",
      contact_phone: "+91 98840 12345",
      verified_at: new Date().toISOString()
    },
    {
      id: 5,
      name: "Tambaram Community Feeding Alliance",
      organization_type: "ngo",
      verification_status: "verified",
      address: "5, Gandhi Road, West Tambaram, Chennai",
      city: "Tambaram",
      latitude: 12.9249,
      longitude: 80.1278,
      storage_capacity: 2000.0,
      storage_type: "ambient",
      contact_email: "care@tambaramalliance.org",
      contact_phone: "+91 98410 56789",
      verified_at: new Date().toISOString()
    },
    {
      id: 6,
      name: "Hope Harbor Children Shelter & Community Kitchen",
      organization_type: "recipient",
      verification_status: "verified",
      address: "42, Kamaraj Nagar, Tambaram East",
      city: "Tambaram",
      latitude: 12.9220,
      longitude: 80.1340,
      storage_capacity: 500.0,
      storage_type: "ambient",
      contact_email: "shelter@hopehome.org",
      contact_phone: "+91 98400 98765",
      verified_at: new Date().toISOString()
    },
    {
      id: 7,
      name: "Adyar Elders Care & Flood Relief Center",
      organization_type: "recipient",
      verification_status: "verified",
      address: "18, Canal Bank Road, Gandhi Nagar, Adyar, Chennai",
      city: "Chennai",
      latitude: 13.0067,
      longitude: 80.2570,
      storage_capacity: 800.0,
      storage_type: "ambient",
      contact_email: "support@adyarcare.org",
      contact_phone: "+91 99620 44556",
      verified_at: new Date().toISOString()
    },
    {
      id: 8,
      name: "Chengalpattu Tribal Welfare Community Kitchen",
      organization_type: "recipient",
      verification_status: "verified",
      address: "Pudupattinam Road, Chengalpattu",
      city: "Chengalpattu",
      latitude: 12.6950,
      longitude: 79.9750,
      storage_capacity: 600.0,
      storage_type: "ambient",
      contact_email: "tribalwelfare@cpt.org",
      contact_phone: "+91 94433 11223",
      verified_at: new Date().toISOString()
    }
  ];

  users: MemoryUser[] = [
    {
      id: 1,
      name: "State Food Relief Admin",
      email: "admin@foodbridge.org",
      // Bcrypt hash for Admin@123
      password_hash: "$2a$10$wE99F9q16vjJ6l1w.23MMeR62o00E88/8h7c9g8xMbmUf7g8pU56.",
      role: "admin",
      status: "active",
      organization_id: null,
      phone: "+91 90000 00001",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Ramanathan (Koyambedu Agro)",
      email: "supplier@farmfresh.org",
      password_hash: "$2a$10$wE99F9q16vjJ6l1w.23MMeR62o00E88/8h7c9g8xMbmUf7g8pU56.",
      role: "supplier",
      status: "active",
      organization_id: 1,
      phone: "+91 94441 23456",
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: "Dr. Priya Sundaram (Chennai Food Rescue)",
      email: "ngo@chennaiaid.org",
      password_hash: "$2a$10$wE99F9q16vjJ6l1w.23MMeR62o00E88/8h7c9g8xMbmUf7g8pU56.",
      role: "ngo",
      status: "active",
      organization_id: 4,
      phone: "+91 98840 12345",
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: "Sister Anitha (Hope Shelter)",
      email: "shelter@hopehome.org",
      password_hash: "$2a$10$wE99F9q16vjJ6l1w.23MMeR62o00E88/8h7c9g8xMbmUf7g8pU56.",
      role: "recipient",
      status: "active",
      organization_id: 6,
      phone: "+91 98400 98765",
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      name: "Murugan K. (Rescue Logistics)",
      email: "driver@expressrescue.org",
      password_hash: "$2a$10$wE99F9q16vjJ6l1w.23MMeR62o00E88/8h7c9g8xMbmUf7g8pU56.",
      role: "delivery",
      status: "active",
      organization_id: null,
      phone: "+91 97890 12345",
      created_at: new Date().toISOString()
    }
  ];

  listings: MemoryListing[] = [];
  requests: MemoryRequest[] = [];
  allocations: MemoryAllocation[] = [];
  deliveries: MemoryDelivery[] = [];
  disruptions: MemoryDisruption[] = [];

  constructor() {
    this.refreshDynamicTimestamps();
  }

  refreshDynamicTimestamps() {
    const now = Date.now();

    this.listings = [
      {
        id: 1,
        supplier_organization_id: 1,
        created_by_user_id: 2,
        food_name: "Fresh Country Tomatoes & Greens",
        category: "vegetables",
        quantity_total: 600.0,
        quantity_available: 350.0,
        quantity_reserved: 250.0,
        quantity_collected: 0.0,
        unit: "kg",
        condition_state: "fresh",
        storage_type: "ambient",
        available_from: new Date(now - 2 * 3600 * 1000).toISOString(),
        expiry_at: new Date(now + 48 * 3600 * 1000).toISOString(),
        pickup_deadline: new Date(now + 18 * 3600 * 1000).toISOString(),
        pickup_address: "Gate 4, Koyambedu Wholesale Market Complex, Chennai",
        latitude: 13.0694,
        longitude: 80.1948,
        handling_instructions: "Handle with care in ventilated crates",
        status: "partially_reserved",
        created_at: new Date(now - 2 * 3600 * 1000).toISOString(),
        supplier_name: "Koyambedu Wholesale Agro Hub",
        supplier_city: "Chennai",
        supplier_verification: "verified"
      },
      {
        id: 2,
        supplier_organization_id: 2,
        created_by_user_id: null,
        food_name: "Harvest Surplus Brown Rice & Millets",
        category: "grains_dry",
        quantity_total: 1000.0,
        quantity_available: 1000.0,
        quantity_reserved: 0.0,
        quantity_collected: 0.0,
        unit: "kg",
        condition_state: "fresh",
        storage_type: "ambient",
        available_from: new Date(now - 5 * 3600 * 1000).toISOString(),
        expiry_at: new Date(now + 45 * 24 * 3600 * 1000).toISOString(),
        pickup_deadline: new Date(now + 5 * 24 * 3600 * 1000).toISOString(),
        pickup_address: "Old GST Road, Chengalpattu Rural",
        latitude: 12.6825,
        longitude: 79.9836,
        handling_instructions: "Moisture protected jute sacks",
        status: "available",
        created_at: new Date(now - 5 * 3600 * 1000).toISOString(),
        supplier_name: "Chengalpattu Organic Farmers Producer Co",
        supplier_city: "Chengalpattu",
        supplier_verification: "verified"
      },
      {
        id: 3,
        supplier_organization_id: 3,
        created_by_user_id: null,
        food_name: "Nutritious Fresh Milk & Curd Packs",
        category: "dairy",
        quantity_total: 200.0,
        quantity_available: 50.0,
        quantity_reserved: 150.0,
        quantity_collected: 0.0,
        unit: "liters",
        condition_state: "fresh",
        storage_type: "refrigerated",
        available_from: new Date(now - 1 * 3600 * 1000).toISOString(),
        expiry_at: new Date(now + 24 * 3600 * 1000).toISOString(),
        pickup_deadline: new Date(now + 12 * 3600 * 1000).toISOString(),
        pickup_address: "Bangalore Highway, Sriperumbudur",
        latitude: 12.9675,
        longitude: 79.9406,
        handling_instructions: "Requires refrigerated insulated transport (4°C)",
        status: "partially_reserved",
        created_at: new Date(now - 1 * 3600 * 1000).toISOString(),
        supplier_name: "Sriperumbudur Mega Food Retailers",
        supplier_city: "Sriperumbudur",
        supplier_verification: "verified"
      },
      {
        id: 4,
        supplier_organization_id: 1,
        created_by_user_id: 2,
        food_name: "Potatoes and Onions Sack Bundles",
        category: "vegetables",
        quantity_total: 500.0,
        quantity_available: 500.0,
        quantity_reserved: 0.0,
        quantity_collected: 0.0,
        unit: "kg",
        condition_state: "fresh",
        storage_type: "ambient",
        available_from: new Date(now - 4 * 3600 * 1000).toISOString(),
        expiry_at: new Date(now + 14 * 24 * 3600 * 1000).toISOString(),
        pickup_deadline: new Date(now + 4 * 24 * 3600 * 1000).toISOString(),
        pickup_address: "Gate 4, Koyambedu Wholesale Market Complex, Chennai",
        latitude: 13.0694,
        longitude: 80.1948,
        handling_instructions: "Dry shaded storage required",
        status: "available",
        created_at: new Date(now - 4 * 3600 * 1000).toISOString(),
        supplier_name: "Koyambedu Wholesale Agro Hub",
        supplier_city: "Chennai",
        supplier_verification: "verified"
      }
    ];

    this.requests = [
      {
        id: 1,
        recipient_organization_id: 6,
        requested_by_user_id: 4,
        food_category: "vegetables",
        quantity_needed: 250.0,
        unit: "kg",
        urgency_level: "high",
        servings_count: 500,
        storage_capacity_available: 400.0,
        required_by_time: new Date(now + 12 * 3600 * 1000).toISOString(),
        dietary_restrictions: "Vegetarian only",
        status: "partially_fulfilled",
        created_at: new Date(now - 3 * 3600 * 1000).toISOString(),
        recipient_name: "Hope Harbor Children Shelter & Community Kitchen",
        recipient_address: "42, Kamaraj Nagar, Tambaram East",
        recipient_city: "Tambaram",
        latitude: 12.9220,
        longitude: 80.1340
      },
      {
        id: 2,
        recipient_organization_id: 7,
        requested_by_user_id: null,
        food_category: "grains_dry",
        quantity_needed: 400.0,
        unit: "kg",
        urgency_level: "critical",
        servings_count: 800,
        storage_capacity_available: 600.0,
        required_by_time: new Date(now + 8 * 3600 * 1000).toISOString(),
        dietary_restrictions: "Rice & lentils preferred",
        status: "pending",
        created_at: new Date(now - 4 * 3600 * 1000).toISOString(),
        recipient_name: "Adyar Elders Care & Flood Relief Center",
        recipient_address: "18, Canal Bank Road, Gandhi Nagar, Adyar, Chennai",
        recipient_city: "Chennai",
        latitude: 13.0067,
        longitude: 80.2570
      },
      {
        id: 3,
        recipient_organization_id: 6,
        requested_by_user_id: 4,
        food_category: "dairy",
        quantity_needed: 150.0,
        unit: "liters",
        urgency_level: "high",
        servings_count: 300,
        storage_capacity_available: 200.0,
        required_by_time: new Date(now + 10 * 3600 * 1000).toISOString(),
        dietary_restrictions: "Pasteurized milk required for children",
        status: "fulfilled",
        created_at: new Date(now - 2 * 3600 * 1000).toISOString(),
        recipient_name: "Hope Harbor Children Shelter & Community Kitchen",
        recipient_address: "42, Kamaraj Nagar, Tambaram East",
        recipient_city: "Tambaram",
        latitude: 12.9220,
        longitude: 80.1340
      },
      {
        id: 4,
        recipient_organization_id: 8,
        requested_by_user_id: null,
        food_category: "cooked_meals",
        quantity_needed: 300.0,
        unit: "servings",
        urgency_level: "critical",
        servings_count: 300,
        storage_capacity_available: 200.0,
        required_by_time: new Date(now + 4 * 3600 * 1000).toISOString(),
        dietary_restrictions: "Ready-to-eat hot meal packets",
        status: "pending",
        created_at: new Date(now - 1 * 3600 * 1000).toISOString(),
        recipient_name: "Chengalpattu Tribal Welfare Community Kitchen",
        recipient_address: "Pudupattinam Road, Chengalpattu",
        recipient_city: "Chengalpattu",
        latitude: 12.6950,
        longitude: 79.9750
      }
    ];

    this.allocations = [
      {
        id: 1,
        food_listing_id: 1,
        food_request_id: 1,
        quantity_allocated: 250.0,
        status: "approved",
        match_score: 94.50,
        match_reasons: "High urgency match; perishable vegetables with 18h window; within optimal delivery radius (14km)",
        approved_by_user_id: 1,
        created_at: new Date(now - 2 * 3600 * 1000).toISOString(),
        food_name: "Fresh Country Tomatoes & Greens",
        category: "vegetables",
        unit: "kg",
        pickup_address: "Gate 4, Koyambedu Wholesale Market Complex, Chennai",
        supplier_name: "Koyambedu Wholesale Agro Hub",
        recipient_name: "Hope Harbor Children Shelter & Community Kitchen",
        recipient_address: "42, Kamaraj Nagar, Tambaram East",
        delivery_id: 1,
        delivery_status: "in_transit",
        driver_name: "Murugan K. (Rescue Logistics)"
      },
      {
        id: 2,
        food_listing_id: 3,
        food_request_id: 3,
        quantity_allocated: 150.0,
        status: "approved",
        match_score: 91.20,
        match_reasons: "Strict dairy shelf-life constraint satisfied; high urgency child nutrition priority",
        approved_by_user_id: 1,
        created_at: new Date(now - 1 * 3600 * 1000).toISOString(),
        food_name: "Nutritious Fresh Milk & Curd Packs",
        category: "dairy",
        unit: "liters",
        pickup_address: "Bangalore Highway, Sriperumbudur",
        supplier_name: "Sriperumbudur Mega Food Retailers",
        recipient_name: "Hope Harbor Children Shelter & Community Kitchen",
        recipient_address: "42, Kamaraj Nagar, Tambaram East",
        delivery_id: 2,
        delivery_status: "assigned",
        driver_name: null
      }
    ];

    this.deliveries = [
      {
        id: 1,
        allocation_id: 1,
        driver_id: 5,
        vehicle_type: "mini_truck",
        vehicle_capacity: 500.0,
        pickup_status: "picked_up",
        delivery_status: "in_transit",
        estimated_arrival: new Date(now + 45 * 60 * 1000).toISOString(),
        quantity_collected: 250.0,
        quantity_delivered: 0.0,
        route_distance_km: 18.4,
        route_estimated_minutes: 42,
        created_at: new Date(now - 2 * 3600 * 1000).toISOString(),
        food_name: "Fresh Country Tomatoes & Greens",
        category: "vegetables",
        quantity_allocated: 250.0,
        unit: "kg",
        pickup_address: "Gate 4, Koyambedu Wholesale Market Complex, Chennai",
        recipient_address: "42, Kamaraj Nagar, Tambaram East",
        supplier_name: "Koyambedu Wholesale Agro Hub",
        recipient_name: "Hope Harbor Children Shelter & Community Kitchen",
        driver_name: "Murugan K. (Rescue Logistics)",
        driver_phone: "+91 97890 12345"
      },
      {
        id: 2,
        allocation_id: 2,
        driver_id: null,
        vehicle_type: "reefer_van",
        vehicle_capacity: 600.0,
        pickup_status: "pending",
        delivery_status: "assigned",
        estimated_arrival: new Date(now + 90 * 60 * 1000).toISOString(),
        quantity_collected: 0.0,
        quantity_delivered: 0.0,
        route_distance_km: 26.2,
        route_estimated_minutes: 55,
        created_at: new Date(now - 1 * 3600 * 1000).toISOString(),
        food_name: "Nutritious Fresh Milk & Curd Packs",
        category: "dairy",
        quantity_allocated: 150.0,
        unit: "liters",
        pickup_address: "Bangalore Highway, Sriperumbudur",
        recipient_address: "42, Kamaraj Nagar, Tambaram East",
        supplier_name: "Sriperumbudur Mega Food Retailers",
        recipient_name: "Hope Harbor Children Shelter & Community Kitchen",
        driver_name: undefined,
        driver_phone: undefined
      }
    ];

    this.disruptions = [
      {
        id: 1,
        disruption_type: "rainfall",
        affected_area: "South Chennai & Tambaram Corridor",
        severity: "high",
        parameters: { precipitation_mm: 120, estimated_duration_hours: 48 },
        status: "active",
        created_at: new Date(now - 5 * 3600 * 1000).toISOString()
      },
      {
        id: 2,
        disruption_type: "road_closure",
        affected_area: "GST Road Tambaram Inundation",
        severity: "moderate",
        parameters: { detour_delay_minutes: 35 },
        status: "active",
        created_at: new Date(now - 3 * 3600 * 1000).toISOString()
      }
    ];
  }
}

// Singleton in-memory store
export const memoryStore = new MemoryStore();
