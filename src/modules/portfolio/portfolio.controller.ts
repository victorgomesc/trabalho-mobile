import { Request, Response } from "express";

import { PortfolioService } from "./portfolio.service";

const portfolioService = new PortfolioService();

export class PortfolioController {
  async summary(
    request: Request,
    response: Response,
  ): Promise<void> {
    if (!request.user) {
      response.status(401).json({
        error: "Usuário não autenticado",
      });

      return;
    }

    const summary =
      await portfolioService.getSummary(
        request.user.id,
      );

    response.status(200).json(summary);
  }
}