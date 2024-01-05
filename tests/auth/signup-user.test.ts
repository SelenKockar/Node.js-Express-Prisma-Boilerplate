import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { signupUser } from "../../src/controllers/auth.controller";

jest.mock("@prisma/client", () => {
  const originalModule = jest.requireActual("@prisma/client");

  // Mock the entire PrismaClient module
  return {
    __esModule: true,
    ...originalModule,
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        create: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
      },
    })),
  };
});

describe("Auth Controller - signupUser", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  beforeEach(() => {
    req = {
      body: {
        username: `testuser_${Date.now()}`,
        email: "test@example.com",
        password: "ValidPassword!123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should successfully register a user", async () => {
    await signupUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Registration is successful!",
    });
  });

  it("should fail to register a user with an invalid email", async () => {
    req.body.email = "invalidemail";
    await signupUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });

  it("should fail to register a user with an invalid password", async () => {
    req.body.password = "short";
    await signupUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });
});
