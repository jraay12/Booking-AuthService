import { JwtService } from "../modules/types/jwt.interface";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../shared/BadRequestError";
export class JwtServiceImpl implements JwtService {
  constructor(private readonly secretToken: string) {}

  sign(payload: any): string {
    return jwt.sign(payload, this.secretToken, {
      expiresIn: "15m",
    });
  }

  verify(token: string) {
    try {
      return jwt.verify(token, this.secretToken);
    } catch (error) {
      throw new BadRequestError("Invalid or expired token");
    }
  }
}
