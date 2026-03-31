import { Router } from 'express';
import { handleCommand } from '../../application/commandRouter.js';

const router = Router();
router.post('/', handleCommand);
export default router;
