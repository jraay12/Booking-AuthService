import { AuthService } from "./../../src/modules/auth.service";
import { UserRepository } from "../../src/modules/types/user-repository.interface";
import { BcryptService } from "../../src/modules/types/bcrypt.interface";

describe("Auth Service", () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let bcryptService: BcryptService;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    bcryptService = {
      compare: jest.fn(),
      hash: jest.fn().mockResolvedValue("hash_password"),
    };

    authService = new AuthService(userRepository, bcryptService);
  });

  it("should be defined", async () => {
    expect(authService).toBeDefined();
  });

  it("should hash password when registering user", async () => {
    await authService.register({
      email: "johnraycaete@gmail.com",
      first_name: "johnray",
      last_name: "canete",
      password: "123456",
    });
    expect(bcryptService.hash).toHaveBeenLastCalledWith("123456", 10);
  });

  it("should save user with hashed password", async () => {
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
});
