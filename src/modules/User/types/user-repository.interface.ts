
import { User } from "@prisma/client";
export interface UserRepository {
  create(user: { email: string; password: string, first_name: string, last_name: string }): Promise<any>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(user: Partial<User>, user_id: string): Promise<User>;
  findAll(filters?: {is_active?: boolean}): Promise<User[]>
}