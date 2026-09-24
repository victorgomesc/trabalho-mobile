import { z } from "zod";

export const portfolioUserParamsSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
});