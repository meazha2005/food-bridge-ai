import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const DB_HOST = "192.169.147.255";
const DB_PORT = 3306;
const DB_USER = "MEAZHA";
const DB_PASS = "dZYRYi(o(0*U";
const DB_NAME = "le_test";
const PREFIX = "vels_hackathon_";

async function main() {
  console.log(`Connecting to MySQL ${DB_HOST}:${DB_PORT}/${DB_NAME}...`);
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  });

  console.log(`Creating tables with prefix: ${PREFIX}`);

  // 1. users
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin', 'supplier', 'ngo', 'recipient', 'delivery') NOT NULL,
      status ENUM('active', 'pending', 'suspended') DEFAULT 'active',
      organization_id INT NULL,
      phone VARCHAR(50) NULL,
      reset_token VARCHAR(255) NULL,
      reset_token_expiry DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_role (role),
      INDEX idx_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 2. organizations
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}organizations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      organization_type ENUM('supplier', 'ngo', 'recipient') NOT NULL,
      verification_status ENUM('pending', 'verified', 'rejected', 'suspended') DEFAULT 'verified',
      verification_notes TEXT NULL,
      verified_at DATETIME NULL,
      address TEXT NOT NULL,
      city VARCHAR(100) DEFAULT 'Chennai',
      latitude DECIMAL(10, 7) NOT NULL,
      longitude DECIMAL(10, 7) NOT NULL,
      storage_capacity DECIMAL(10, 2) DEFAULT 1000.00,
      storage_type VARCHAR(100) DEFAULT 'ambient',
      contact_email VARCHAR(255) NULL,
      contact_phone VARCHAR(50) NULL,
      operating_hours VARCHAR(100) DEFAULT '08:00 AM - 08:00 PM',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_type (organization_type),
      INDEX idx_status (verification_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 3. organization_members
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}organization_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      organization_id INT NOT NULL,
      user_id INT NOT NULL,
      member_role VARCHAR(50) DEFAULT 'member',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_org (organization_id),
      INDEX idx_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 4. food_listings
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}food_listings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      supplier_organization_id INT NOT NULL,
      created_by_user_id INT NULL,
      food_name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      quantity_total DECIMAL(10, 2) NOT NULL,
      quantity_available DECIMAL(10, 2) NOT NULL,
      quantity_reserved DECIMAL(10, 2) DEFAULT 0.00,
      quantity_collected DECIMAL(10, 2) DEFAULT 0.00,
      unit VARCHAR(50) DEFAULT 'kg',
      condition_state VARCHAR(50) DEFAULT 'fresh',
      storage_type VARCHAR(50) DEFAULT 'ambient',
      available_from DATETIME NOT NULL,
      expiry_at DATETIME NOT NULL,
      pickup_deadline DATETIME NOT NULL,
      pickup_address TEXT NOT NULL,
      latitude DECIMAL(10, 7) NOT NULL,
      longitude DECIMAL(10, 7) NOT NULL,
      handling_instructions TEXT NULL,
      image_url VARCHAR(500) NULL,
      status ENUM('available', 'partially_reserved', 'fully_reserved', 'completed', 'cancelled', 'expired') DEFAULT 'available',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_supplier (supplier_organization_id),
      INDEX idx_status (status),
      INDEX idx_cat (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 5. food_requests
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}food_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      recipient_organization_id INT NOT NULL,
      requested_by_user_id INT NULL,
      category VARCHAR(100) NOT NULL,
      quantity_requested DECIMAL(10, 2) NOT NULL,
      quantity_allocated DECIMAL(10, 2) DEFAULT 0.00,
      quantity_delivered DECIMAL(10, 2) DEFAULT 0.00,
      unit VARCHAR(50) DEFAULT 'kg',
      people_to_serve INT DEFAULT 0,
      urgency ENUM('critical', 'high', 'medium', 'low') DEFAULT 'medium',
      urgency_reason TEXT NULL,
      deadline DATETIME NOT NULL,
      delivery_address TEXT NOT NULL,
      latitude DECIMAL(10, 7) NOT NULL,
      longitude DECIMAL(10, 7) NOT NULL,
      acceptable_alternatives TEXT NULL,
      storage_facilities TEXT NULL,
      status ENUM('open', 'partially_allocated', 'allocated', 'in_transit', 'fulfilled', 'cancelled') DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_recipient (recipient_organization_id),
      INDEX idx_status (status),
      INDEX idx_urgency (urgency)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 6. food_allocations
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}food_allocations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      food_listing_id INT NOT NULL,
      food_request_id INT NOT NULL,
      quantity_allocated DECIMAL(10, 2) NOT NULL,
      status ENUM('recommended', 'approved', 'rejected', 'in_transit', 'delivered', 'cancelled') DEFAULT 'approved',
      match_score DECIMAL(5, 2) DEFAULT 0.00,
      match_reasons TEXT NULL,
      approved_by_user_id INT NULL,
      override_reason TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_listing (food_listing_id),
      INDEX idx_request (food_request_id),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 7. deliveries
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}deliveries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      allocation_id INT NOT NULL,
      driver_id INT NULL,
      vehicle_type VARCHAR(100) DEFAULT 'mini_truck',
      vehicle_capacity DECIMAL(10, 2) DEFAULT 500.00,
      pickup_status ENUM('pending', 'scheduled', 'picked_up', 'failed') DEFAULT 'pending',
      delivery_status ENUM('assigned', 'en_route_pickup', 'picked_up', 'in_transit', 'delivered', 'partially_delivered', 'failed', 'cancelled') DEFAULT 'assigned',
      estimated_arrival DATETIME NULL,
      actual_pickup_at DATETIME NULL,
      actual_delivery_at DATETIME NULL,
      quantity_collected DECIMAL(10, 2) DEFAULT 0.00,
      quantity_delivered DECIMAL(10, 2) DEFAULT 0.00,
      recipient_confirmation_notes TEXT NULL,
      exception_reason TEXT NULL,
      route_distance_km DECIMAL(8, 2) DEFAULT 0.00,
      route_estimated_minutes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_driver (driver_id),
      INDEX idx_alloc (allocation_id),
      INDEX idx_status (delivery_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 8. delivery_events
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}delivery_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      delivery_id INT NOT NULL,
      event_type VARCHAR(100) NOT NULL,
      notes TEXT NULL,
      latitude DECIMAL(10, 7) NULL,
      longitude DECIMAL(10, 7) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_deliv (delivery_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 9. disruptions
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}disruptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      disruption_type ENUM('rainfall', 'road_closure', 'supply_shock', 'demand_surge', 'vehicle_breakdown') NOT NULL,
      affected_area VARCHAR(255) NOT NULL,
      severity ENUM('low', 'moderate', 'high', 'severe') DEFAULT 'moderate',
      parameters JSON NULL,
      status ENUM('active', 'monitoring', 'resolved') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 10. simulation_runs
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}simulation_runs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      scenario_type VARCHAR(100) NOT NULL,
      scenario_config JSON NOT NULL,
      original_metrics JSON NOT NULL,
      revised_metrics JSON NOT NULL,
      results JSON NOT NULL,
      created_by_user_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 11. notifications
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      link_url VARCHAR(255) NULL,
      type VARCHAR(50) DEFAULT 'info',
      read_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 12. audit_logs
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      actor_id INT NULL,
      actor_name VARCHAR(255) NULL,
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(100) NOT NULL,
      entity_id INT NULL,
      details JSON NULL,
      ip_address VARCHAR(50) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_actor (actor_id),
      INDEX idx_action (action)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 13. complaints
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}complaints (
      id INT AUTO_INCREMENT PRIMARY KEY,
      reported_by_user_id INT NOT NULL,
      target_type ENUM('listing', 'delivery', 'organization', 'other') NOT NULL,
      target_id INT NULL,
      subject VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      status ENUM('pending', 'under_review', 'resolved', 'dismissed') DEFAULT 'pending',
      resolution_notes TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 14. settings
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log("All 14 tables verified/created successfully!");

  // Check user count
  const [rows] = await conn.query(`SELECT COUNT(*) as cnt FROM ${PREFIX}users`);
  const countUsers = rows[0].cnt;
  console.log(`Current users count in ${PREFIX}users: ${countUsers}`);

  if (countUsers === 0) {
    console.log("Seeding demo organizations and demo users...");

    // Organizations
    const orgs = [
      ["Koyambedu Wholesale Agro Hub", "supplier", "verified", "Gate 4, Koyambedu Wholesale Market Complex, Chennai", "Chennai", 13.0694, 80.1948, 5000.0, "ambient", "agro@koyambedu.tn.gov.in", "+91 94441 23456"],
      ["Chengalpattu Organic Farmers Producer Co", "supplier", "verified", "Old GST Road, Chengalpattu Rural", "Chengalpattu", 12.6825, 79.9836, 3000.0, "ambient", "farmers@cpt-organic.org", "+91 98402 34567"],
      ["Sriperumbudur Mega Food Retailers", "supplier", "verified", "Bangalore Highway, Sriperumbudur", "Sriperumbudur", 12.9675, 79.9406, 2500.0, "cold_storage", "logistics@sriperumbudurretail.com", "+91 97910 88990"],
      ["Chennai Food Rescue Bank", "ngo", "verified", "14, 2nd Main Road, Anna Nagar, Chennai", "Chennai", 13.0850, 80.2100, 4000.0, "cold_storage", "relief@chennaiaid.org", "+91 98840 12345"],
      ["Tambaram Community Feeding Alliance", "ngo", "verified", "5, Gandhi Road, West Tambaram, Chennai", "Tambaram", 12.9249, 80.1278, 2000.0, "ambient", "care@tambaramalliance.org", "+91 98410 56789"],
      ["Hope Harbor Children Shelter & Community Kitchen", "recipient", "verified", "42, Kamaraj Nagar, Tambaram East", "Tambaram", 12.9220, 80.1340, 500.0, "ambient", "shelter@hopehome.org", "+91 98400 98765"],
      ["Adyar Elders Care & Flood Relief Center", "recipient", "verified", "18, Canal Bank Road, Gandhi Nagar, Adyar, Chennai", "Chennai", 13.0067, 80.2570, 800.0, "ambient", "support@adyarcare.org", "+91 99620 44556"],
      ["Chengalpattu Tribal Welfare Community Kitchen", "recipient", "verified", "Pudupattinam Road, Chengalpattu", "Chengalpattu", 12.6950, 79.9750, 600.0, "ambient", "tribalwelfare@cpt.org", "+91 94433 11223"]
    ];

    const orgIds = {};
    for (const [name, otype, status, addr, city, lat, lng, cap, stype, email, phone] of orgs) {
      const [res] = await conn.query(`
        INSERT INTO ${PREFIX}organizations 
        (name, organization_type, verification_status, address, city, latitude, longitude, storage_capacity, storage_type, contact_email, contact_phone, verified_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [name, otype, status, addr, city, lat, lng, cap, stype, email, phone]);
      orgIds[name] = res.insertId;
    }
    console.log(`Seeded ${Object.keys(orgIds).length} organizations.`);

    // Users
    const users = [
      ["State Food Relief Admin", "admin@foodbridge.org", await bcrypt.hash("Admin@123", 10), "admin", "active", null, "+91 90000 00001"],
      ["Ramanathan (Koyambedu Agro)", "supplier@farmfresh.org", await bcrypt.hash("Supplier@123", 10), "supplier", "active", orgIds["Koyambedu Wholesale Agro Hub"], "+91 94441 23456"],
      ["Dr. Priya Sundaram (Chennai Food Rescue)", "ngo@chennaiaid.org", await bcrypt.hash("Ngo@123", 10), "ngo", "active", orgIds["Chennai Food Rescue Bank"], "+91 98840 12345"],
      ["Sister Anitha (Hope Shelter)", "shelter@hopehome.org", await bcrypt.hash("Recipient@123", 10), "recipient", "active", orgIds["Hope Harbor Children Shelter & Community Kitchen"], "+91 98400 98765"],
      ["Murugan K. (Rescue Logistics)", "driver@expressrescue.org", await bcrypt.hash("Driver@123", 10), "delivery", "active", null, "+91 97890 12345"]
    ];

    const userIds = {};
    for (const [name, email, pwhash, role, status, oid, phone] of users) {
      const [res] = await conn.query(`
        INSERT INTO ${PREFIX}users (name, email, password_hash, role, status, organization_id, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [name, email, pwhash, role, status, oid, phone]);
      userIds[email] = res.insertId;
    }
    console.log(`Seeded ${Object.keys(userIds).length} users.`);

    // Food Listings
    const listings = [
      [orgIds["Koyambedu Wholesale Agro Hub"], userIds["supplier@farmfresh.org"], "Fresh Country Tomatoes & Greens", "vegetables", 600.0, 350.0, 250.0, 0.0, "kg", "fresh", "ambient", new Date(Date.now() - 2*3600*1000), new Date(Date.now() + 48*3600*1000), new Date(Date.now() + 14*3600*1000), "Gate 4, Koyambedu Wholesale Market, Chennai", 13.0694, 80.1948, "Handle with care in ventilated crates", "partially_reserved"],
      [orgIds["Chengalpattu Organic Farmers Producer Co"], null, "Harvest Surplus Brown Rice & Millets", "grains_dry", 1000.0, 1000.0, 0.0, 0.0, "kg", "fresh", "ambient", new Date(Date.now() - 5*3600*1000), new Date(Date.now() + 45*24*3600*1000), new Date(Date.now() + 5*24*3600*1000), "Old GST Road, Chengalpattu Rural", 12.6825, 79.9836, "Moisture protected jute sacks", "available"],
      [orgIds["Sriperumbudur Mega Food Retailers"], null, "Nutritious Fresh Milk & Curd Packs", "dairy", 200.0, 50.0, 150.0, 0.0, "liters", "fresh", "refrigerated", new Date(Date.now() - 1*3600*1000), new Date(Date.now() + 18*3600*1000), new Date(Date.now() + 6*3600*1000), "Bangalore Highway, Sriperumbudur", 12.9675, 79.9406, "Requires refrigerated insulated transport (4°C)", "partially_reserved"],
      [orgIds["Koyambedu Wholesale Agro Hub"], userIds["supplier@farmfresh.org"], "Potatoes and Onions Sack Bundles", "vegetables", 500.0, 500.0, 0.0, 0.0, "kg", "fresh", "ambient", new Date(Date.now() - 4*3600*1000), new Date(Date.now() + 10*24*3600*1000), new Date(Date.now() + 3*24*3600*1000), "Gate 4, Koyambedu Wholesale Market, Chennai", 13.0694, 80.1948, "Dry shaded storage required", "available"]
    ];

    const listingIds = [];
    for (const [soid, uid, fname, cat, qtot, qavail, qres, qcol, unit, cond, stype, afrom, exp, pdead, addr, lat, lng, instr, st] of listings) {
      const [res] = await conn.query(`
        INSERT INTO ${PREFIX}food_listings 
        (supplier_organization_id, created_by_user_id, food_name, category, quantity_total, quantity_available, quantity_reserved, quantity_collected, unit, condition_state, storage_type, available_from, expiry_at, pickup_deadline, pickup_address, latitude, longitude, handling_instructions, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [soid, uid, fname, cat, qtot, qavail, qres, qcol, unit, cond, stype, afrom, exp, pdead, addr, lat, lng, instr, st]);
      listingIds.push(res.insertId);
    }
    console.log(`Seeded ${listingIds.length} food listings.`);

    // Food Requests
    const requests = [
      [orgIds["Hope Harbor Children Shelter & Community Kitchen"], userIds["shelter@hopehome.org"], "vegetables", 250.0, 250.0, 0.0, "kg", 180, "critical", "El Niño localized flash flooding in Tambaram low-lying belt cut off local market access.", new Date(Date.now() + 10*3600*1000), "42, Kamaraj Nagar, Tambaram East", 12.9220, 80.1340, "Any root vegetables or leafy greens", "Standard kitchen pantry", "allocated"],
      [orgIds["Adyar Elders Care & Flood Relief Center"], null, "vegetables", 200.0, 0.0, 0.0, "kg", 120, "high", "Coastal rainfall disruption delayed vendor deliveries.", new Date(Date.now() + 20*3600*1000), "18, Canal Bank Road, Adyar, Chennai", 13.0067, 80.2570, "Potatoes, carrots, cabbage", "Kitchen refrigerator available", "open"],
      [orgIds["Chengalpattu Tribal Welfare Community Kitchen"], null, "grains_dry", 500.0, 0.0, 0.0, "kg", 350, "medium", "Seasonal lean harvest buffer replenishment.", new Date(Date.now() + 48*3600*1000), "Pudupattinam Road, Chengalpattu", 12.6950, 79.9750, "Rice, wheat, millets", "Dry grain room", "open"],
      [orgIds["Hope Harbor Children Shelter & Community Kitchen"], userIds["shelter@hopehome.org"], "dairy", 150.0, 150.0, 0.0, "liters", 180, "critical", "Daily morning nourishment for 180 resident children.", new Date(Date.now() + 8*3600*1000), "42, Kamaraj Nagar, Tambaram East", 12.9220, 80.1340, "Pasteurized milk pouches", "Walk-in cold storage box", "allocated"]
    ];

    const requestIds = [];
    for (const [roid, uid, cat, qreq, qalloc, qdel, unit, people, urg, reason, dline, addr, lat, lng, alt, stfac, st] of requests) {
      const [res] = await conn.query(`
        INSERT INTO ${PREFIX}food_requests
        (recipient_organization_id, requested_by_user_id, category, quantity_requested, quantity_allocated, quantity_delivered, unit, people_to_serve, urgency, urgency_reason, deadline, delivery_address, latitude, longitude, acceptable_alternatives, storage_facilities, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [roid, uid, cat, qreq, qalloc, qdel, unit, people, urg, reason, dline, addr, lat, lng, alt, stfac, st]);
      requestIds.push(res.insertId);
    }
    console.log(`Seeded ${requestIds.length} food requests.`);

    // Allocations
    const [allocRes1] = await conn.query(`
      INSERT INTO ${PREFIX}food_allocations 
      (food_listing_id, food_request_id, quantity_allocated, status, match_score, match_reasons, approved_by_user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [listingIds[0], requestIds[0], 250.0, "approved", 92.50, "High urgency match (95%), Proximity 18km (85%), Freshness safety window >10h (95%)", userIds["admin@foodbridge.org"]]);

    const [allocRes2] = await conn.query(`
      INSERT INTO ${PREFIX}food_allocations 
      (food_listing_id, food_request_id, quantity_allocated, status, match_score, match_reasons, approved_by_user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [listingIds[2], requestIds[3], 150.0, "approved", 89.00, "Critical infant nutrition need, Compatible cold-storage, Route clear via NH48", userIds["admin@foodbridge.org"]]);

    const alloc1Id = allocRes1.insertId;
    const alloc2Id = allocRes2.insertId;

    // Deliveries
    const [delivRes] = await conn.query(`
      INSERT INTO ${PREFIX}deliveries
      (allocation_id, driver_id, vehicle_type, vehicle_capacity, pickup_status, delivery_status, estimated_arrival, actual_pickup_at, actual_delivery_at, quantity_collected, quantity_delivered, route_distance_km, route_estimated_minutes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [alloc1Id, userIds["driver@expressrescue.org"], "Tata Ace Refrig 1-Ton", 1000.0, "picked_up", "in_transit", new Date(Date.now() + 45*60*1000), new Date(Date.now() - 25*60*1000), null, 250.0, 0.0, 22.4, 45]);

    const delivId = delivRes.insertId;

    // Delivery Events
    await conn.query(`
      INSERT INTO ${PREFIX}delivery_events (delivery_id, event_type, notes, latitude, longitude)
      VALUES 
      (?, 'ASSIGNED', 'Assigned to rescue driver Murugan K.', 13.0694, 80.1948),
      (?, 'PICKED_UP', 'Picked up 250kg fresh produce from Koyambedu Wholesale Agro Hub. Quality checked: Grade A.', 13.0694, 80.1948),
      (?, 'IN_TRANSIT', 'En route via Kathipara Junction towards Tambaram. Minor waterlogging reported near Guindy.', 13.0067, 80.2020)
    `, [delivId, delivId, delivId]);

    // Disruptions
    await conn.query(`
      INSERT INTO ${PREFIX}disruptions (disruption_type, affected_area, severity, parameters, status)
      VALUES 
      ('rainfall', 'South Chennai & Tambaram Arterial Corridor', 'high', ?, 'active'),
      ('road_closure', 'GST Road Maduravoyal Service Lane', 'moderate', ?, 'monitoring')
    `, [
      JSON.stringify({ rainfall_mm: 65, travel_time_penalty_pct: 35, flood_risk_level: "Orange" }),
      JSON.stringify({ blocked_segment: "Maduravoyal Bypass", detour_route: "Inner Ring Road via Porur" })
    ]);

    // Notifications
    await conn.query(`
      INSERT INTO ${PREFIX}notifications (user_id, title, message, link_url, type)
      VALUES
      (?, 'Welcome to FoodBridge AI', 'Your Supplier organization has been verified. You can now post rescue food listings.', '/supplier/dashboard', 'success'),
      (?, 'New Active Delivery Assigned', 'You have an active pickup assigned: 250kg fresh produce from Koyambedu.', '/delivery/deliveries', 'info'),
      (?, 'Climate Alert: Unseasonal Rain Warning', 'Heavy rainfall alert in South Chennai. Expect 35% travel delays along GST Road.', '/admin/simulator', 'warning')
    `, [userIds["supplier@farmfresh.org"], userIds["driver@expressrescue.org"], userIds["admin@foodbridge.org"]]);

    // Settings
    const defaultSettings = [
      ["weight_recipient_urgency", "30"],
      ["weight_food_expiry_urgency", "25"],
      ["weight_unmet_demand", "20"],
      ["weight_suitability", "15"],
      ["weight_proximity", "10"],
      ["rainfall_delay_penalty_percent", "35"],
      ["food_categories", "vegetables,fruits,cooked_meals,grains_dry,dairy,bakery"],
      ["units", "kg,liters,meals,crates,packets"]
    ];
    for (const [k, v] of defaultSettings) {
      await conn.query(`INSERT INTO ${PREFIX}settings (setting_key, setting_value) VALUES (?, ?)`, [k, v]);
    }

    // Audit Log
    await conn.query(`
      INSERT INTO ${PREFIX}audit_logs (actor_id, actor_name, action, entity_type, entity_id, details)
      VALUES (?, 'System Initializer', 'SEED_DATABASE', 'SYSTEM', 1, ?)
    `, [userIds["admin@foodbridge.org"], JSON.stringify({ action: "Initial Tamil Nadu demo seed loaded successfully" })]);
  }

  await conn.end();
  console.log("Database initialized and verified successfully!");
}

main().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
