import express from "express";

const app = express();
const port = 3000;

// Initialize the Express server and listen on specified port
app.listen(port, () => {
  console.log(`Server on port: ${port}`);
});

