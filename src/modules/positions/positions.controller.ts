import { Request, Response } from "express";

import { PositionsService } from "./positions.service";

import {
  CreatePositionDTO,
  UpdatePositionDTO,
} from "./positions.types";

const positionsService = new PositionsService();

export interface PositionParams {
  id: string;
}

export class PositionsController {
  async list(
    request: Request,
    response: Response,
  ): Promise<void> {
    if (!request.user) {
      response.status(401).json({
        error: "Usuário não autenticado",
      });

      return;
    }

    const positions = await positionsService.list(
      request.user.id,
    );

    response.status(200).json(positions);
  }

  async findById(
    request: Request<PositionParams>,
    response: Response,
  ): Promise<void> {
    if (!request.user) {
      response.status(401).json({
        error: "Usuário não autenticado",
      });

      return;
    }

    const { id } = request.params;

    const position = await positionsService.findById(
      id,
      request.user.id,
    );

    response.status(200).json(position);
  }

  async create(
    request: Request<
      Record<string, string>,
      unknown,
      CreatePositionDTO
    >,
    response: Response,
  ): Promise<void> {
    if (!request.user) {
      response.status(401).json({
        error: "Usuário não autenticado",
      });

      return;
    }

    const position = await positionsService.create(
      request.user.id,
      request.body,
    );

    response.status(201).json(position);
  }

  async update(
    request: Request<
      PositionParams,
      unknown,
      UpdatePositionDTO
    >,
    response: Response,
  ): Promise<void> {
    if (!request.user) {
      response.status(401).json({
        error: "Usuário não autenticado",
      });

      return;
    }

    const { id } = request.params;

    const position = await positionsService.update(
      id,
      request.user.id,
      request.body,
    );

    response.status(200).json(position);
  }

  async delete(
    request: Request<PositionParams>,
    response: Response,
  ): Promise<void> {
    if (!request.user) {
      response.status(401).json({
        error: "Usuário não autenticado",
      });

      return;
    }

    const { id } = request.params;

    await positionsService.delete(
      id,
      request.user.id,
    );

    response.status(204).send();
  }
}