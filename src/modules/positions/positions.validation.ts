import { z } from "zod";

export const positionParamsSchema = z.object({
  id: z.string().uuid("ID da posição inválido"),
});

export const createPositionSchema = z.object({
  assetId: z
    .string()
    .uuid("ID do ativo inválido"),

  quantity: z.coerce
    .number()
    .positive("A quantidade deve ser maior que zero"),

  averagePrice: z.coerce
    .number()
    .positive("O preço médio deve ser maior que zero"),
});

export const updatePositionSchema = z
  .object({
    quantity: z.coerce
      .number()
      .positive("A quantidade deve ser maior que zero")
      .optional(),

    averagePrice: z.coerce
      .number()
      .positive("O preço médio deve ser maior que zero")
      .optional(),
  })
  .refine(
    (data) =>
      data.quantity !== undefined ||
      data.averagePrice !== undefined,
    {
      message:
        "Informe pelo menos um campo para atualização",
    },
  );