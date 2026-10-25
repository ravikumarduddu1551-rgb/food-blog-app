const mongoose = require("mongoose");

const connectDB = async () => {
  const connectionString = process.env.CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("CONNECTION_STRING is not configured");
  }

  await mongoose.connect(connectionString);
  console.log("MongoDB connected");
};

module.exports = connectDB;
