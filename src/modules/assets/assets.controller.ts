import { Request, Response } from "express";
import { AssetsService } from "./assets.service";
import { CreateAssetDTO, UpdateAssetDTO } from "./assets.types";

const assetsService = new AssetsService();

export interface AssetParams {
  id: string;
}

export class AssetsController {
  async list(_request: Request, response: Response): Promise<void> {
    const assets = await assetsService.list();
    response.status(200).json(assets);
  }

  async findById(
    request: Request<AssetParams>,
    response: Response,
  ): Promise<void> {
    const { id } = request.params;
    const asset = await assetsService.findById(id);
    response.status(200).json(asset);
  }

  async create(
    request: Request<unknown, unknown, CreateAssetDTO>,
    response: Response,
  ): Promise<void> {
    const asset = await assetsService.create(request.body);
    response.status(201).json(asset);
  }

  async update(
    request: Request<AssetParams, unknown, UpdateAssetDTO>,
    response: Response,
  ): Promise<void> {
    const { id } = request.params;
    const asset = await assetsService.update(id, request.body);
    response.status(200).json(asset);
  }

  async delete(
    request: Request<AssetParams>,
    response: Response,
  ): Promise<void> {
    const { id } = request.params;
    await assetsService.delete(id);
    response.status(204).send();
  }
}