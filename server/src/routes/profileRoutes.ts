import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { updateProfileSchema } from '../schemas/profile.schema.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';

export const profileRouter = Router();

profileRouter.use(requireAuth);

profileRouter.get('/', getProfile);
profileRouter.put('/', validateBody(updateProfileSchema), updateProfile);
