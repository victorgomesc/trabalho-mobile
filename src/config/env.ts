import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().positive().default(3333),

  DATABASE_URL: z.string().min(1, "DATABASE_URL não foi informada"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET precisa ter pelo menos 32 caracteres"),

  JWT_EXPIRES_IN: z.string().default("1d"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Variáveis de ambiente inválidas:");

  console.error(
    result.error.flatten().fieldErrors,
  );

  process.exit(1);
}

export const env = result.data;