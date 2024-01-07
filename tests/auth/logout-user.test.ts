import { Request, Response } from "express";
import { logoutUser } from "../../src/controllers/auth.controller";

describe("Auth Controller - logoutUser", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should successfully log out a user", async () => {
    await logoutUser(req as Request, res as Response);

    expect(res.cookie).toHaveBeenCalledWith(
      "accessToken",
      "",
      expect.objectContaining({ expires: new Date(0) })
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "",
      expect.objectContaining({ expires: new Date(0) })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
  });
});
