import { RequestHandler } from "express";
import { ZodType } from "zod";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export function validate(
  schemas: RequestSchemas,
): RequestHandler {
  return (request, _response, next) => {
    if (schemas.body) {
      request.body = schemas.body.parse(request.body);
    }

    if (schemas.params) {
      schemas.params.parse(request.params);
    }

    if (schemas.query) {
      schemas.query.parse(request.query);
    }

    next();
  };
}