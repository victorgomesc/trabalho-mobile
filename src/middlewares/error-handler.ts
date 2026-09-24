import {
  ErrorRequestHandler,
} from "express";

import { ZodError } from "zod";
import { AppError } from "../shared/errors/AppError";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    });

    return;
  }

  if (error instanceof ZodError) {
    response.status(422).json({
      error: "Dados inválidos",
      details: error.flatten().fieldErrors,
    });

    return;
  }

  console.error(error);

  response.status(500).json({
    error: "Erro interno do servidor",
  });
};