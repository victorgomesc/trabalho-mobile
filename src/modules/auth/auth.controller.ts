import { Request, Response } from "express";

import {
  LoginInput,
  RegisterInput,
} from "./auth.schema";

import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
  async register(
    request: Request<
      Record<string, string>,
      unknown,
      RegisterInput
    >,
    response: Response,
  ): Promise<void> {
    const user = await authService.register(
      request.body,
    );

    response.status(201).json({
      message: "Usuário cadastrado com sucesso",
      user,
    });
  }

  async login(
    request: Request<
      Record<string, string>,
      unknown,
      LoginInput
    >,
    response: Response,
  ): Promise<void> {
    const result = await authService.login(
      request.body,
    );

    response.status(200).json({
      message: "Login realizado com sucesso",
      ...result,
    });
  }
}