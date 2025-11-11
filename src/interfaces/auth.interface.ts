import { Request } from "express";
import { User } from "@prisma/client";

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: User;
}
