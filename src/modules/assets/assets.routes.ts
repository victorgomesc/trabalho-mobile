import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { auth } from "../../middlewares/auth";
import { ensureAdmin } from "../../middlewares/ensureAdmin";
import { AssetParams, AssetsController } from "./assets.controller";
import {
  assetParamsSchema,
  createAssetSchema,
  updateAssetSchema,
} from "./assets.schema";
import { CreateAssetDTO, UpdateAssetDTO } from "./assets.types";

export const assetsRoutes = Router();
const assetsController = new AssetsController();

assetsRoutes.get("/", assetsController.list.bind(assetsController));

assetsRoutes.get(
  "/:id",
  validate<AssetParams>({ params: assetParamsSchema }),
  assetsController.findById.bind(assetsController),
);

assetsRoutes.post(
  "/",
  auth,
  ensureAdmin,
  validate<unknown, CreateAssetDTO>({ body: createAssetSchema }),
  assetsController.create.bind(assetsController),
);

assetsRoutes.patch(
  "/:id",
  auth,
  ensureAdmin,
  validate<AssetParams, UpdateAssetDTO>({
    params: assetParamsSchema,
    body: updateAssetSchema,
  }),
  assetsController.update.bind(assetsController),
);

assetsRoutes.delete(
  "/:id",
  auth,
  ensureAdmin,
  validate<AssetParams>({ params: assetParamsSchema }),
  assetsController.delete.bind(assetsController),
);