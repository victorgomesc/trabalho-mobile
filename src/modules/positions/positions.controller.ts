import { Request, Response } from "express";
import { PositionsService } from "./positions.service";
import {
  CreatePositionDTO,
  UpdatePositionDTO,
} from "./positions.types";

const positionsService = new PositionsService();

interface UserParams {
  userId: string;
}

interface PositionParams {
  userId: string;
  id: string;
}

export class PositionsController {
  async list(
    request: Request<UserParams>,
    response: Response,
  ) {
    const { userId } = request.params;

    const positions = await positionsService.list(userId);

    return response.status(200).json(positions);
  }

  async findById(
    request: Request<PositionParams>,
    response: Response,
  ) {
    const { userId, id } = request.params;

    const position = await positionsService.findById(
      id,
      userId,
    );

    return response.status(200).json(position);
  }

  async create(
    request: Request<UserParams, {}, CreatePositionDTO>,
    response: Response,
  ) {
    const { userId } = request.params;

    const position = await positionsService.create(
      userId,
      request.body,
    );

    return response.status(201).json(position);
  }

  async update(
    request: Request<
      PositionParams,
      {},
      UpdatePositionDTO
    >,
    response: Response,
  ) {
    const { userId, id } = request.params;

    const position = await positionsService.update(
      id,
      userId,
      request.body,
    );

    return response.status(200).json(position);
  }

  async delete(
    request: Request<PositionParams>,
    response: Response,
  ) {
    const { userId, id } = request.params;

    await positionsService.delete(id, userId);

    return response.status(204).send();
  }
}