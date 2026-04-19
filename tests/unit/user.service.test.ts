import { describe } from "node:test";
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
    findAll: jest.fn(),
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

    it("should deactivate user successfully", async () => {
      userRepo.findById.mockResolvedValue({
        id: user_id,
        is_active: true,
      } as any);

      userRepo.update.mockResolvedValue({
        id: user_id,
        is_active: false,
      } as any);

      const result = await userService.deactivate(user_id);

      expect(userRepo.update).toHaveBeenCalledWith(
        { is_active: false },
        user_id,
      );

      expect(result.is_active).toBe(false);
    });
  });

  describe("user activate", () => {
    const user_id = "3";
    it("should return error if user not found", async () => {
      userRepo.findById.mockResolvedValue(null);

      await expect(userService.activate(user_id)).rejects.toThrow(
        "User not found",
      );

      expect(userRepo.update).not.toHaveBeenCalled();
    });

    it("should successfully activate user", async () => {
      userRepo.findById.mockResolvedValue({
        id: user_id,
        is_active: false,
      } as any);

      userRepo.update.mockResolvedValue({
        id: user_id,
        is_active: true,
      } as any);

      const result = await userService.activate(user_id);

      expect(userRepo.update).toHaveBeenCalledWith(
        { is_active: true },
        user_id,
      );

      expect(result.is_active).toBe(true);
    });

    it("should not be activate when user already activated", async () => {
      userRepo.findById.mockResolvedValue({
        id: user_id,
        is_active: true,
      } as any);

      expect(userService.activate(user_id)).rejects.toThrow(
        "User already activated",
      );

      expect(userRepo.update).not.toHaveBeenCalled();
    });
  });

  describe("Get User By Id", () => {
    const user_id = "1";

    it("should return error if user not found", async () => {
      userRepo.findById.mockResolvedValue(null);

      await expect(userService.findById(user_id)).rejects.toThrow(
        "User not found",
      );

      expect(userRepo.findById).toHaveBeenCalledWith(user_id);
    });

    it("should return user if found", async () => {
      const mockUser = {
        id: "1",
        email: "john@gmail.com",
        password_hash: "hashedpassword",
      };
      userRepo.findById.mockResolvedValue(mockUser as any);

      const result = await userService.findById(user_id);
      expect(userRepo.findById).toHaveBeenCalledWith(user_id);
      expect(result).toEqual({
        id: "1",
        email: "john@gmail.com",
      });
      expect(result).not.toHaveProperty("password_hash");
    });
  });

  describe("Get all users", () => {
    it("should return active user", async () => {
      userRepo.findAll.mockResolvedValue([{ id: "1", is_active: true } as any]);

      const result = await userService.getUsers({ is_active: true });

      expect(userRepo.findAll).toHaveBeenCalledWith({ is_active: true });

      expect(result[0].is_active).toBe(true);
      result.forEach((user) => {
        expect(user).not.toHaveProperty("password_hash");
      });
    });

    it("should return inactive users", async () => {
      userRepo.findAll.mockResolvedValue([
        { id: "2", is_active: false } as any,
      ]);

      const result = await userService.getUsers({ is_active: false });

      expect(userRepo.findAll).toHaveBeenCalledWith({
        is_active: false,
      });

      expect(result[0].is_active).toBe(false);
    });

    it("should return empty array when no users exist", async () => {
      userRepo.findAll.mockResolvedValue([]);

      const result = await userService.getUsers({ is_active: true });

      expect(result).toEqual([]);
    });

    it("should return all users when no filter is provided", async () => {
      userRepo.findAll.mockResolvedValue([
        { id: "1", is_active: true, password_hash: "123456" } as any,
        { id: "2", is_active: false, password_hash: "123456" } as any,
      ]);

      const result = await userService.getUsers();

      expect(userRepo.findAll).toHaveBeenCalledWith(undefined);

      expect(result.length).toBe(2);
      result.forEach(user => {
        expect(user).not.toHaveProperty("password_hash")
      })
    });
  });
});
