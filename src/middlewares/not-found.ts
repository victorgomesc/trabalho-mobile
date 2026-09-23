import { RequestHandler } from "express";

export const notFound: RequestHandler = (
  request,
  response,
) => {
  response.status(404).json({
    error: "Rota não encontrada",
    method: request.method,
    path: request.originalUrl,
  });
};