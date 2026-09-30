import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";

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

    request.user = {
      id: decoded.sub,
    };

    next();
  } catch {
    response.status(401).json({
      error: "Token de autenticação inválido ou expirado",
    });
  }
};