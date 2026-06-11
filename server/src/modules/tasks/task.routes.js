import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { taskController } from './task.controller.js';
import {
  createTaskSchema,
  listTasksSchema,
  taskIdSchema,
  updateTaskSchema,
} from './task.validation.js';

export function createTaskRoutes({
  controller = taskController,
  requireAuthMiddleware = requireAuth,
} = {}) {
  const router = Router();

  router.use(requireAuthMiddleware);

  router.get('/', validate(listTasksSchema), asyncHandler(controller.list));
  router.post('/', validate(createTaskSchema), asyncHandler(controller.create));
  router.get('/:id', validate(taskIdSchema), asyncHandler(controller.getById));
  router.patch('/:id', validate(updateTaskSchema), asyncHandler(controller.update));
  router.delete('/:id', validate(taskIdSchema), asyncHandler(controller.remove));

  return router;
}

export const taskRoutes = createTaskRoutes();
