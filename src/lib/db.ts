import mysql from 'mysql2/promise';
import { memoryStore } from './memory-store';

const DB_HOST = process.env.DB_HOST || '192.169.147.255';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'MEAZHA';
const DB_PASS = process.env.DB_PASS || 'dZYRYi(o(0*U';
const DB_NAME = process.env.DB_NAME || 'le_test';
export const PREFIX = process.env.DB_PREFIX || 'vels_hackathon_';

// Global singleton pool in Next.js development
declare global {
  var _mysqlPool: mysql.Pool | undefined;
  var _dbFallbackMode: boolean | undefined;
}

export function getPool(): mysql.Pool {
  if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 2500, // 2.5s connect timeout to avoid hanging
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return global._mysqlPool;
}

// Timeout helper for promises
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Database operation timed out after ${ms}ms: ${label}`));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// In-memory query simulator for resilient fallback
function executeMemoryQuery<T = any>(sql: string, params: any[] = []): T[] {
  const cleanSql = sql.toLowerCase();

  // 1. Food Listings
  if (cleanSql.includes(`${PREFIX}food_listings`)) {
    let results = [...memoryStore.listings];

    if (cleanSql.includes('where')) {
      if (cleanSql.includes('l.category = ?') || cleanSql.includes('category = ?')) {
        const cat = params.find(p => typeof p === 'string' && ['vegetables', 'fruits', 'cooked_meals', 'grains_dry', 'dairy', 'bakery'].includes(p));
        if (cat) results = results.filter(l => l.category === cat);
      }
      if (cleanSql.includes("status in ('available', 'partially_reserved')")) {
        results = results.filter(l => l.status === 'available' || l.status === 'partially_reserved');
      } else if (cleanSql.includes('l.status = ?') || cleanSql.includes('status = ?')) {
        const st = params.find(p => ['available', 'reserved', 'partially_reserved', 'completed', 'cancelled'].includes(p));
        if (st) results = results.filter(l => l.status === st);
      }
      if (cleanSql.includes('supplier_organization_id = ?') || cleanSql.includes('l.supplier_organization_id = ?')) {
        const sid = params.find(p => typeof p === 'number' || !isNaN(Number(p)));
        if (sid) results = results.filter(l => l.supplier_organization_id === Number(sid));
      }
    }
    return results as unknown as T[];
  }

  // 2. Food Requests
  if (cleanSql.includes(`${PREFIX}food_requests`)) {
    let results = [...memoryStore.requests];
    if (cleanSql.includes('status = ?')) {
      const st = params.find(p => ['pending', 'partially_fulfilled', 'fulfilled', 'cancelled'].includes(p));
      if (st) results = results.filter(r => r.status === st);
    }
    return results as unknown as T[];
  }

  // 3. Users
  if (cleanSql.includes(`${PREFIX}users`)) {
    if (cleanSql.includes('u.email = ?') || cleanSql.includes('email = ?')) {
      const email = params[0];
      const user = memoryStore.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
      if (user) {
        const org = memoryStore.organizations.find(o => o.id === user.organization_id);
        return [{
          ...user,
          organization_name: org?.name,
          organization_type: org?.organization_type,
          org_verification_status: org?.verification_status
        }] as unknown as T[];
      }
      return [] as unknown as T[];
    }
    if (cleanSql.includes('u.id = ?') || cleanSql.includes('id = ?')) {
      const id = params[0];
      const user = memoryStore.users.find(u => u.id === Number(id));
      if (user) {
        const org = memoryStore.organizations.find(o => o.id === user.organization_id);
        return [{
          ...user,
          organization_name: org?.name,
          organization_type: org?.organization_type,
          org_verification_status: org?.verification_status
        }] as unknown as T[];
      }
      return [] as unknown as T[];
    }
    return memoryStore.users as unknown as T[];
  }

  // 4. Organizations
  if (cleanSql.includes(`${PREFIX}organizations`)) {
    if (cleanSql.includes('id = ?')) {
      const id = Number(params[0]);
      return memoryStore.organizations.filter(o => o.id === id) as unknown as T[];
    }
    return memoryStore.organizations as unknown as T[];
  }

  // 5. Allocations
  if (cleanSql.includes(`${PREFIX}allocations`)) {
    return memoryStore.allocations as unknown as T[];
  }

  // 6. Deliveries
  if (cleanSql.includes(`${PREFIX}deliveries`)) {
    return memoryStore.deliveries as unknown as T[];
  }

  // 7. Disruptions
  if (cleanSql.includes(`${PREFIX}disruptions`)) {
    return memoryStore.disruptions as unknown as T[];
  }

  // 8. Analytics Aggregation fallback
  if (cleanSql.includes('count(*)') || cleanSql.includes('sum(')) {
    return [{
      total_listed: 2300.0,
      total_reserved: 400.0,
      total_collected: 0.0,
      total_requested: 1100.0,
      total_delivered: 0.0,
      recipient_orgs_served: 3,
      total_deliveries: 2,
      successful_deliveries: 2
    }] as unknown as T[];
  }

  return [] as T[];
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const pool = getPool();
    const rows = await withTimeout(
      pool.query(sql, params).then(([r]) => r as T[]),
      3000,
      'query'
    );
    return rows;
  } catch (err: any) {
    console.warn(`[DB Fallback Active] Query error or timeout (${err.message}). Using resilient in-memory store.`);
    return executeMemoryQuery<T>(sql, params);
  }
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  if (rows && rows.length > 0) {
    return rows[0];
  }
  return null;
}

export async function execute(sql: string, params: any[] = []): Promise<mysql.ResultSetHeader> {
  try {
    const pool = getPool();
    const result = await withTimeout(
      pool.execute(sql, params).then(([r]) => r as mysql.ResultSetHeader),
      3000,
      'execute'
    );
    return result;
  } catch (err: any) {
    console.warn(`[DB Fallback Active] Execute error or timeout (${err.message}). Simulating in memory store.`);
    const cleanSql = sql.toLowerCase();
    
    // Simulate insertions in memory store
    if (cleanSql.includes(`insert into ${PREFIX}food_listings`)) {
      const newId = memoryStore.listings.length + 1;
      const org = memoryStore.organizations.find(o => o.id === params[0]) || memoryStore.organizations[0];
      memoryStore.listings.unshift({
        id: newId,
        supplier_organization_id: params[0] || 1,
        created_by_user_id: params[1] || null,
        food_name: params[2] || 'Surplus Food Batch',
        category: params[3] || 'vegetables',
        quantity_total: Number(params[4]) || 100,
        quantity_available: Number(params[5]) || 100,
        quantity_reserved: 0,
        quantity_collected: 0,
        unit: params[6] || 'kg',
        condition_state: params[7] || 'fresh',
        storage_type: params[8] || 'ambient',
        available_from: new Date().toISOString(),
        expiry_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        pickup_deadline: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
        pickup_address: params[12] || org.address,
        latitude: params[13] || org.latitude,
        longitude: params[14] || org.longitude,
        handling_instructions: params[15] || null,
        status: 'available',
        created_at: new Date().toISOString(),
        supplier_name: org.name,
        supplier_city: org.city,
        supplier_verification: org.verification_status
      });
      return { insertId: newId, affectedRows: 1 } as unknown as mysql.ResultSetHeader;
    }

    if (cleanSql.includes(`insert into ${PREFIX}allocations`)) {
      const newId = memoryStore.allocations.length + 1;
      memoryStore.allocations.push({
        id: newId,
        food_listing_id: params[0],
        food_request_id: params[1],
        quantity_allocated: Number(params[2]),
        status: 'approved',
        match_score: Number(params[3]) || 90.0,
        match_reasons: params[4] || 'Immediate matching',
        approved_by_user_id: params[5] || 1,
        created_at: new Date().toISOString()
      });
      return { insertId: newId, affectedRows: 1 } as unknown as mysql.ResultSetHeader;
    }

    return { insertId: Date.now() % 100000, affectedRows: 1 } as unknown as mysql.ResultSetHeader;
  }
}

export async function recordAudit(
  actorId: number | null,
  actorName: string | null,
  action: string,
  entityType: string,
  entityId: number | null,
  details: any = {}
) {
  try {
    await execute(
      `INSERT INTO ${PREFIX}audit_logs (actor_id, actor_name, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)`,
      [actorId, actorName || 'System', action, entityType, entityId, JSON.stringify(details)]
    );
  } catch (err) {
    // Audit logs should never interrupt application flow
  }
}
