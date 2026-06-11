import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { habitController } from './habit.controller.js';
import {
  checkInHabitSchema,
  createHabitSchema,
  habitIdSchema,
  listHabitsSchema,
  updateHabitSchema,
} from './habit.validation.js';

export function createHabitRoutes({
  controller = habitController,
  requireAuthMiddleware = requireAuth,
} = {}) {
  const router = Router();

  router.use(requireAuthMiddleware);

  router.get('/', validate(listHabitsSchema), asyncHandler(controller.list));
  router.post('/', validate(createHabitSchema), asyncHandler(controller.create));
  router.get('/:id', validate(habitIdSchema), asyncHandler(controller.getById));
  router.patch('/:id', validate(updateHabitSchema), asyncHandler(controller.update));
  router.delete('/:id', validate(habitIdSchema), asyncHandler(controller.remove));
  router.post('/:id/check-in', validate(checkInHabitSchema), asyncHandler(controller.checkIn));

  return router;
}

export const habitRoutes = createHabitRoutes();
