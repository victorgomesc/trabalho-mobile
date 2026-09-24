import { database } from "../../config/database";
import {
  CreatePositionDTO,
  Position,
  PositionWithAsset,
  UpdatePositionDTO,
} from "./positions.types";

export class PositionsRepository {
  async findAllByUser(userId: string): Promise<PositionWithAsset[]> {
    const result = await database.query(
      `
      SELECT
        pc.id,
        pc.usuario_id,
        pc.ativo_id,
        pc.quantidade,
        pc.preco_medio,
        pc.atualizado_em,
        a.codigo,
        a.nome AS ativo_nome,
        a.preco_atual
      FROM posicoes_carteira pc
      INNER JOIN ativos a ON a.id = pc.ativo_id
      WHERE pc.usuario_id = $1
      ORDER BY a.codigo
      `,
      [userId],
    );

    return result.rows;
  }

  async findById(
    id: string,
    userId: string,
  ): Promise<PositionWithAsset | null> {
    const result = await database.query(
      `
      SELECT
        pc.id,
        pc.usuario_id,
        pc.ativo_id,
        pc.quantidade,
        pc.preco_medio,
        pc.atualizado_em,
        a.codigo,
        a.nome AS ativo_nome,
        a.preco_atual
      FROM posicoes_carteira pc
      INNER JOIN ativos a ON a.id = pc.ativo_id
      WHERE pc.id = $1
        AND pc.usuario_id = $2
      `,
      [id, userId],
    );

    return result.rows[0] ?? null;
  }

  async create(
    userId: string,
    data: CreatePositionDTO,
  ): Promise<Position> {
    const result = await database.query(
      `
      INSERT INTO posicoes_carteira (
        usuario_id,
        ativo_id,
        quantidade,
        preco_medio
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [userId, data.ativo_id, data.quantidade, data.preco_medio],
    );

    return result.rows[0];
  }

  async update(
    id: string,
    userId: string,
    data: UpdatePositionDTO,
  ): Promise<Position | null> {
    const result = await database.query(
      `
      UPDATE posicoes_carteira
      SET
        quantidade = COALESCE($1, quantidade),
        preco_medio = COALESCE($2, preco_medio),
        atualizado_em = NOW()
      WHERE id = $3
        AND usuario_id = $4
      RETURNING *
      `,
      [
        data.quantidade ?? null,
        data.preco_medio ?? null,
        id,
        userId,
      ],
    );

    return result.rows[0] ?? null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await database.query(
      `
      DELETE FROM posicoes_carteira
      WHERE id = $1
        AND usuario_id = $2
      `,
      [id, userId],
    );

    return (result.rowCount ?? 0) > 0;
  }

  async assetExists(assetId: string): Promise<boolean> {
    const result = await database.query(
        `
        SELECT 1
        FROM ativos
        WHERE id = $1
        LIMIT 1
        `,
        [assetId],
    );

    return (result.rowCount ?? 0) > 0;
    }

    async findByUserAndAsset(
        userId: string,
        assetId: string,
        ): Promise<Position | null> {
        const result = await database.query(
            `
            SELECT *
            FROM posicoes_carteira
            WHERE usuario_id = $1
            AND ativo_id = $2
            LIMIT 1
            `,
            [userId, assetId],
        );

        return result.rows[0] ?? null;
    }

}