import { NotFoundError } from '../../errors/AppError.js';
import { Task } from './task.model.js';

function toTaskResponse(task) {
  const source = typeof task.toObject === 'function' ? task.toObject() : task;

  return {
    _id: source._id.toString(),
    title: source.title,
    description: source.description || '',
    priority: source.priority,
    dueDate: source.dueDate,
    status: source.status,
    estimatedMinutes: source.estimatedMinutes ?? null,
    tags: source.tags || [],
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class TaskService {
  constructor(TaskModel = Task) {
    this.TaskModel = TaskModel;
  }

  async createTask(userId, taskInput) {
    const task = await this.TaskModel.create({
      ...taskInput,
      userId,
    });

    return toTaskResponse(task);
  }

  async listTasks(userId, { limit = 50, offset = 0, status, priority, search } = {}) {
    const filter = { userId };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.title = { $regex: escapeRegex(search), $options: 'i' };
    }

    const [tasks, total] = await Promise.all([
      this.TaskModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      this.TaskModel.countDocuments(filter),
    ]);

    return {
      tasks: tasks.map(toTaskResponse),
      pagination: {
        limit,
        offset,
        total,
      },
    };
  }

  async getTaskById(userId, taskId) {
    const task = await this.TaskModel.findOne({ _id: taskId, userId }).lean();

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return toTaskResponse(task);
  }

  async updateTask(userId, taskId, updates) {
    const task = await this.TaskModel.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return toTaskResponse(task);
  }

  async deleteTask(userId, taskId) {
    const task = await this.TaskModel.findOneAndDelete({ _id: taskId, userId }).lean();

    if (!task) {
      throw new NotFoundError('Task not found');
    }
  }
}

export const taskService = new TaskService();
