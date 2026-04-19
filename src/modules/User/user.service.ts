import { BadRequestError } from "../../shared/BadRequestError";
import { NotFoundError } from "../../shared/NotFoundError";
import { UpdateUserDTO } from "./dto/user.dto";
import { UserRepository } from "./types/user-repository.interface";

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async update(dto: UpdateUserDTO, user_id: string) {
    const existingUser = await this.userRepo.findById(user_id);

    if (!existingUser) throw new NotFoundError("User not found");

    const { password_hash, ...safe } = await this.userRepo.update(dto, user_id);

    return safe;
  }

  async deactivate(user_id: string) {
    const user = await this.userRepo.findById(user_id);

    if (!user) throw new NotFoundError("User not found");

    if (!user.is_active)
      throw new BadRequestError("User is a already deactivated");

    return await this.userRepo.update({ is_active: false }, user_id);
  }

  async activate(user_id: string) {
    const user = await this.userRepo.findById(user_id);

    if (!user) throw new NotFoundError("User not found");

    if (user.is_active) throw new BadRequestError("User already activated");

    return await this.userRepo.update({ is_active: true }, user_id);
  }

  async findById(user_id: string) {
    const user = await this.userRepo.findById(user_id);

    if (!user) throw new NotFoundError("User not found");

    const {password_hash, ...safe} = user

    return safe
  }
}
