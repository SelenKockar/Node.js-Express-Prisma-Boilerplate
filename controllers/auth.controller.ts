import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Create new user
export const signupUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await prisma.user.create({
    data: {
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    },
  });
  res.status(201).json({
    message: "Registiration is successful!",
  });
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

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    return res.status(400).json({
      message: "Incorrect password",
    });
  }
  return res.status(200).json({});
};