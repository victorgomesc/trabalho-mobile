import { z } from "zod";

export const assetParamsSchema = z.object({
  id: z.string().uuid("ID do ativo inválido"),
});

export const createAssetSchema = z.object({
  ticker: z
    .string()
    .min(1, "Ticker é obrigatório")
    .max(20, "Ticker deve ter no máximo 20 caracteres")
    .transform((val) => val.toUpperCase().trim()),

  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),

  type: z
    .string()
    .min(1, "Tipo é obrigatório")
    .max(30, "Tipo deve ter no máximo 30 caracteres"),

  currentPrice: z.coerce
    .number()
    .positive("O preço atual deve ser maior que zero"),
});

export const updateAssetSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    type: z.string().min(1).max(30).optional(),
    currentPrice: z.coerce.number().positive().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.type !== undefined ||
      data.currentPrice !== undefined,
    {
      message: "Informe pelo menos um campo para atualização",
    },
  );