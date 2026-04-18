import { AuthService } from "../../src/modules/auth.service";
import { UserRepository } from "../../src/modules/types/user-repository.interface";
import { BcryptService } from "../../src/modules/types/bcrypt.interface";
import { JwtService } from "../../src/modules/types/jwt.interface";

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let bcryptService: jest.Mocked<BcryptService>;
  let jwtService: jest.Mocked<JwtService>;

  // -------------------------
  // Mock factories
  // -------------------------
  const createUserRepositoryMock = (): jest.Mocked<UserRepository> => ({
    create: jest.fn(),
    findByEmail: jest.fn(),
  });

  const createBcryptMock = (): jest.Mocked<BcryptService> => ({
    hash: jest.fn().mockResolvedValue("hashed_password"),
    compare: jest.fn(),
  });

  const createJwtMock = (): jest.Mocked<JwtService> => ({
    sign: jest.fn().mockReturnValue("jwt-token"),
    verify: jest.fn(),
  });

  // -------------------------
  // Setup
  // -------------------------
  beforeEach(() => {
    userRepository = createUserRepositoryMock();
    bcryptService = createBcryptMock();
    jwtService = createJwtMock();

    authService = new AuthService(
      userRepository,
      bcryptService,
      jwtService,
    );
  });

  // =========================
  // REGISTER TESTS
  // =========================
  describe("register", () => {
    const dto = {
      email: "john@gmail.com",
      first_name: "john",
      last_name: "doe",
      password: "123456",
    };

    it("should hash password before saving user", async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue({
        id: "1",
        email: dto.email,
        first_name: dto.first_name,
        last_name: dto.last_name,
        password: "hashed_password",
      } as any);

      await authService.register(dto);

      expect(bcryptService.hash).toHaveBeenCalledWith(dto.password, 10);
    });

    it("should create user with hashed password", async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      userRepository.create.mockResolvedValue({
        id: "1",
        ...dto,
        password: "hashed_password",
      } as any);

      await authService.register(dto);

      expect(userRepository.create).toHaveBeenCalledWith({
        email: dto.email,
        first_name: dto.first_name,
        last_name: dto.last_name,
        password: "hashed_password",
      });
    });

    it("should throw error if email already exists", async () => {
      userRepository.findByEmail.mockResolvedValue({
        id: "1",
        email: dto.email,
      } as any);

      await expect(authService.register(dto)).rejects.toThrow(
        "Email already exists",
      );
    });

    it("should return created user", async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const createdUser = {
        id: "1",
        email: dto.email,
      };

      userRepository.create.mockResolvedValue(createdUser as any);

      const result = await authService.register(dto);

      expect(result).toEqual(createdUser);
    });
  });

  // =========================
  // LOGIN TESTS
  // =========================
  describe("login", () => {
    const dto = {
      email: "john@gmail.com",
      password: "123456",
    };

    it("should fail if user not found", async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrow(
        "User not found",
      );
    });

    it("should fail if password does not match", async () => {
      userRepository.findByEmail.mockResolvedValue({
        id: "1",
        email: dto.email,
        password: "hashed_password",
      } as any);

      bcryptService.compare.mockResolvedValue(false);

      await expect(authService.login(dto)).rejects.toThrow(
        "Invalid credentials",
      );
    });

    it("should return JWT token on success", async () => {
      userRepository.findByEmail.mockResolvedValue({
        id: "1",
        email: dto.email,
        password: "hashed_password",
      } as any);

      bcryptService.compare.mockResolvedValue(true);

      const result = await authService.login(dto);

      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({
        access_token: "jwt-token",
      });
    });
  });
});