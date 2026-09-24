import { RequestHandler } from "express";
import { ZodType } from "zod";

type RequestSchemas<Params, Body> = {
  body?: ZodType<Body>;
  params?: ZodType<Params>;
  query?: ZodType;
};

export function validate<
  Params = Record<string, string>,
  Body = unknown,
>(
  schemas: RequestSchemas<Params, Body>,
): RequestHandler<Params, unknown, Body> {
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