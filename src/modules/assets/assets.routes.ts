import { Router } from "express";
import { validate } from "../../middlewares/validate";
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
  validate<unknown, CreateAssetDTO>({ body: createAssetSchema }),
  assetsController.create.bind(assetsController),
);

assetsRoutes.patch(
  "/:id",
  validate<AssetParams, UpdateAssetDTO>({
    params: assetParamsSchema,
    body: updateAssetSchema,
  }),
  assetsController.update.bind(assetsController),
);

assetsRoutes.delete(
  "/:id",
  validate<AssetParams>({ params: assetParamsSchema }),
  assetsController.delete.bind(assetsController),
);