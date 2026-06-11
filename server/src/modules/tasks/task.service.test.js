import { jest } from '@jest/globals';
import { NotFoundError } from '../../errors/AppError.js';
import { TaskService } from './task.service.js';

const userId = '507f1f77bcf86cd799439011';
const taskId = '507f1f77bcf86cd799439012';
const now = new Date('2026-06-12T01:00:00.000Z');

function createTask(overrides = {}) {
  return {
    _id: taskId,
    userId,
    title: 'Write task backend',
    description: 'Implement Phase 8',
    priority: 'High',
    dueDate: new Date('2026-06-12T00:00:00.000Z'),
    status: 'Todo',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function createQuery(result) {
  return {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result),
  };
}

function createLeanQuery(result) {
  return {
    lean: jest.fn().mockResolvedValue(result),
  };
}

describe('TaskService', () => {
  test('createTask stores the authenticated user id and returns a safe task', async () => {
    const storedTask = createTask();
    const TaskModel = {
      create: jest.fn().mockResolvedValue(storedTask),
    };
    const service = new TaskService(TaskModel);

    const result = await service.createTask(userId, {
      title: 'Write task backend',
      description: 'Implement Phase 8',
      priority: 'High',
      dueDate: storedTask.dueDate,
      status: 'Todo',
    });

    expect(TaskModel.create).toHaveBeenCalledWith({
      userId,
      title: 'Write task backend',
      description: 'Implement Phase 8',
      priority: 'High',
      dueDate: storedTask.dueDate,
      status: 'Todo',
    });
    expect(result).toEqual({
      _id: taskId,
      title: 'Write task backend',
      description: 'Implement Phase 8',
      priority: 'High',
      dueDate: storedTask.dueDate,
      status: 'Todo',
      createdAt: now,
      updatedAt: now,
    });
    expect(result.userId).toBeUndefined();
  });

  test('listTasks scopes the query by owner and applies pagination', async () => {
    const storedTask = createTask();
    const findQuery = createQuery([storedTask]);
    const TaskModel = {
      find: jest.fn().mockReturnValue(findQuery),
      countDocuments: jest.fn().mockResolvedValue(1),
    };
    const service = new TaskService(TaskModel);

    const result = await service.listTasks(userId, { limit: 10, offset: 5 });

    expect(TaskModel.find).toHaveBeenCalledWith({ userId });
    expect(TaskModel.countDocuments).toHaveBeenCalledWith({ userId });
    expect(findQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(findQuery.skip).toHaveBeenCalledWith(5);
    expect(findQuery.limit).toHaveBeenCalledWith(10);
    expect(result.tasks).toHaveLength(1);
    expect(result.pagination).toEqual({
      limit: 10,
      offset: 5,
      total: 1,
    });
  });

  test('getTaskById includes owner in the lookup filter', async () => {
    const storedTask = createTask();
    const TaskModel = {
      findOne: jest.fn().mockReturnValue(createLeanQuery(storedTask)),
    };
    const service = new TaskService(TaskModel);

    const result = await service.getTaskById(userId, taskId);

    expect(TaskModel.findOne).toHaveBeenCalledWith({ _id: taskId, userId });
    expect(result._id).toBe(taskId);
    expect(result.userId).toBeUndefined();
  });

  test('getTaskById returns 404 when a task is outside the owner scope', async () => {
    const TaskModel = {
      findOne: jest.fn().mockReturnValue(createLeanQuery(null)),
    };
    const service = new TaskService(TaskModel);

    await expect(service.getTaskById(userId, taskId)).rejects.toBeInstanceOf(NotFoundError);
    expect(TaskModel.findOne).toHaveBeenCalledWith({ _id: taskId, userId });
  });

  test('updateTask includes owner in the update filter', async () => {
    const storedTask = createTask({ status: 'Completed' });
    const TaskModel = {
      findOneAndUpdate: jest.fn().mockReturnValue(createLeanQuery(storedTask)),
    };
    const service = new TaskService(TaskModel);

    const result = await service.updateTask(userId, taskId, { status: 'Completed' });

    expect(TaskModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: taskId, userId },
      { $set: { status: 'Completed' } },
      { new: true, runValidators: true },
    );
    expect(result.status).toBe('Completed');
  });

  test('updateTask returns 404 when another user owns the task', async () => {
    const TaskModel = {
      findOneAndUpdate: jest.fn().mockReturnValue(createLeanQuery(null)),
    };
    const service = new TaskService(TaskModel);

    await expect(service.updateTask(userId, taskId, { title: 'Nope' })).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(TaskModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: taskId, userId },
      { $set: { title: 'Nope' } },
      { new: true, runValidators: true },
    );
  });

  test('deleteTask includes owner in the delete filter', async () => {
    const TaskModel = {
      findOneAndDelete: jest.fn().mockReturnValue(createLeanQuery(createTask())),
    };
    const service = new TaskService(TaskModel);

    await service.deleteTask(userId, taskId);

    expect(TaskModel.findOneAndDelete).toHaveBeenCalledWith({ _id: taskId, userId });
  });

  test('deleteTask returns 404 when another user owns the task', async () => {
    const TaskModel = {
      findOneAndDelete: jest.fn().mockReturnValue(createLeanQuery(null)),
    };
    const service = new TaskService(TaskModel);

    await expect(service.deleteTask(userId, taskId)).rejects.toBeInstanceOf(NotFoundError);
    expect(TaskModel.findOneAndDelete).toHaveBeenCalledWith({ _id: taskId, userId });
  });
});
