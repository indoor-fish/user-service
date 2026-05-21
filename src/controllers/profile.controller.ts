import { Request, Response, NextFunction } from 'express';
import { findUserById, updateUser, deleteUser, listAllUsers } from '../services/user.service';
import { UserRole } from '@indoor-fish/shared-libs';

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await findUserById(req.params.id);
    res.json(user);
  } catch (err) { next(err); }
}

export async function updateUser_(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) { next(err); }
}
export { updateUser_ as updateUser };

export async function deleteUser_(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}
export { deleteUser_ as deleteUser };

export async function listUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await listAllUsers();
    res.json({ users });
  } catch (err) { next(err); }
}

export async function changeRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { role } = req.body as { role: UserRole };
    const user = await updateUser(req.params.id, { role });
    res.json(user);
  } catch (err) { next(err); }
}
