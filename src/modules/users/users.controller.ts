import { Request, Response } from "express";

import { UsersService } from "./users.service";

const usersService = new UsersService();

export class UsersController {
  async me(
    request: Request,
    response: Response,
  ): Promise<void> {
    if (!request.user) {
      response.status(401).json({
        error: "Usuário não autenticado",
      });

      return;
    }

    const user = await usersService.getProfile(
      request.user.id,
    );

    response.status(200).json({
      user,
    });
  }
}