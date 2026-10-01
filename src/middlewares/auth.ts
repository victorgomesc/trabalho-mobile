import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";

export interface AuthUser {
  id: string;
  role: "ADMIN" | "USER";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const auth: RequestHandler = (
  request,
  response,
  next,
): void => {
  const authorization = request.headers.authorization;

  if (!authorization) {
    response.status(401).json({
      error: "Token de autenticação não informado",
    });

    return;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    response.status(401).json({
      error: "Formato do token de autenticação inválido",
    });

    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET,
    );

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string"
    ) {
      response.status(401).json({
        error: "Token de autenticação inválido",
      });

      return;
    }

    const decodedToken = decoded as { sub: string; role?: "ADMIN" | "USER" };

    request.user = {
      id: decodedToken.sub,
      role: decodedToken.role ?? "USER",
    };

    next();
  } catch {
    response.status(401).json({
      error: "Token de autenticação inválido ou expirado",
    });
  }
};