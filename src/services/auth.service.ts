import { User } from "@prisma/client";
import { signJwt } from "../utils/jwt";
import dotenv from "dotenv";
import * as bcrypt from "bcrypt";

export const signTokens = async (user: User) => {
  // Load environment variables
  dotenv.config();

  const jwtVariables = {
    userId: user.id,
    username: user.username,
    email: user.email,
  };

  const accessToken = signJwt(jwtVariables, "accessToken", {
    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
  });

  const refreshToken = signJwt(jwtVariables, "refreshToken", {
    expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}d`,
  });

  return { accessToken, refreshToken };
};
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};
export const comparePasswords = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
