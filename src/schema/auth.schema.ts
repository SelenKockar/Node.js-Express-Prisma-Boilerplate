import { z } from "zod";

const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .max(32, { message: "Password must be at most 32 characters." })
  .regex(/[A-Z]/, {
    message: "The password must contain at least one uppercase letter.",
  })
  .regex(/[0-9]/, { message: "The password must contain at least one number." })
  .regex(/[^A-Za-z0-9]/, {
    message: "The password must contain at least one special character.",
  });

export { passwordValidation };

const emailValidation = z
  .string()
  .email({ message: "Invalid email address." })
  .max(256, {
    message: "The e-mail address must not be longer than 256 characters.",
  });

export { emailValidation };
