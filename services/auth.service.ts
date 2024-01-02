import { User } from "@prisma/client";
import { signJwt } from "../utils/jwt";
import dotenv from "dotenv";

export const signTokens = async (user: User) => {
    // Load environment variables
    dotenv.config();

    const accessToken = signJwt({
        userId: user.id,
        username: user.username,
        email: user.email
     }, 'accessToken', {
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
    });
  
    const refreshToken = signJwt({
        userId: user.id,
        username: user.username,
        email: user.email
     }, "refreshToken", {
      expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}d`,
    });
  
    return { accessToken, refreshToken };
  };