import { dashboardService } from './dashboard.service.js';

export class DashboardController {
  constructor(service = dashboardService) {
    this.service = service;
  }

  summary = async (request, response) => {
    const summary = await this.service.getSummary(request.user._id);

    response.status(200).json({
      success: true,
      data: summary,
    });
  };
}

export const dashboardController = new DashboardController();
