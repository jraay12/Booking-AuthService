import { UserRepository } from "./types/user-repository.interface";
import { PrismaClient, User } from "@prisma/client";
import { prisma } from "../utils/prisma";

export class AuthRepositoryImpl implements UserRepository {
  constructor(private prisma: PrismaClient = prisma) {}

  async create(user: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Promise<User> {
    return await prisma.user.create({
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password_hash: user.password,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null

    return user
  }
}
