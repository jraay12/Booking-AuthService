import { UpdateUserDTO } from "../../src/modules/User/dto/user.dto";
import { UserRepository } from "../../src/modules/User/types/user-repository.interface";
import { UserService } from "../../src/modules/User/user.service";

describe("User service", () => {
  let userRepo: jest.Mocked<UserRepository>;
  let userService: UserService;

  const updateUserRepositoryMock = (): jest.Mocked<UserRepository> => ({
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  });

  beforeEach(() => {
    userRepo = updateUserRepositoryMock();

    userService = new UserService(userRepo);
  });

  describe("update user", () => {
    const dto = {
      email: "john@gmail.com",
      first_name: "john",
      last_name: "doe",
    };

    const user_id = "3";

    it("should return error if user not found", async () => {
      userRepo.findById.mockResolvedValue(null);

      await expect(userService.update(dto, user_id)).rejects.toThrow(
        "User not found",
      );
      expect(userRepo.findById).toHaveBeenCalledWith(user_id);
    });

    it("should update the user if user exists", async () => {
      userRepo.findById.mockResolvedValue({
        id: "1",
        email: dto.email,
      } as any);

      userRepo.update.mockResolvedValue({
        id: user_id,
        ...dto,
      } as any);

      const result = await userService.update(dto, user_id);

      expect(userRepo.findById).toHaveBeenCalledWith(user_id);

      expect(userRepo.update).toHaveBeenCalledWith(
        {
          email: dto.email,
          first_name: dto.first_name,
          last_name: dto.last_name,
        },
        user_id,
      );

      expect(result).toEqual({
        id: user_id,
        email: dto.email,
        first_name: dto.first_name,
        last_name: dto.last_name,
      });
    });

    it("should not call update if user not found", async () => {
      userRepo.findById.mockResolvedValue(null);
      await expect(userService.update(dto, user_id)).rejects.toThrow(
        "User not found",
      );

      expect(userRepo.update).not.toHaveBeenCalled();
    });

    it("should update only the provided fields", async () => {
      const partialDTO = {
        first_name: "hello",
      };

      userRepo.findById.mockResolvedValue({
        id: user_id,
        email: "john@gmail.com",
        first_name: "old",
      } as any);

      userRepo.update.mockResolvedValue({
        id: user_id,
        email: "john@gmail.com",
        first_name: "hello",
        password_hash: "123456",
      } as any);

      const result = await userService.update(partialDTO as any, user_id);

      expect(userRepo.update).toHaveBeenCalledWith(partialDTO, user_id);

      expect(result.first_name).toBe("hello");
    });

    it("should not return password_hash", async () => {
      userRepo.findById.mockResolvedValue({
        id: user_id,
      } as any);

      userRepo.update.mockResolvedValue({
        id: user_id,
        email: "john@gmail.com",
        password_hash: "secret",
      } as any);

      const result = await userService.update(dto, user_id);

      expect(result).not.toHaveProperty("password_hash");
    });
  });

  describe("user deactivate", () => {
    const user_id = "3";

    it("should not deactivate if user already is deactivated", async () => {
      userRepo.findById.mockResolvedValue({
        id: user_id,
        is_active: false,
      } as any);

      await expect(userService.deactivate(user_id)).rejects.toThrow(
        "User is a already deactivated",
      );

      expect(userRepo.update).not.toHaveBeenCalled();
    });

    it("should return error if user not found", async () => {
      userRepo.findById.mockResolvedValue(null);

      await expect(userService.deactivate(user_id)).rejects.toThrow(
        "User not found",
      );

      expect(userRepo.update).not.toHaveBeenCalled();
    });

    it("should deactivate user successfully", async() => {
      userRepo.findById.mockResolvedValue({
        id: user_id,
        is_active: true
      } as any)

      userRepo.update.mockResolvedValue({
        id: user_id,
        is_active: false
      } as any)

      const result = await userService.deactivate(user_id)

      expect(userRepo.update).toHaveBeenCalledWith({is_active: false}, user_id)

      expect(result.is_active).toBe(false)
    })

  });
});
