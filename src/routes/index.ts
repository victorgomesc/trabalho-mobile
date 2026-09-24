import { Router } from "express";
import { prisma } from "../config/database";
import { portfolioRoutes } from "../modules/portfolio/portfolio.routes";
import { positionsRoutes } from "../modules/positions/positions.routes";

export const routes = Router();

routes.get("/", (_request, response) => {
  response.status(200).json({
    name: "Investment Wallet API",
    version: "1.0.0",
    status: "online",
  });
});

routes.get("/health", async (_request, response) => {
  await prisma.$queryRaw`SELECT 1`;

  response.status(200).json({
    status: "ok",
    database: "connected",
    timestamp: new Date().toISOString(),
  });
});

// routes.use("/auth", authRoutes);
// routes.use("/users", usersRoutes);
// routes.use("/assets", assetsRoutes);
routes.use("/positions", positionsRoutes);
routes.use("/portfolio", portfolioRoutes);