import { taskService } from './task.service.js';

export class TaskController {
  constructor(service = taskService) {
    this.service = service;
  }

  create = async (request, response) => {
    const task = await this.service.createTask(request.user._id, request.validated.body);

    response.status(201).json({
      success: true,
      data: {
        task,
      },
    });
  };

  list = async (request, response) => {
    const result = await this.service.listTasks(request.user._id, request.validated.query);

    response.status(200).json({
      success: true,
      data: result,
    });
  };

  getById = async (request, response) => {
    const task = await this.service.getTaskById(request.user._id, request.validated.params.id);

    response.status(200).json({
      success: true,
      data: {
        task,
      },
    });
  };

  update = async (request, response) => {
    const task = await this.service.updateTask(
      request.user._id,
      request.validated.params.id,
      request.validated.body,
    );

    response.status(200).json({
      success: true,
      data: {
        task,
      },
    });
  };

  remove = async (request, response) => {
    await this.service.deleteTask(request.user._id, request.validated.params.id);

    response.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  };
}

export const taskController = new TaskController();
