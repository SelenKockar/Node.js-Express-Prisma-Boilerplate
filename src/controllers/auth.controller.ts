import { PrismaClient } from "@prisma/client";
import { Request, Response, CookieOptions } from "express";
import {
  comparePasswords,
  hashPassword,
  signTokens,
} from "../services/auth.service";
import { signJwt, verifyJwt } from "../utils/jwt";

require("dotenv").config();
const prisma = new PrismaClient();

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
};

// Create new user
export const signupUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    // Hash the password
    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });
    res.status(201).json({
      message: "Registration is successful!",
    });
  } catch (error) {
    // Handle other types of errors
    res.status(500).json({ message: "An error occurred" });
  }
};

// Log in as an existing user
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const isCorrectPassword = await comparePasswords(password, user.password);

  if (!isCorrectPassword) {
    return res.status(400).json({
      message: "Incorrect username or password",
    });
  }

  const { accessToken, refreshToken } = await signTokens(user);
  // Create Access and Refresh tokens
  res.cookie("accessToken", accessToken, {
    ...cookiesOptions,
    expires: new Date(Date.now() + 15 * 60 * 1000),
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookiesOptions,
    expires: new Date(Date.now() + 60 * 60 * 1000),
  });

  const loginResponse = {
    message: "Login successful",
    accessToken,
  };

  res.status(200).json(loginResponse);
};

// Can be used to refresh the access token and can be modified according to client-side needs.
export const refresh = async (req: Request, res: Response) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    const message = "Could not refresh access token";

    if (!refresh_token) {
      // Handle error manually without using AppError
      res.status(403).json({ error: message });
      return;
    }

    const decoded = verifyJwt<{ sub: number }>(refresh_token, "refreshToken");

    if (!decoded) {
      // Handle error manually without using AppError
      res.status(403).json({ error: message });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.sub,
      },
    });

    if (!user) {
      // Handle error manually without using AppError
      res.status(403).json({ error: message });
      return;
    }

    // Sign new access token
    const accessToken = signJwt(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
      "accessToken",
      {
        expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
      }
    );

    // Send the new access token
    res.json({ accessToken });
  } catch (error) {
    // Handle any other errors manually
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  // Reset the tokens
  res.cookie("accessToken", "", {
    expires: new Date(0),
  });
  res.cookie("refreshToken", "", {
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successful" });
};
