export interface Position {
  id: string;
  usuario_id: string;
  ativo_id: string;
  quantidade: number;
  preco_medio: number;
  atualizado_em: Date;
}

export interface CreatePositionDTO {
  ativo_id: string;
  quantidade: number;
  preco_medio: number;
}

export interface UpdatePositionDTO {
  quantidade?: number;
  preco_medio?: number;
}

export interface PositionWithAsset extends Position {
  codigo: string;
  ativo_nome: string;
  preco_atual: number;
}