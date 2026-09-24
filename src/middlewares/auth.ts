import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";

export function auth(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authorization = request.headers.authorization;

  if (!authorization) {
    response.status(401).json({
      error: "Token de autenticação não informado",
    });

    return;
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    response.status(401).json({
      error: "Token de autenticação inválido",
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
      !decoded.sub
    ) {
      response.status(401).json({
        error: "Token de autenticação inválido",
      });

      return;
    }

    request.user = {
      id: decoded.sub,
    };

    next();
  } catch {
    response.status(401).json({
      error: "Token de autenticação inválido ou expirado",
    });
  }
}