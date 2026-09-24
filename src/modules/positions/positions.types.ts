export interface Position {
  id: string;
  userId: string;
  assetId: string;
  quantity: number;
  averagePrice: number;
  updatedAt: Date;
}

export interface CreatePositionDTO {
  assetId: string;
  quantity: number;
  averagePrice: number;
}

export interface UpdatePositionDTO {
  quantity?: number;
  averagePrice?: number;
}

export interface PositionWithAsset extends Position {
  ticker: string;
  assetName: string;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  profitLoss: number;
}