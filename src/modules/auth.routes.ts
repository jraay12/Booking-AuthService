import { Router } from "express"
import { AuthController } from "./auth.controller"

const authRoutes = (authController: AuthController) => {
  const router = Router()

  router.post("/", authController.create)
  router.post("/login", authController.login)
  return router

}

export default authRoutes