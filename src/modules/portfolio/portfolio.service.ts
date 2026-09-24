import { PortfolioRepository } from "./portfolio.repository";
import { PortfolioSummary } from "./portfolio.types";

export class PortfolioService {
  private portfolioRepository: PortfolioRepository;

  constructor() {
    this.portfolioRepository =
      new PortfolioRepository();
  }

  async getSummary(
    userId: string,
  ): Promise<PortfolioSummary> {
    const summary =
      await this.portfolioRepository
        .getSummaryByUser(userId);

    const returnPercentage =
      summary.totalInvested > 0
        ? (
            summary.profitLoss /
            summary.totalInvested
          ) * 100
        : 0;

    return {
      ...summary,

      returnPercentage: Number(
        returnPercentage.toFixed(2),
      ),
    };
  }
}