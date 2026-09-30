import { PositionsRepository } from "./positions.repository";

import {
  CreatePositionDTO,
  UpdatePositionDTO,
} from "./positions.types";

import { TransactionsError } from "../transactions/transactions.errors";
import { TransactionsService } from "../transactions/transactions.service";

export class PositionsService {
  private readonly positionsRepository =
    new PositionsRepository();

  private readonly transactionsService =
    new TransactionsService();

  async list(userId: string) {
    await this.transactionsService.getBalance(userId);

    return this.positionsRepository.findAllByUser(userId);
  }

  async findById(id: string, userId: string) {
    await this.transactionsService.getBalance(userId);

    const position = await this.positionsRepository.findById(
      id,
      userId,
    );

    if (!position) {
      throw new TransactionsError("Posição não encontrada", 404);
    }

    return position;
  }

  async create(userId: string, data: CreatePositionDTO) {
    return this.transactionsService.buy(userId, data);
  }

  async update(
    _id: string,
    _userId: string,
    _data: UpdatePositionDTO,
  ): Promise<never> {
    throw new TransactionsError(
      "Alteração direta de posições desabilitada. Use operações de compra",
      405,
    );
  }

  async delete(
    _id: string,
    _userId: string,
  ): Promise<never> {
    throw new TransactionsError(
      "Exclusão direta de posições desabilitada. A venda ainda não foi implementada",
      405,
    );
  }
}