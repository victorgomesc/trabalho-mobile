import bcrypt from "bcryptjs";

import { prisma } from "../../config/database";

import { RegisterInput } from "./auth.schema";

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new Error("E-mail já cadastrado");
    }

    const passwordHash = await bcrypt.hash(
      data.password,
      12,
    );

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        createdAt: true,
      },
    });

    return user;
  }
}