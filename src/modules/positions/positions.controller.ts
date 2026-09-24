import { Request, Response } from "express";

import { PositionsService } from "./positions.service";
import {
  CreatePositionDTO,
  UpdatePositionDTO,
} from "./positions.types";

const positionsService = new PositionsService();

export interface UserParams {
  userId: string;
}

export interface PositionParams {
  userId: string;
  id: string;
}

export class PositionsController {
  async list(
    request: Request<UserParams>,
    response: Response,
  ): Promise<void> {
    const { userId } = request.params;

    const positions = await positionsService.list(userId);

    response.status(200).json(positions);
  }

  async findById(
    request: Request<PositionParams>,
    response: Response,
  ): Promise<void> {
    const { userId, id } = request.params;

    const position = await positionsService.findById(
      id,
      userId,
    );

    response.status(200).json(position);
  }

  async create(
    request: Request<UserParams, unknown, CreatePositionDTO>,
    response: Response,
  ): Promise<void> {
    const { userId } = request.params;

    const position = await positionsService.create(
      userId,
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
    const { userId, id } = request.params;

    const position = await positionsService.update(
      id,
      userId,
      request.body,
    );

    response.status(200).json(position);
  }

  async delete(
    request: Request<PositionParams>,
    response: Response,
  ): Promise<void> {
    const { userId, id } = request.params;

    await positionsService.delete(id, userId);

    response.status(204).send();
  }
}