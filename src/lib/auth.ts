import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { queryOne, PREFIX } from './db';
import { User, UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfoodbridgeaijwtkey2026_sdg2_climate_resilience';
const AUTH_COOKIE_NAME = 'foodbridge_auth_token';

export interface TokenPayload {
  userId: number;
  email: string;
  role: UserRole;
  orgId?: number | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function getCurrentUserFromRequest(req?: NextRequest): Promise<User | null> {
  let token: string | undefined;

  if (req) {
    // Check Authorization header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    }
  } else {
    // Server Component or Action
    const cookieStore = cookies();
    token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  }

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) return null;

  // Fetch full user with organization info
  const user = await queryOne<User>(
    `SELECT u.id, u.name, u.email, u.role, u.status, u.phone, u.organization_id, u.created_at, u.updated_at,
            o.name as organization_name, o.organization_type, o.verification_status as org_verification_status
     FROM ${PREFIX}users u
     LEFT JOIN ${PREFIX}organizations o ON u.organization_id = o.id
     WHERE u.id = ?`,
    [decoded.userId]
  );

  return user;
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE_NAME;
}
