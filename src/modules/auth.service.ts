import { ConflictError } from "../shared/ConflictError";
import { BcryptService } from "./types/bcrypt.interface";
import { UserRepository } from "./types/user-repository.interface";

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private bcrypt: BcryptService,
  ) {}

  async register(dto: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    
    if (existingUser) throw new ConflictError("Email already exists");

    const hashedPassword = await this.bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const { password, ...result } = user;

    return result
  }
}
