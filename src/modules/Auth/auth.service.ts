import { ConflictError } from "../../shared/ConflictError";
import { BcryptService } from "./types/bcrypt.interface";
import { UserRepository } from "./types/user-repository.interface";
import { JwtService } from "./types/jwt.interface";
import { NotFoundError } from "../../shared/NotFoundError";
import { UnAuthorizedError } from "../../shared/UnAuthorizedError";
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private bcrypt: BcryptService,
    private jwt: JwtService,
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

    return result;
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) throw new NotFoundError("User not found");

    const isMatch = await this.bcrypt.compare(dto.password, user.password_hash);

    if (!isMatch) throw new UnAuthorizedError("Invalid credentials");

    const access_token = this.jwt.sign({ id: user.id });

    return { access_token };
  }
}
