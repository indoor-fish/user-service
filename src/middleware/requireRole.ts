import { Request, Response, NextFunction } from 'express';
import { UserRole, UnauthorizedError } from '@indoor-fish/shared-libs';

export function requireRole(requiredRole: UserRole) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRole = req.headers['x-user-role'] as UserRole;
    if (!userRole || userRole !== requiredRole) {
      return next(new UnauthorizedError(`Role ${requiredRole} required`));
    }
    next();
  };
}
