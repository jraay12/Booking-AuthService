import { AuthController } from "./modules/auth.controller";
import { AuthService } from "./modules/auth.service";
import { AuthRepositoryImpl } from "./modules/auth.repository";
import { BcryptImpl } from "./utils/bcrypt";
import {prisma} from "./utils/prisma"

// Repositories
const userRepo = new AuthRepositoryImpl(prisma)

// other services
const bcrypt = new BcryptImpl()

// services
const authService = new AuthService(userRepo, bcrypt)

export const authController = new AuthController(authService)