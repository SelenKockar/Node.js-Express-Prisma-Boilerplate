import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface TokenPayload {
  userId: number;
  username: string;
  email: string;
}

export const signJwt = (
  payload: TokenPayload,
  keyName: "accessToken" | "refreshToken",
  options?: SignOptions
): string => {
  let secretKey: string;
  if (keyName === "accessToken") {
    secretKey = process.env.ACCESS_TOKEN_SECRET || "";
  } else {
    secretKey = process.env.REFRESH_TOKEN_SECRET || "";
  }

  if (!secretKey) {
    throw new Error(`${keyName} secret key is not defined in .env file`);
  }

  return jwt.sign(payload, secretKey, { ...(options && options) });
};

export const verifyJwt = <T = any>(
  token: string,
  keyName: "accessToken" | "refreshToken"
): T | null => {
  let secretKey: string;
  if (keyName === "accessToken") {
    secretKey = process.env.ACCESS_TOKEN_SECRET || "";
  } else {
    secretKey = process.env.REFRESH_TOKEN_SECRET || "";
  }

  if (!secretKey) {
    throw new Error(`${keyName} secret key is not defined in .env file`);
  }

  try {
    return jwt.verify(token, secretKey) as T;
  } catch (error) {
    return null;
  }
};
