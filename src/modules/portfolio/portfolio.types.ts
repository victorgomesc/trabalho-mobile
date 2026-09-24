export interface PortfolioSummary {
  total_investido: number;
  valor_atual: number;
  lucro_prejuizo: number;
  rentabilidade: number;
  quantidade_ativos: number;
}

export interface RawPortfolioSummary {
  total_investido: string;
  valor_atual: string;
  lucro_prejuizo: string;
  quantidade_ativos: number;
}