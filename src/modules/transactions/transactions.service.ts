import { Prisma, Transaction } from "@prisma/client";

import { TransactionsRepository } from "./transactions.repository";
import { TransactionsError } from "./transactions.errors";

const MAX_MONEY = new Prisma.Decimal("9999999999999.99");
const MAX_QUANTITY = new Prisma.Decimal("99999999999.9999");

export class TransactionsService {
  private readonly repository = new TransactionsRepository();

  private body(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new TransactionsError("Envie um objeto JSON válido", 400);
    }

    return value as Record<string, unknown>;
  }

  private decimal(
    value: unknown,
    field: string,
    decimalPlaces: number,
    maximum: Prisma.Decimal,
  ): Prisma.Decimal {
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value <= 0
    ) {
      throw new TransactionsError(
        `${field} deve ser um número maior que zero`,
        400,
      );
    }

    const result = new Prisma.Decimal(value.toString());

    if (
      result.decimalPlaces() > decimalPlaces ||
      result.greaterThan(maximum)
    ) {
      throw new TransactionsError(
        `${field} excede o limite ou possui mais de ${decimalPlaces} casas decimais`,
        400,
      );
    }

    return result;
  }

  private async requireUser(
    tx: Prisma.TransactionClient,
    userId: string,
  ) {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!user) {
      throw new TransactionsError(
        "Usuário não existe mais. Faça login com uma conta válida",
        401,
      );
    }

    return user;
  }

  private mapTransaction(transaction: Transaction) {
    return {
      id: transaction.id,
      userId: transaction.userId,
      assetId: transaction.assetId,
      type: transaction.type,
      quantity: transaction.quantity.toString(),
      unitPrice: transaction.unitPrice.toFixed(2),
      totalAmount: transaction.totalAmount.toFixed(2),
      createdAt: transaction.createdAt,
    };
  }

  async getBalance(userId: string) {
    return this.repository.execute(async (tx) => {
      const user = await this.requireUser(tx, userId);

      return {
        balance: user.balance.toFixed(2),
      };
    });
  }

  async list(userId: string) {
    return this.repository.execute(async (tx) => {
      await this.requireUser(tx, userId);

      const transactions = await tx.transaction.findMany({
        where: { userId },
        orderBy: [
          { createdAt: "desc" },
          { id: "desc" },
        ],
        take: 100,
      });

      return transactions.map((item) =>
        this.mapTransaction(item),
      );
    });
  }

  async deposit(userId: string, input: unknown) {
    const data = this.body(input);
    const amount = this.decimal(
      data.amount,
      "amount",
      2,
      MAX_MONEY,
    );

    return this.repository.execute(async (tx) => {
      const currentUser = await this.requireUser(tx, userId);

      if (currentUser.balance.plus(amount).greaterThan(MAX_MONEY)) {
        throw new TransactionsError(
          "O depósito ultrapassa o limite de saldo",
          400,
        );
      }

      const user = await tx.user.update({
        where: { id: userId },
        data: {
          balance: {
            increment: amount,
          },
        },
        select: {
          balance: true,
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: "DEPOSIT",
          quantity: 0,
          unitPrice: 0,
          totalAmount: amount,
        },
      });

      return {
        balance: user.balance.toFixed(2),
        transaction: this.mapTransaction(transaction),
      };
    });
  }

  async withdraw(userId: string, input: unknown) {
    const data = this.body(input);
    const amount = this.decimal(
      data.amount,
      "amount",
      2,
      MAX_MONEY,
    );

    return this.repository.execute(async (tx) => {
      await this.requireUser(tx, userId);

      const result = await tx.user.updateMany({
        where: {
          id: userId,
          balance: {
            gte: amount,
          },
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      if (result.count === 0) {
        throw new TransactionsError("Saldo insuficiente", 400);
      }

      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: "WITHDRAWAL",
          quantity: 0,
          unitPrice: 0,
          totalAmount: amount,
        },
      });

      const user = await this.requireUser(tx, userId);

      return {
        balance: user.balance.toFixed(2),
        transaction: this.mapTransaction(transaction),
      };
    });
  }

  async buy(userId: string, input: unknown) {
    const data = this.body(input);

    if (
      typeof data.assetId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        data.assetId,
      )
    ) {
      throw new TransactionsError("Informe um assetId válido", 400);
    }

    const assetId = data.assetId;

    const quantity = this.decimal(
      data.quantity,
      "quantity",
      4,
      MAX_QUANTITY,
    );

    // Mantém o nome do campo utilizado pelo endpoint atual.
    // Aqui ele representa o preço unitário desta compra.
    const unitPrice = this.decimal(
      data.averagePrice,
      "averagePrice",
      2,
      MAX_MONEY,
    );

    const totalAmount = quantity
      .times(unitPrice)
      .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

    if (
      totalAmount.lessThanOrEqualTo(0) ||
      totalAmount.greaterThan(MAX_MONEY)
    ) {
      throw new TransactionsError(
        "O valor total da compra está fora do limite permitido",
        400,
      );
    }

    return this.repository.execute(async (tx) => {
      await this.requireUser(tx, userId);

      const asset = await tx.asset.findUnique({
        where: { id: assetId },
        select: { id: true },
      });

      if (!asset) {
        throw new TransactionsError("Ativo não encontrado", 404);
      }

      const debit = await tx.user.updateMany({
        where: {
          id: userId,
          balance: {
            gte: totalAmount,
          },
        },
        data: {
          balance: {
            decrement: totalAmount,
          },
        },
      });

      if (debit.count === 0) {
        throw new TransactionsError(
          "Saldo insuficiente para realizar a compra",
          400,
        );
      }

      const existingPosition =
        await tx.portfolioPosition.findFirst({
          where: {
            userId,
            assetId,
          },
        });

      const newQuantity = existingPosition
        ? existingPosition.quantity.plus(quantity)
        : quantity;

      if (newQuantity.greaterThan(MAX_QUANTITY)) {
        throw new TransactionsError(
          "A quantidade total ultrapassa o limite permitido",
          400,
        );
      }

      const newAveragePrice = existingPosition
        ? existingPosition.quantity
            .times(existingPosition.averagePrice)
            .plus(quantity.times(unitPrice))
            .dividedBy(newQuantity)
            .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
        : unitPrice;

      const position = existingPosition
        ? await tx.portfolioPosition.update({
            where: {
              id: existingPosition.id,
            },
            data: {
              quantity: newQuantity,
              averagePrice: newAveragePrice,
            },
          })
        : await tx.portfolioPosition.create({
            data: {
              userId,
              assetId,
              quantity: newQuantity,
              averagePrice: newAveragePrice,
            },
          });

      const transaction = await tx.transaction.create({
        data: {
          userId,
          assetId,
          type: "BUY",
          quantity,
          unitPrice,
          totalAmount,
        },
      });

      const user = await this.requireUser(tx, userId);

      return {
        balance: user.balance.toFixed(2),
        position: {
          id: position.id,
          userId: position.userId,
          assetId: position.assetId,
          quantity: Number(position.quantity),
          averagePrice: Number(position.averagePrice),
          updatedAt: position.updatedAt,
        },
        transaction: this.mapTransaction(transaction),
      };
    });
  }
}