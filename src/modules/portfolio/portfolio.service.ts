import { PortfolioRepository } from "./portfolio.repository";
import { PortfolioSummary } from "./portfolio.types";

export class PortfolioService {
  private portfolioRepository: PortfolioRepository;

  constructor() {
    this.portfolioRepository = new PortfolioRepository();
  }

  async getSummary(
    userId: string,
  ): Promise<PortfolioSummary> {
    const summary =
      await this.portfolioRepository.getSummaryByUser(userId);

    const rentabilidade =
      summary.total_investido > 0
        ? (summary.lucro_prejuizo /
            summary.total_investido) *
          100
        : 0;

    return {
      ...summary,
      rentabilidade: Number(rentabilidade.toFixed(2)),
    };
  }
}