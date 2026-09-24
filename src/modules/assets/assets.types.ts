export interface Asset {
  id: string;
  ticker: string;
  name: string;
  type: string;
  currentPrice: number;
  updatedAt: Date;
}

export interface CreateAssetDTO {
  ticker: string;
  name: string;
  type: string;
  currentPrice: number;
}

export interface UpdateAssetDTO {
  name?: string;
  type?: string;
  currentPrice?: number;
}