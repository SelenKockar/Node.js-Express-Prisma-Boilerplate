import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { passwordValidation, emailValidation } from "../schemas/auth.schema";

interface UserCredentials {
  email: string;
  password: string;
}

const validateUserCredentials = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //Get email and password from req.body
    const { email, password } = req.body as UserCredentials;

    // Verify email and password
    emailValidation.parse(email);
    passwordValidation.parse(password);

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { validateUserCredentials };
