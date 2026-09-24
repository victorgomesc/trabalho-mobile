import { Router } from "express";
import { PositionsController } from "./positions.controller";

export const positionsRoutes = Router();

const positionsController = new PositionsController();

positionsRoutes.get(
  "/users/:userId/positions",
  positionsController.list.bind(positionsController),
);

positionsRoutes.get(
  "/users/:userId/positions/:id",
  positionsController.findById.bind(positionsController),
);

positionsRoutes.post(
  "/users/:userId/positions",
  positionsController.create.bind(positionsController),
);

positionsRoutes.patch(
  "/users/:userId/positions/:id",
  positionsController.update.bind(positionsController),
);

positionsRoutes.delete(
  "/users/:userId/positions/:id",
  positionsController.delete.bind(positionsController),
);