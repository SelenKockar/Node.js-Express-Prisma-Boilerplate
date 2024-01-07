import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { refresh } from "../../src/controllers/auth.controller";
import { verifyJwt, signJwt } from "../../src/utils/jwt";

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
      },
    })),
  };
});

jest.mock("../../src/utils/jwt");

describe("Auth Controller - refresh", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let prisma: PrismaClient;

  const mockUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
  };

  beforeEach(() => {
    prisma = new PrismaClient();
    req = {
      cookies: {
        refresh_token: "valid-refresh-token",
      },
    } as Partial<Request>;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    // Reset mock implementations
    (prisma.user.findUnique as jest.Mock).mockReset();
    (verifyJwt as jest.Mock).mockReset();
    (signJwt as jest.Mock).mockReset();
  });

  it("should successfully refresh access token", async () => {
    (verifyJwt as jest.Mock).mockReturnValue({ sub: mockUser.id });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (signJwt as jest.Mock).mockReturnValue("new-access-token");

    await refresh(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({ accessToken: "new-access-token" });
    expect(res.status).not.toHaveBeenCalledWith(403);
  });
});
