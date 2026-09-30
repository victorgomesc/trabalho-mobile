import { RequestHandler } from "express";

export const ensureAdmin: RequestHandler = (request, response, next) => {
  if (request.user?.role !== "ADMIN") {
    response.status(403).json({
      error: "Acesso negado. Apenas administradores podem realizar esta operação.",
    });
    return;
  }
  next();
};