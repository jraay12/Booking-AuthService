import { UserController } from './user.controller';
import { Router } from "express";

const userRoutes = (userController: UserController) => {
  const router = Router();

  router.patch("/:user_id", userController.update);
  return router;
};

export default userRoutes;
