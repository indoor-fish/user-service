import { UserDTO, UserRole, NotFoundError } from '@indoor-fish/shared-libs';

// In-memory store for demo; replace with Knex/pg in production
const users = new Map<string, UserDTO & { passwordHash: string }>();

export async function findUserByEmail(email: string) {
  return Array.from(users.values()).find(u => u.email === email) ?? null;
}

export async function findUserById(id: string) {
  const user = users.get(id);
  if (!user) throw new NotFoundError(`User ${id} not found`);
  return user;
}

export async function createUser(data: { email: string; passwordHash: string; name: string; role: UserRole }): Promise<UserDTO> {
  const id = crypto.randomUUID();
  const user = { id, email: data.email, passwordHash: data.passwordHash, name: data.name, role: data.role, suspended: false, emailVerified: false };
  users.set(id, user);
  return { id, email: user.email, name: user.name, role: user.role, suspended: false, emailVerified: false };
}

export async function updateUser(id: string, updates: Partial<UserDTO>): Promise<UserDTO> {
  const user = await findUserById(id);
  Object.assign(user, updates);
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  if (!users.has(id)) throw new NotFoundError(`User ${id} not found`);
  users.delete(id);
}

export async function listAllUsers(): Promise<UserDTO[]> {
  return Array.from(users.values()).map(({ passwordHash: _, ...u }) => u);
}
