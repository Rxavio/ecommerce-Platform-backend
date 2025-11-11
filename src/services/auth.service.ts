import { RegisterDTO, LoginDTO } from "../interfaces/auth.interface";
import { ApiResponse } from "../interfaces/response.interface";
import userRepository from "../repositories/user.repository";
import { hashPassword } from "../utils/hashPassword";
import { generateAuthToken } from "../utils/generateAuthToken";
import { AppError } from "../utils/AppError";
import { User } from "@prisma/client";

class AuthService {
  private excludePassword(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async register(data: RegisterDTO): Promise<ApiResponse> {
    // Check if email or username is already taken
    const existingUser = await userRepository.findByEmailOrUsername(
      data.email,
      data.username,
    );

    if (existingUser) {
      throw AppError.conflict("Email or username is already taken");
    }
    // Hash password
    const hashedPassword = await hashPassword(data.password);

    const user = await userRepository.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });
    return {
      success: true,
      message: "User registered successfully",
      data: {
        user: this.excludePassword(user),
      },
    };
  }
}

export default new AuthService();
