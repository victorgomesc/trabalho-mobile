import { Router } from "express";
import { database } from "../config/database";
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
  await database.query("SELECT 1");

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
// routes.use("/portfolio", portfolioRoutes);