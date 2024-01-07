import { Router, Request, Response } from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller";
import authenticate from "../middleware/authenticate";
import { validateUserCredentials } from "../middleware/validateUser";

const router = Router();

router.post("/signup", validateUserCredentials, (req: Request, res: Response) =>
  signupUser(req, res)
);
router.post("/login", (req: Request, res: Response) => loginUser(req, res));
router.post("/logout", (req: Request, res: Response) => logoutUser(req, res));
router.get("/protected", authenticate, (req: Request, res: Response) => {
  res.send("This is a protected area");
});

export default router;
