import { Router } from "express";

import { validate } from "../../middlewares/validate";

import { AuthController } from "./auth.controller";

import {
  LoginInput,
  RegisterInput,
  loginSchema,
  registerSchema,
} from "./auth.schema";

export const authRoutes = Router();

const authController = new AuthController();

authRoutes.post(
  "/register",
  validate<Record<string, string>, RegisterInput>({
    body: registerSchema,
  }),
  authController.register.bind(authController),
);

authRoutes.post(
  "/login",
  validate<Record<string, string>, LoginInput>({
    body: loginSchema,
  }),
  authController.login.bind(authController),
);