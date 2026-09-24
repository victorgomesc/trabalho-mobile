import { database } from "../../config/database";

import {
  PortfolioSummary,
  RawPortfolioSummary,
} from "./portfolio.types";

export class PortfolioRepository {
  async getSummaryByUser(
    userId: string,
  ): Promise<Omit<PortfolioSummary, "rentabilidade">> {
    const result = await database.query<RawPortfolioSummary>(
      `
      SELECT
        COALESCE(
          SUM(pc.quantidade * pc.preco_medio),
          0
        ) AS total_investido,

        COALESCE(
          SUM(pc.quantidade * a.preco_atual),
          0
        ) AS valor_atual,

        COALESCE(
          SUM(
            pc.quantidade *
            (a.preco_atual - pc.preco_medio)
          ),
          0
        ) AS lucro_prejuizo,

        COUNT(pc.id)::int AS quantidade_ativos
      FROM posicoes_carteira pc
      INNER JOIN ativos a
        ON a.id = pc.ativo_id
      WHERE pc.usuario_id = $1
      `,
      [userId],
    );

    const summary = result.rows[0];

    return {
      total_investido: Number(summary.total_investido),
      valor_atual: Number(summary.valor_atual),
      lucro_prejuizo: Number(summary.lucro_prejuizo),
      quantidade_ativos: summary.quantidade_ativos,
    };
  }
}