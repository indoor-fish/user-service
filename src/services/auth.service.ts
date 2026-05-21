import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserDTO, UserRole, UnauthorizedError, ValidationError } from '@indoor-fish/shared-libs';
import { findUserByEmail, createUser } from './user.service';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const SALT_ROUNDS = 10;

// Business Rule: Users with MERCHANT role require email verification before login is permitted
// Business Rule: Maximum 5 failed login attempts before account lockout (15 minutes)
// Business Rule: Admin role can only be granted by an existing ADMIN — not self-assigned on registration

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function registerUser(email: string, password: string, name: string, role: UserRole = UserRole.CUSTOMER): Promise<UserDTO> {
  const existing = await findUserByEmail(email);
  if (existing) throw new ValidationError('Email already registered');

  // Admin role cannot be self-assigned on registration
  const safeRole = role === UserRole.ADMIN ? UserRole.CUSTOMER : role;
  const passwordHash = await hashPassword(password);
  return createUser({ email, passwordHash, name, role: safeRole });
}

export async function loginUser(email: string, password: string): Promise<{ user: UserDTO; token: string; refreshToken: string }> {
  const user = await findUserByEmail(email);
  if (!user) throw new UnauthorizedError('Invalid credentials');
  if (user.suspended) throw new UnauthorizedError('Account suspended');

  // Business Rule: MERCHANT users must have email verified before login
  if (user.role === UserRole.MERCHANT && !user.emailVerified) {
    throw new UnauthorizedError('Email verification required for merchant accounts');
  }

  const valid = await bcrypt.compare(password, (user as any).passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid credentials');

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: '30d' });
  return { user, token, refreshToken };
}

export function verifyRefreshToken(token: string): { id: string } {
  return jwt.verify(token, JWT_SECRET) as { id: string };
}
