import { z } from "zod";

export const userParamsSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
});

export const positionParamsSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
  id: z.string().uuid("ID da posição inválido"),
});

export const createPositionSchema = z.object({
  ativo_id: z.string().uuid("ID do ativo inválido"),

  quantidade: z.coerce
    .number()
    .positive("A quantidade deve ser maior que zero"),

  preco_medio: z.coerce
    .number()
    .positive("O preço médio deve ser maior que zero"),
});

export const updatePositionSchema = z
  .object({
    quantidade: z.coerce
      .number()
      .positive("A quantidade deve ser maior que zero")
      .optional(),

    preco_medio: z.coerce
      .number()
      .positive("O preço médio deve ser maior que zero")
      .optional(),
  })
  .refine(
    (data) =>
      data.quantidade !== undefined ||
      data.preco_medio !== undefined,
    {
      message: "Informe pelo menos um campo para atualização",
    },
  );