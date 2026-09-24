import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";

import {
  PositionParams,
  PositionsController,
} from "./positions.controller";

import {
  CreatePositionDTO,
  UpdatePositionDTO,
} from "./positions.types";

import {
  createPositionSchema,
  positionParamsSchema,
  updatePositionSchema,
} from "./positions.validation";

export const positionsRoutes = Router();

const positionsController = new PositionsController();

positionsRoutes.get(
  "/",
  auth,
  positionsController.list.bind(positionsController),
);

positionsRoutes.get<PositionParams>(
  "/:id",
  auth,
  validate<PositionParams>({
    params: positionParamsSchema,
  }),
  positionsController.findById.bind(
    positionsController,
  ),
);

positionsRoutes.post<
  Record<string, string>,
  unknown,
  CreatePositionDTO
>(
  "/",
  auth,
  validate<
    Record<string, string>,
    CreatePositionDTO
  >({
    body: createPositionSchema,
  }),
  positionsController.create.bind(
    positionsController,
  ),
);

positionsRoutes.patch<
  PositionParams,
  unknown,
  UpdatePositionDTO
>(
  "/:id",
  auth,
  validate<
    PositionParams,
    UpdatePositionDTO
  >({
    params: positionParamsSchema,
    body: updatePositionSchema,
  }),
  positionsController.update.bind(
    positionsController,
  ),
);

positionsRoutes.delete<PositionParams>(
  "/:id",
  auth,
  validate<PositionParams>({
    params: positionParamsSchema,
  }),
  positionsController.delete.bind(
    positionsController,
  ),
);