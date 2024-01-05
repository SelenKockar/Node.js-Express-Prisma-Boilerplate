import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  comparePasswords,
  hashPassword,
  signTokens,
} from "../services/auth.service";
import { passwordValidation, emailValidation } from "../schema/auth.schema";
import { signJwt, verifyJwt } from "../utils/jwt";
import { NextFunction } from "express";
import { ZodError } from "zod";

require("dotenv").config();
const prisma = new PrismaClient();

// Create new user
export const signupUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    emailValidation.parse(email);
    passwordValidation.parse(password);

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
    // Check if the error is a ZodError (validation error)
    if (error instanceof ZodError) {
      console.error("Validation error:", error);
      return res.status(400).json({ message: error.errors[0].message });
    }

    // Handle other types of errors
    console.error("Unexpected error:", error);
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
    expires: new Date(Date.now() + 15 * 60 * 1000),
  });
  res.cookie("refreshToken", refreshToken, {
    expires: new Date(Date.now() + 60 * 60 * 1000),
  });

  const loginResponse = {
    message: "Login successful",
    accessToken,
  };

  res.status(200).json(loginResponse);
};

// If necessary, refresh method provides the accessToken when its expired.
/*export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const access_token = signJwt({ sub: user.id }, "accessToken", {
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
    });

    // Send the new access token
    res.json({ access_token });
  } catch (error) {
    // Handle any other errors manually
    res.status(500).json({ error: "Internal Server Error" });
  }
};
*/

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
