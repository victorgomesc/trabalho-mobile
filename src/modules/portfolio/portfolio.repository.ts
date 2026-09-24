import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database";

import { PortfolioBaseSummary } from "./portfolio.types";

export class PortfolioRepository {
  async getSummaryByUser(
    userId: string,
  ): Promise<PortfolioBaseSummary> {
    const positions =
      await prisma.portfolioPosition.findMany({
        where: {
          userId,
        },
        include: {
          asset: {
            select: {
              currentPrice: true,
            },
          },
        },
      });

    let totalInvested =
      new Prisma.Decimal(0);

    let currentValue =
      new Prisma.Decimal(0);

    for (const position of positions) {
      const invested =
        position.quantity.mul(
          position.averagePrice,
        );

      const current =
        position.quantity.mul(
          position.asset.currentPrice,
        );

      totalInvested =
        totalInvested.add(invested);

      currentValue =
        currentValue.add(current);
    }

    const profitLoss =
      currentValue.sub(totalInvested);

    return {
      totalInvested: Number(
        totalInvested.toFixed(2),
      ),

      currentValue: Number(
        currentValue.toFixed(2),
      ),

      profitLoss: Number(
        profitLoss.toFixed(2),
      ),

      assetCount: positions.length,
    };
  }
}