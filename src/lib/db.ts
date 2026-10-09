import mysql from 'mysql2/promise';

const DB_HOST = process.env.DB_HOST || '192.169.147.255';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'MEAZHA';
const DB_PASS = process.env.DB_PASS || 'dZYRYi(o(0*U';
const DB_NAME = process.env.DB_NAME || 'le_test';
export const PREFIX = process.env.DB_PREFIX || 'vels_hackathon_';

// Global singleton pool in Next.js development
declare global {
  var _mysqlPool: mysql.Pool | undefined;
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
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return global._mysqlPool;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const pool = getPool();
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  if (rows && rows.length > 0) {
    return rows[0];
  }
  return null;
}

export async function execute(sql: string, params: any[] = []): Promise<mysql.ResultSetHeader> {
  const pool = getPool();
  const [result] = await pool.execute(sql, params);
  return result as mysql.ResultSetHeader;
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
    console.error('Failed to write audit log:', err);
  }
}
