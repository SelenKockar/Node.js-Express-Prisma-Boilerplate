import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  comparePasswords,
  hashPassword,
  signTokens,
} from "../services/auth.service";
import { passwordValidation, emailValidation } from "../schema/auth.schema";



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
    // Hata yönetimi burada yapılacak
    console.error(error);
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

  res.json({
    message: "Login successful",
    accessToken,
  });
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
