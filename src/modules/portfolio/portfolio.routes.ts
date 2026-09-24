import { Router } from "express";

import { validate } from "../../middlewares/validate";

import {
  PortfolioController,
  PortfolioUserParams,
} from "./portfolio.controller";

import { portfolioUserParamsSchema } from "./portfolio.validation";

export const portfolioRoutes = Router();

const portfolioController = new PortfolioController();

portfolioRoutes.get(
  "/users/:userId/portfolio",
  validate<PortfolioUserParams>({
    params: portfolioUserParamsSchema,
  }),
  portfolioController.summary.bind(portfolioController),
);