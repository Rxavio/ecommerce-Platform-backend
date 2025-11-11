import prisma from "../config/prisma";
import { User } from "@prisma/client";
import { RegisterDTO } from "../interfaces/auth.interface";

class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  }

  async create(data: RegisterDTO & { password: string }): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        role: "User", // Default role for new registrations
      },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserRepository();
