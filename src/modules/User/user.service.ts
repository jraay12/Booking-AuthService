import { NotFoundError } from "../../shared/NotFoundError";
import { UpdateUserDTO } from "./dto/user.dto";
import { UserRepository } from "./types/user-repository.interface";

export class UserService {
  constructor(private userRepo: UserRepository){}

  async update(dto: UpdateUserDTO, user_id: string){
    const existingUser = await this.userRepo.findById(user_id)

    if(!existingUser) throw new NotFoundError("User not found")

    const {password_hash, ...safe} = await this.userRepo.update(dto, user_id)

    return safe
  }
}