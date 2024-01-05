import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { loginUser } from "../../src/controllers/auth.controller";
import * as authService from "../../src/services/auth.service";

jest.mock("@prisma/client", () => {
  const originalModule = jest.requireActual("@prisma/client");
  const mock = jest.fn();

  // Mock the PrismaClient and its methods
  return {
    __esModule: true,
    ...originalModule,
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: mock,
        create: mock,
        delete: mock,
      },
    })),
  };
});

jest.mock("../../src/services/auth.service");

describe("Auth Controller - loginUser", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let prisma: PrismaClient;

  const mockUser = { id: 1, username: "testuser", password: "hashedpassword" };

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  beforeEach(() => {
    req = { body: { username: "testuser", password: "ValidPassword!123" } };
    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    (prisma.user.findUnique as jest.Mock).mockClear();
  });

  it("should successfully log in a user", async () => {
    // Mock Prisma client and authentication service methods
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (authService.comparePasswords as jest.Mock).mockResolvedValue(true);
    (authService.signTokens as jest.Mock).mockResolvedValue({
      accessToken: "fake-access-token",
      refreshToken: "fake-refresh-token",
    });

    // Call the loginUser function with the mocked request and response
    await loginUser(req as Request, res as Response);

    // Check if the cookies were set correctly
    expect(res.cookie).toHaveBeenCalledWith(
      "accessToken",
      "fake-access-token",
      expect.any(Object)
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "fake-refresh-token",
      expect.any(Object)
    );

    // Check if the response status and body are correct
    expect(res.status).toHaveBeenCalledWith(200); 
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      accessToken: "fake-access-token",
    });
  });

  it("should fail to log in with incorrect username", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should fail to log in with incorrect password", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (authService.comparePasswords as jest.Mock).mockResolvedValue(false);

    await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Incorrect username or password",
    });
  });
});
