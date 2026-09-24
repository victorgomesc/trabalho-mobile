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