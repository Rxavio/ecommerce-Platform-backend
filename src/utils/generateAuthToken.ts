import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthenticatedUser } from "../interfaces/auth.interface";

export const generateAuthToken = (user: {
  id: string;
  username: string;
  email: string;
  role: string;
}): string => {
  const payload: AuthenticatedUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.jwtSecret, { expiresIn: "24h" });
};
