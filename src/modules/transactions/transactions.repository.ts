import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database";
import { TransactionsError } from "./transactions.errors";

export class TransactionsRepository {
  async execute<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await prisma.$transaction(operation, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 10000,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2034") {
            if (attempt < maxAttempts) {
              continue;
            }

            throw new TransactionsError(
              "Conflito entre operações. Tente novamente",
              409,
            );
          }

          if (error.code === "P2003") {
            throw new TransactionsError(
              "Um registro vinculado não existe mais",
              409,
            );
          }

          if (error.code === "P2025") {
            throw new TransactionsError(
              "Registro não encontrado",
              404,
            );
          }
        }

        throw error;
      }
    }

    throw new TransactionsError(
      "Não foi possível concluir a operação",
      409,
    );
  }
}