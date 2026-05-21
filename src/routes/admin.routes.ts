import { Router } from 'express';
import { UserRole } from '@indoor-fish/shared-libs';
import { requireRole } from '../middleware/requireRole';
import { listUsers, changeRole } from '../controllers/profile.controller';

const router = Router();
router.use(requireRole(UserRole.ADMIN));
router.get('/', listUsers);
router.patch('/:id/role', changeRole);

export default router;
