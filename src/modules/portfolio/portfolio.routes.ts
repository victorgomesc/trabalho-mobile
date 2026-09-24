import { Router } from "express";

import { auth } from "../../middlewares/auth";

import { PortfolioController } from "./portfolio.controller";

export const portfolioRoutes = Router();

const portfolioController =
  new PortfolioController();

portfolioRoutes.get(
  "/",
  auth,
  portfolioController.summary.bind(
    portfolioController,
  ),
);