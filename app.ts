import express from "express";
import authRouter from "./routes/auth.routes";
import cors from "cors";

const app = express();
const port = 3000;

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
