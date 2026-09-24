import {
  Asset,
  PortfolioPosition,
} from "@prisma/client";

import { prisma } from "../../config/database";

import {
  CreatePositionDTO,
  Position,
  PositionWithAsset,
  UpdatePositionDTO,
} from "./positions.types";

type PositionWithAssetRow = PortfolioPosition & {
  asset: Asset;
};

export class PositionsRepository {
  private mapPosition(
    position: PortfolioPosition,
  ): Position {
    return {
      id: position.id,
      userId: position.userId,
      assetId: position.assetId,
      quantity: Number(position.quantity),
      averagePrice: Number(position.averagePrice),
      updatedAt: position.updatedAt,
    };
  }

  private mapPositionWithAsset(
    position: PositionWithAssetRow,
  ): PositionWithAsset {
    const quantity = Number(position.quantity);
    const averagePrice = Number(position.averagePrice);
    const currentPrice = Number(position.asset.currentPrice);

    const investedValue = quantity * averagePrice;
    const currentValue = quantity * currentPrice;

    return {
      id: position.id,
      userId: position.userId,
      assetId: position.assetId,
      quantity,
      averagePrice,
      updatedAt: position.updatedAt,

      ticker: position.asset.ticker,
      assetName: position.asset.name,
      currentPrice,

      investedValue: Number(investedValue.toFixed(2)),
      currentValue: Number(currentValue.toFixed(2)),
      profitLoss: Number(
        (currentValue - investedValue).toFixed(2),
      ),
    };
  }

  async findAllByUser(
    userId: string,
  ): Promise<PositionWithAsset[]> {
    const positions =
      await prisma.portfolioPosition.findMany({
        where: {
          userId,
        },
        include: {
          asset: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

    return positions.map((position) =>
      this.mapPositionWithAsset(position),
    );
  }

  async findById(
    id: string,
    userId: string,
  ): Promise<PositionWithAsset | null> {
    const position =
      await prisma.portfolioPosition.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          asset: true,
        },
      });

    if (!position) {
      return null;
    }

    return this.mapPositionWithAsset(position);
  }

  async assetExists(
    assetId: string,
  ): Promise<boolean> {
    const asset = await prisma.asset.findUnique({
      where: {
        id: assetId,
      },
      select: {
        id: true,
      },
    });

    return asset !== null;
  }

  async findByUserAndAsset(
    userId: string,
    assetId: string,
  ): Promise<Position | null> {
    const position =
      await prisma.portfolioPosition.findFirst({
        where: {
          userId,
          assetId,
        },
      });

    if (!position) {
      return null;
    }

    return this.mapPosition(position);
  }

  async create(
    userId: string,
    data: CreatePositionDTO,
  ): Promise<Position> {
    const position =
      await prisma.portfolioPosition.create({
        data: {
          userId,
          assetId: data.assetId,
          quantity: data.quantity,
          averagePrice: data.averagePrice,
        },
      });

    return this.mapPosition(position);
  }

  async update(
    id: string,
    userId: string,
    data: UpdatePositionDTO,
  ): Promise<Position | null> {
    const result =
      await prisma.portfolioPosition.updateMany({
        where: {
          id,
          userId,
        },
        data: {
          ...(data.quantity !== undefined && {
            quantity: data.quantity,
          }),

          ...(data.averagePrice !== undefined && {
            averagePrice: data.averagePrice,
          }),
        },
      });

    if (result.count === 0) {
      return null;
    }

    const position =
      await prisma.portfolioPosition.findUnique({
        where: {
          id,
        },
      });

    if (!position) {
      return null;
    }

    return this.mapPosition(position);
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<boolean> {
    const result =
      await prisma.portfolioPosition.deleteMany({
        where: {
          id,
          userId,
        },
      });

    return result.count > 0;
  }
}