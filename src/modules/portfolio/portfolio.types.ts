export interface PortfolioBaseSummary {
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  assetCount: number;
}

export interface PortfolioSummary
  extends PortfolioBaseSummary {
  returnPercentage: number;
}