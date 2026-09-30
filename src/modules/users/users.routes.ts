import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { UsersController } from "./users.controller";

export const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.get(
  "/me",
  auth,
  usersController.me.bind(usersController),
);

usersRoutes.patch(
  "/me",
  auth,
  usersController.updateMe.bind(usersController),
);

usersRoutes.delete(
  "/me",
  auth,
  usersController.deleteMe.bind(usersController),
);