import express, { Request, Response } from "express";
import request from "supertest";
import { validateUserCredentials } from "../../src/middleware/validateUser";

// Create a temporary Express application for testing
const testApp = express();
testApp.use(express.json());
testApp.post(
  "/test-signup",
  validateUserCredentials,
  (req: Request, res: Response) => {
    res.status(200).json({ message: "Validation successful" });
  }
);

describe("User Credentials Validation Middleware", () => {
  it("should fail to sign up a user with an invalid email", async () => {
    const response = await request(testApp).post("/test-signup").send({
      email: "invalidemail",
      password: "ValidPassword!123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should fail to sign up a user with an invalid password", async () => {
    const response = await request(testApp).post("/test-signup").send({
      email: "valid@example.com",
      password: "invalid",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
