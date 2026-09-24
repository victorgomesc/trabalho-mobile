import { PositionsRepository } from "./positions.repository";
import {
  CreatePositionDTO,
  UpdatePositionDTO,
} from "./positions.types";

export class PositionsService {
  private positionsRepository: PositionsRepository;

  constructor() {
    this.positionsRepository = new PositionsRepository();
  }

  async list(userId: string) {
    return this.positionsRepository.findAllByUser(userId);
  }

  async findById(id: string, userId: string) {
    const position =
      await this.positionsRepository.findById(id, userId);

    if (!position) {
      throw new Error("Posição não encontrada");
    }

    return position;
  }

  async create(
    userId: string,
    data: CreatePositionDTO,
  ) {
    const assetExists =
      await this.positionsRepository.assetExists(
        data.ativo_id,
      );

    if (!assetExists) {
      throw new Error("Ativo não encontrado");
    }

    const existingPosition =
      await this.positionsRepository.findByUserAndAsset(
        userId,
        data.ativo_id,
      );

    if (existingPosition) {
      throw new Error(
        "O usuário já possui uma posição para este ativo",
      );
    }

    return this.positionsRepository.create(userId, data);
  }

  async update(
    id: string,
    userId: string,
    data: UpdatePositionDTO,
  ) {
    const position =
      await this.positionsRepository.update(
        id,
        userId,
        data,
      );

    if (!position) {
      throw new Error("Posição não encontrada");
    }

    return position;
  }

  async delete(id: string, userId: string) {
    const deleted =
      await this.positionsRepository.delete(
        id,
        userId,
      );

    if (!deleted) {
      throw new Error("Posição não encontrada");
    }
  }
}