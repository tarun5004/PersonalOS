import { habitService } from './habit.service.js';

export class HabitController {
  constructor(service = habitService) {
    this.service = service;
  }

  create = async (request, response) => {
    const habit = await this.service.createHabit(request.user._id, request.validated.body);

    response.status(201).json({
      success: true,
      data: {
        habit,
      },
    });
  };

  list = async (request, response) => {
    const result = await this.service.listHabits(request.user._id, request.validated.query);

    response.status(200).json({
      success: true,
      data: result,
    });
  };

  getById = async (request, response) => {
    const habit = await this.service.getHabitById(
      request.user._id,
      request.validated.params.id,
      request.validated.query,
    );

    response.status(200).json({
      success: true,
      data: {
        habit,
      },
    });
  };

  update = async (request, response) => {
    const habit = await this.service.updateHabit(
      request.user._id,
      request.validated.params.id,
      request.validated.body,
      request.validated.query,
    );

    response.status(200).json({
      success: true,
      data: {
        habit,
      },
    });
  };

  remove = async (request, response) => {
    await this.service.deleteHabit(request.user._id, request.validated.params.id);

    response.status(200).json({
      success: true,
      message: 'Habit deleted successfully',
    });
  };

  checkIn = async (request, response) => {
    const result = await this.service.checkInHabit(request.user._id, request.validated.params.id);

    response.status(201).json({
      success: true,
      data: result,
    });
  };
}

export const habitController = new HabitController();
