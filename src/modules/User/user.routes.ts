import { UserController } from './user.controller';
import { Router } from "express";
import { authMiddleware } from '../../middleware/auth.middleware';
import { JwtService } from '../Auth/types/jwt.interface';
const userRoutes = (userController: UserController, jwtService: JwtService) => {
  const router = Router();

  router.patch("/:user_id", authMiddleware(jwtService), userController.update);
  return router;
};

export default userRoutes;
