const path = require("node:path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/connectionDb");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.resolve(__dirname, "public")));
const userRoutes = require("./routes/user");
const recipeRoutes = require("./routes/recipe");
app.use("/api", userRoutes);
app.use("/api/recipe", recipeRoutes);
app.use("/", userRoutes);
app.use("/recipe", recipeRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON request body" });
  }
  if (error.name === "CastError") {
    return res.status(404).json({ message: "Resource not found" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }
  if (error instanceof require("multer").MulterError) {
    return res.status(400).json({ message: "Image upload failed. Use an image under 5 MB." });
  }
  return res.status(error.status || 500).json({
    message: error.status ? error.message : "An unexpected server error occurred",
  });
});

const startServer = async () => {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not configured");
  }
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Server startup failed:", error);
    process.exitCode = 1;
  });
}

module.exports = app;
