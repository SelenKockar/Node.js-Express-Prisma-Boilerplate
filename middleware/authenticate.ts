import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

interface RequestWithUser extends Request {
  user?: JwtPayload | string;
}

const authenticate = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;

  if (!token) {
    return res.status(401).send("No token provided.");
  }

  const decoded = verifyJwt(token, "accessToken");

  if (!decoded) {
    return res.status(403).send("Invalid token.");
  }

  req.user = decoded;
  next();
};

export default authenticate;
