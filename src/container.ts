import { AuthController } from "./modules/Auth/auth.controller";
import { AuthService } from "./modules/Auth/auth.service";
import { AuthRepositoryImpl } from "./modules/User/auth.repository";
import { BcryptImpl } from "./utils/bcrypt";
import { prisma } from "./utils/prisma";
import { JwtServiceImpl } from "./utils/jwt";

// Repositories
const userRepo = new AuthRepositoryImpl(prisma);

// other services
const bcrypt = new BcryptImpl();
const jwt = new JwtServiceImpl(process.env.SECRET_TOKEN!);
// services
const authService = new AuthService(userRepo, bcrypt, jwt);

export const authController = new AuthController(authService);
