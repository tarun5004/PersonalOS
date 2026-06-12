import { analyticsService } from './analytics.service.js';

export class AnalyticsController {
  constructor(service = analyticsService) {
    this.service = service;
  }

  weekly = async (request, response) => {
    const result = await this.service.getWeeklyAnalytics(request.user._id);

    response.status(200).json({
      success: true,
      data: result,
    });
  };
}

export const analyticsController = new AnalyticsController();
