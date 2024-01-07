import express, { Response } from "express";
import authRouter from "./routes/auth.routes";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;
app.use(cookieParser());

// Testing
app.get("/", async (_, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

// Body Parser
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Routes
app.use("/auth", authRouter);

// Initialize the Express server and listen on specified port
app.listen(port, () => {
  console.log(`Server on port: ${port}`);
});

export default app;
