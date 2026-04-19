import { UserController } from "./user.controller";
import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { JwtService } from "../Auth/types/jwt.interface";
const userRoutes = (userController: UserController, jwtService: JwtService) => {
  const router = Router();

  router.patch("/:user_id", authMiddleware(jwtService), userController.update);
  router.patch(
    "/:user_id/deactivate",
    authMiddleware(jwtService),
    userController.deactivate,
  );
  router.patch(
    "/:user_id/activate",
    authMiddleware(jwtService),
    userController.activate,
  );
  router.get("/:user_id", authMiddleware(jwtService), userController.getById);
  router.get("/", authMiddleware(jwtService), userController.getUsers);

  return router;
};

export default userRoutes;
