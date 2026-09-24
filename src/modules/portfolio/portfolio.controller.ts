import { Request, Response } from "express";

import { PortfolioService } from "./portfolio.service";

const portfolioService = new PortfolioService();

export interface PortfolioUserParams {
  userId: string;
}

export class PortfolioController {
  async summary(
    request: Request<PortfolioUserParams>,
    response: Response,
  ): Promise<void> {
    const { userId } = request.params;

    const summary =
      await portfolioService.getSummary(userId);

    response.status(200).json(summary);
  }
}