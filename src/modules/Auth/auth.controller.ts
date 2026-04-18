import { AuthService } from "./auth.service";
import { Request, Response, NextFunction } from "express";
import { CreateUserDTO } from "./dto/auth.dto";
export class AuthController {
  constructor(private authService: AuthService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const InputBody: CreateUserDTO = req.body as CreateUserDTO;
      const result = await this.authService.register(InputBody);
      res.status(201).json({
        message: "Successfully created user",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const InputBody = req.body as { email: string; password: string };
      const { access_token } = await this.authService.login(InputBody);
      res.status(200).json({
        message: "Successfully Logged In",
        token: access_token,
      });
    } catch (error) {
      next(error);
    }
  };
}
