import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { TransactionsController } from "./transactions.controller";

export const transactionsRoutes = Router();

const controller = new TransactionsController();

transactionsRoutes.use(auth);

transactionsRoutes.get(
  "/balance",
  controller.balance.bind(controller),
);

transactionsRoutes.get(
  "/",
  controller.list.bind(controller),
);

transactionsRoutes.post(
  "/deposit",
  controller.deposit.bind(controller),
);

transactionsRoutes.post(
  "/withdraw",
  controller.withdraw.bind(controller),
);