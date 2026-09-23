import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { routes } from "./routes";
import { notFound } from "./middlewares/not-found";
import { errorHandler } from "./middlewares/error-handler";

export const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);