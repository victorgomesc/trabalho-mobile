import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome deve possuir pelo menos 3 caracteres")
    .max(100, "O nome deve possuir no máximo 100 caracteres"),

  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .max(150, "O e-mail deve possuir no máximo 150 caracteres")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(6, "A senha deve possuir pelo menos 6 caracteres")
    .max(72, "A senha deve possuir no máximo 72 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "A senha é obrigatória"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;