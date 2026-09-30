import { Request, Response } from "express";

import { PositionsService } from "./positions.service";
import {
  CreatePositionDTO,
  UpdatePositionDTO,
} from "./positions.types";

import { TransactionsError } from "../transactions/transactions.errors";

const positionsService = new PositionsService();

export interface PositionParams {
  id: string;
}

export class PositionsController {
  private async execute(
    response: Response,
    userId: string | undefined,
    statusCode: number,
    operation: (id: string) => Promise<unknown>,
  ): Promise<void> {
    if (!userId) {
      response.status(401).json({
        error: "Usuário não autenticado",
      });
      return;
    }

    try {
      const result = await operation(userId);

      if (statusCode === 204) {
        response.status(204).send();
        return;
      }

      response.status(statusCode).json(result);
    } catch (error) {
      if (error instanceof TransactionsError) {
        if (error.statusCode === 405) {
          response.setHeader("Allow", "GET");
        }

        response.status(error.statusCode).json({
          error: error.message,
        });
        return;
      }

      console.error("Erro ao processar posição:", error);

      response.status(500).json({
        error: "Erro interno ao processar posição",
      });
    }
  }

  async list(
    request: Request,
    response: Response,
  ): Promise<void> {
    await this.execute(
      response,
      request.user?.id,
      200,
      (userId) => positionsService.list(userId),
    );
  }

  async findById(
    request: Request<PositionParams>,
    response: Response,
  ): Promise<void> {
    await this.execute(
      response,
      request.user?.id,
      200,
      (userId) =>
        positionsService.findById(request.params.id, userId),
    );
  }

  async create(
    request: Request<
      Record<string, string>,
      unknown,
      CreatePositionDTO
    >,
    response: Response,
  ): Promise<void> {
    await this.execute(
      response,
      request.user?.id,
      201,
      (userId) =>
        positionsService.create(userId, request.body),
    );
  }

  async update(
    request: Request<
      PositionParams,
      unknown,
      UpdatePositionDTO
    >,
    response: Response,
  ): Promise<void> {
    await this.execute(
      response,
      request.user?.id,
      200,
      (userId) =>
        positionsService.update(
          request.params.id,
          userId,
          request.body,
        ),
    );
  }

  async delete(
    request: Request<PositionParams>,
    response: Response,
  ): Promise<void> {
    await this.execute(
      response,
      request.user?.id,
      204,
      (userId) =>
        positionsService.delete(request.params.id, userId),
    );
  }
}