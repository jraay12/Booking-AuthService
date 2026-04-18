import { AuthController } from "./modules/Auth/auth.controller";
import { AuthService } from "./modules/Auth/auth.service";
import { UserRepositoryImpl } from "./modules/User/user.repository";
import { BcryptImpl } from "./utils/bcrypt";
import { prisma } from "./utils/prisma";
import { JwtServiceImpl } from "./utils/jwt";
import { UserController } from "./modules/User/user.controller";
import { UserService } from "./modules/User/user.service";
// Repositories
const userRepo = new UserRepositoryImpl(prisma);

// other services
const bcrypt = new BcryptImpl();
const jwt = new JwtServiceImpl(process.env.SECRET_TOKEN!);

// services
const authService = new AuthService(userRepo, bcrypt, jwt);
const userService = new UserService(userRepo)

export const authController = new AuthController(authService);
export const userController = new UserController(userService)