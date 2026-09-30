import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { routes } from "./routes";
import { notFound } from "./middlewares/not-found";
import { errorHandler } from "./middlewares/error-handler";
import { swaggerDocument } from "./docs/swagger";
import { transactionsRoutes } from "./modules/transactions/transactions.routes";

export const app = express();

app.disable("x-powered-by");

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "Investment Wallet API",
  }),
);

app.get("/docs.json", (_request, response) => {
  response.status(200).json(swaggerDocument);
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (_request, response) => {
  response.status(200).json({
    name: "Investment Wallet API",
    version: "1.0.0",
    status: "online",
    documentation: "/docs/",
  });
});

app.use("/api", routes);


/*
 * Estas duas linhas precisam ficar no final.
 */
app.use(notFound);
app.use(errorHandler);