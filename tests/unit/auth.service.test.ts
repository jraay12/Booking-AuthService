import { AuthService } from "./../../src/modules/auth.service";
import { UserRepository } from "../../src/modules/types/user-repository.interface";
import { BcryptService } from "../../src/modules/types/bcrypt.interface";
import { JwtService } from "../../src/modules/types/jwt.interface";
describe("Auth Service", () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let bcryptService: BcryptService;
  let jwtService: JwtService;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    bcryptService = {
      compare: jest.fn(),
      hash: jest.fn().mockResolvedValue("hash_password"),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue("jwt-token"),
      verify: jest.fn(),
    };

    authService = new AuthService(userRepository, bcryptService, jwtService);
  });

  it("should be defined", async () => {
    expect(authService).toBeDefined();
  });

  it("should hash password when registering user", async () => {
    (userRepository.create as jest.Mock).mockResolvedValue({
      id: "1",
      email: "johnraycaete@gmail.com",
      first_name: "johnray",
      last_name: "canete",
      password: "hash_password",
    });

    await authService.register({
      email: "johnraycaete@gmail.com",
      first_name: "johnray",
      last_name: "canete",
      password: "123456",
    });
    expect(bcryptService.hash).toHaveBeenLastCalledWith("123456", 10);
  });

  it("should save user with hashed password", async () => {
    (userRepository.create as jest.Mock).mockResolvedValue({
      id: "1",
      email: "johnraycaete@gmail.com",
      first_name: "johnray",
      last_name: "canete",
      password: "hash_password",
    });

    await authService.register({
      email: "johnraycaete@gmail.com",
      first_name: "johnray",
      last_name: "canete",
      password: "123456",
    });

    expect(userRepository.create).toHaveBeenCalledWith({
      email: "johnraycaete@gmail.com",
      first_name: "johnray",
      last_name: "canete",
      password: "hash_password",
    });
  });

  it("shoudld throw an error if email already exists", async () => {
    const existingUser = {
      id: "1",
      email: "john@gmail.com",
    };

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(existingUser);

    await expect(
      authService.register({
        email: "johnraycaete@gmail.com",
        first_name: "johnray",
        last_name: "canete",
        password: "123456",
      }),
    ).rejects.toThrow("Email already exists");
  });

  it("should returh created user", async () => {
    const createdUser = {
      id: "1",
      email: "john@gmail.com",
    };

    (userRepository.create as jest.Mock).mockResolvedValue(createdUser);

    const result = await authService.register({
      email: "johnraycaete@gmail.com",
      first_name: "johnray",
      last_name: "canete",
      password: "123456",
    });

    expect(result).toEqual(createdUser);
  });

  it("should fail if email not found", async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      authService.login({
        email: "notfound@gmail.com",
        password: "123456",
      }),
    ).rejects.toThrow("User not found");
  });

  it("should fail if password does not match", async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@gmail.com",
      password: "hashed_password",
    });

    (bcryptService.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      authService.login({
        email: "john@gmail.com",
        password: "wrongpassword",
      }),
    ).rejects.toThrow("Invalid credentials");
  });

  it("should return JWT token when login is successful", async () => {
    const user = {
      id: "1",
      email: "john@gmail.com",
      password_hash: "hashedPassword",
    };

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(user);
    (bcryptService.compare as jest.Mock).mockResolvedValue(true);
    (jwtService.sign as jest.Mock).mockReturnValue("jwt-token");

    const result = await authService.login({
      email: "john@gmail.com",
      password: "123456",
    });

    expect(result).toEqual({
      access_token: "jwt-token"
    })
  });
});
