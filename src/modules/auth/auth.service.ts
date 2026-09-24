import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

import { prisma } from "../../config/database";
import { env } from "../../config/env";

import {
  LoginInput,
  RegisterInput,
} from "./auth.schema";

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

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new Error("E-mail ou senha inválidos");
    }

    const passwordMatches = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new Error("E-mail ou senha inválidos");
    }

    const expiresIn =
      env.JWT_EXPIRES_IN as SignOptions["expiresIn"];

    const token = jwt.sign(
      {},
      env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn,
      },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        createdAt: user.createdAt,
      },
    };
  }
}