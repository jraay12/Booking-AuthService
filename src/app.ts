import express from "express";
import { Request, Response } from "express";
import { authController, userController } from "./container";
import authRoutes from "./modules/Auth/auth.routes";
import userRoutes from "./modules/User/user.routes";
import { GlobalErrorHandler } from "./middleware/GlobalErrorHandler";
const app = express();

app.use(express.json());

app.use("/auth", authRoutes(authController));
app.use("/user", userRoutes(userController));


app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "UP",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use(GlobalErrorHandler);

export default app;
