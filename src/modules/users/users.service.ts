import { prisma } from "../../config/database";

interface UpdateProfileData {
  name?: string;
  email?: string;
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  balance: true,
  createdAt: true,
} as const;

export class UsersServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "UsersServiceError";
  }
}

export class UsersService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: userSelect,
    });

    if (!user) {
      throw new UsersServiceError("Usuário não encontrado", 404);
    }

    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileData) {
    try {
      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.email !== undefined ? { email: data.email } : {}),
        },
        select: userSelect,
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error
      ) {
        if (error.code === "P2002") {
          throw new UsersServiceError(
            "Este e-mail já está cadastrado",
            409,
          );
        }

        if (error.code === "P2025") {
          throw new UsersServiceError(
            "Usuário não encontrado",
            404,
          );
        }
      }

      throw error;
    }
  }

  async deleteProfile(userId: string): Promise<void> {
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error
    ) {
      if (error.code === "P2025") {
        throw new UsersServiceError(
          "Usuário não encontrado",
          404,
        );
      }

      if (error.code === "P2003") {
        throw new UsersServiceError(
          "Não é possível excluir o usuário enquanto houver registros vinculados",
          409,
        );
      }
    }

    throw error;
  }
}
}