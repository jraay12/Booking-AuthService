import { Request, Response, NextFunction } from "express";
import { JwtService } from "../modules/Auth/types/jwt.interface";
declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export const authMiddleware = (jwtService: JwtService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      const decoded = jwtService.verify(token);

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }
  };
};
