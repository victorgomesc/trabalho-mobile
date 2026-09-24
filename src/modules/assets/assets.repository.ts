import { Asset as PrismaAsset } from "@prisma/client";
import { prisma } from "../../config/database";
import { Asset, CreateAssetDTO, UpdateAssetDTO } from "./assets.types";

export class AssetsRepository {
  private mapAsset(asset: PrismaAsset): Asset {
    return {
      id: asset.id,
      ticker: asset.ticker,
      name: asset.name,
      type: asset.type,
      currentPrice: Number(asset.currentPrice),
      updatedAt: asset.updatedAt,
    };
  }

  async findAll(): Promise<Asset[]> {
    const assets = await prisma.asset.findMany({
      orderBy: { ticker: "asc" },
    });
    return assets.map(this.mapAsset);
  }

  async findById(id: string): Promise<Asset | null> {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) return null;
    return this.mapAsset(asset);
  }

  async findByTicker(ticker: string): Promise<Asset | null> {
    const asset = await prisma.asset.findUnique({ where: { ticker } });
    if (!asset) return null;
    return this.mapAsset(asset);
  }

  async create(data: CreateAssetDTO): Promise<Asset> {
    const asset = await prisma.asset.create({
      data: {
        ticker: data.ticker,
        name: data.name,
        type: data.type,
        currentPrice: data.currentPrice,
      },
    });
    return this.mapAsset(asset);
  }

  async update(id: string, data: UpdateAssetDTO): Promise<Asset | null> {
    try {
      const asset = await prisma.asset.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.type && { type: data.type }),
          ...(data.currentPrice !== undefined && { currentPrice: data.currentPrice }),
        },
      });
      return this.mapAsset(asset);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.asset.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}