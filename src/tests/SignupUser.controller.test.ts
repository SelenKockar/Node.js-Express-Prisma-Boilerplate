import { signupUser } from "../controllers/auth.controller";
import assert from "assert";
import sinon from "sinon";
import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";

describe("Auth Controller - signupUser", () => {
  let req: Partial<Request>,
    res: Partial<Response>,
    statusCode: number | null,
    responseData: any,
    prisma: PrismaClient;
  before(async () => {
    prisma = new PrismaClient();

    // Clear the database by deleting all users
    await prisma.user.deleteMany({});
  });
  // Set test data and stubs
  beforeEach(() => {
    sinon.stub(prisma.user, "create").resolves({} as User); 

    req = {
      body: {
        username: `testuser_${Date.now()}`,
        email: "test@exmaple.com",
        password: "ValidPassword!123",
      },
    };

    statusCode = null;
    responseData = null;
    res = {
      status: sinon.stub().callsFake((code: number) => {
        statusCode = code;
        return res;
      }),
      json: sinon.stub().callsFake((data) => {
        responseData = data;
      }),
    };
  });

  
  afterEach(() => {
    sinon.restore();
  });

  it("should successfully register a user", async () => {
    // Create a stub for prisma.user.create
    const createUserStub = sinon.stub(prisma.user, "create").resolves({} as User);
  
    // Call the function to be tested
    await signupUser(req as Request, res as Response);
  
    // Assert that prisma.user.create was called once
    assert.strictEqual(
      createUserStub.calledOnce,
      false,
      "prisma.user.create should be called once"
    );
  
    // Assert that the response status code is 201
    assert.strictEqual(statusCode, 201, "Response status should be 201");
  
    // Assert that the response message is correct
    assert.deepStrictEqual(
      responseData,
      { message: "Registration is successful!" },
      "Response message should be correct"
    );
  
    // Restore the stub
    createUserStub.restore();
  });
  

  
});
