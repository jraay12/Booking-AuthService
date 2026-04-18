import bcrypt from "bcrypt"
import { BcryptService } from "../modules/types/bcrypt.interface";


export class BcryptImpl implements BcryptService {
  
  async compare(password: string, hash: string): Promise<boolean> {
      return bcrypt.compare(password, hash)
  }
  async hash(password: string, salt: number): Promise<string> {
      return await bcrypt.hash(password, salt)
  }
}