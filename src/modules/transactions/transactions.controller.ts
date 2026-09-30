import { Request, Response } from "express";

import { TransactionsError } from "./transactions.errors";
import { TransactionsService } from "./transactions.service";

const transactionsService = new TransactionsService();

export class TransactionsController {
  private async execute(
    request: Request,
    response: Response,
    statusCode: number,
    operation: (userId: string) => Promise<unknown>,
  ): Promise<void> {
    if (!request.user) {
      response.status(401).json({
        error: "Usuário não autenticado",
      });
      return;
    }

    try {
      const result = await operation(request.user.id);

      response.status(statusCode).json(result);
    } catch (error) {
      if (error instanceof TransactionsError) {
        response.status(error.statusCode).json({
          error: error.message,
        });
        return;
      }

      console.error("Erro ao processar transação:", error);

      response.status(500).json({
        error: "Erro interno ao processar transação",
      });
    }
  }

  async balance(
    request: Request,
    response: Response,
  ): Promise<void> {
    await this.execute(request, response, 200, (userId) =>
      transactionsService.getBalance(userId),
    );
  }

  async list(
    request: Request,
    response: Response,
  ): Promise<void> {
    await this.execute(request, response, 200, (userId) =>
      transactionsService.list(userId),
    );
  }

  async deposit(
    request: Request,
    response: Response,
  ): Promise<void> {
    await this.execute(request, response, 201, (userId) =>
      transactionsService.deposit(userId, request.body),
    );
  }

  async withdraw(
    request: Request,
    response: Response,
  ): Promise<void> {
    await this.execute(request, response, 201, (userId) =>
      transactionsService.withdraw(userId, request.body),
    );
  }
}