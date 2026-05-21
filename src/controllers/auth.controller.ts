import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, verifyRefreshToken } from '../services/auth.service';
import { findUserById } from '../services/user.service';
import { publishUserRegistered } from '../events/userRegistered.event';
import jwt from 'jsonwebtoken';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name, role } = req.body;
    const user = await registerUser(email, password, name, role);
    await publishUserRegistered(user);
    res.status(201).json({ user });
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err) { next(err); }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const { id } = verifyRefreshToken(refreshToken);
    const user = await findUserById(id);
    const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) { next(err); }
}
