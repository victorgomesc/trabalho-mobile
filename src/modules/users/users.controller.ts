import { Request, Response } from "express";

import { UsersService, UsersServiceError } from "./users.service";

const usersService = new UsersService();

export class UsersController {
  async me(request: Request, response: Response): Promise<void> {
    if (!request.user) {
      response.status(401).json({
        error: "Usuário não autenticado",
      });
      return;
    }

    try {
      const user = await usersService.getProfile(request.user.id);

      response.status(200).json({ user });
    } catch (error) {
      this.handleError(error, response);
    }
  }

  async updateMe(request: Request, response: Response): Promise<void> {
    if (!request.user) {
      response.status(401).json({
        error: "Usuário não autenticado",
      });
      return;
    }

    const body: unknown = request.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      response.status(400).json({
        error: "Envie um objeto JSON com name ou email",
      });
      return;
    }

    const fields = body as Record<string, unknown>;
    const data: { name?: string; email?: string } = {};

    if (Object.keys(fields).some((key) => key !== "name" && key !== "email")) {
      response.status(400).json({
        error: "Os únicos campos permitidos são name e email",
      });
      return;
    }

    if ("name" in fields) {
      if (
        typeof fields.name !== "string" ||
        fields.name.trim().length < 2
      ) {
        response.status(400).json({
          error: "O nome deve possuir pelo menos 2 caracteres",
        });
        return;
      }

      data.name = fields.name.trim();
    }

    if ("email" in fields) {
      if (
        typeof fields.email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())
      ) {
        response.status(400).json({
          error: "Informe um e-mail válido",
        });
        return;
      }

      data.email = fields.email.trim().toLowerCase();
    }

    if (Object.keys(data).length === 0) {
      response.status(400).json({
        error: "Informe name ou email para atualizar",
      });
      return;
    }

    try {
      const user = await usersService.updateProfile(
        request.user.id,
        data,
      );

      response.status(200).json({
        message: "Usuário atualizado com sucesso",
        user,
      });
    } catch (error) {
      this.handleError(error, response);
    }
  }

  async deleteMe(request: Request, response: Response): Promise<void> {
  if (!request.user) {
    response.status(401).json({
      error: "Usuário não autenticado",
    });
    return;
  }

  try {
    await usersService.deleteProfile(request.user.id);

    response.status(204).send();
  } catch (error) {
    this.handleError(error, response);
  }
}

  private handleError(error: unknown, response: Response): void {
    if (error instanceof UsersServiceError) {
      response.status(error.statusCode).json({
        error: error.message,
      });
      return;
    }

    console.error("Erro ao processar usuário:", error);

    response.status(500).json({
      error: "Erro interno ao processar usuário",
    });
  }
}