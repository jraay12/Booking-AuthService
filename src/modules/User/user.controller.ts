import { UpdateUserDTO } from "./dto/user.dto";
import { UserService } from "./user.service";
import { Request, Response, NextFunction } from "express";

export class UserController {
  constructor(private userService: UserService) {}

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const InputBody: UpdateUserDTO = req.body as UpdateUserDTO;
      const InputParams = req.params as {user_id: string} ;
      const result = await this.userService.update(InputBody, InputParams.user_id)
      res.status(201).json({
        message: "Successfully update user",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
