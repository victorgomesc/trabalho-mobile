import { Router } from "express";

import { validate } from "../../middlewares/validate";

import {
  PositionParams,
  PositionsController,
  UserParams,
} from "./positions.controller";

import {
  CreatePositionDTO,
  UpdatePositionDTO,
} from "./positions.types";

import {
  createPositionSchema,
  positionParamsSchema,
  updatePositionSchema,
  userParamsSchema,
} from "./positions.validation";

export const positionsRoutes = Router();

const positionsController = new PositionsController();

positionsRoutes.get(
  "/users/:userId/positions",
  validate<UserParams>({
    params: userParamsSchema,
  }),
  positionsController.list.bind(positionsController),
);

positionsRoutes.get(
  "/users/:userId/positions/:id",
  validate<PositionParams>({
    params: positionParamsSchema,
  }),
  positionsController.findById.bind(positionsController),
);

positionsRoutes.post(
  "/users/:userId/positions",
  validate<UserParams, CreatePositionDTO>({
    params: userParamsSchema,
    body: createPositionSchema,
  }),
  positionsController.create.bind(positionsController),
);

positionsRoutes.patch(
  "/users/:userId/positions/:id",
  validate<PositionParams, UpdatePositionDTO>({
    params: positionParamsSchema,
    body: updatePositionSchema,
  }),
  positionsController.update.bind(positionsController),
);

positionsRoutes.delete(
  "/users/:userId/positions/:id",
  validate<PositionParams>({
    params: positionParamsSchema,
  }),
  positionsController.delete.bind(positionsController),
);