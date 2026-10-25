const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const publicUser = (user) => ({
  _id: user._id,
  email: user.email,
});

const createToken = (user) => jwt.sign(
  { email: user.email, id: user._id.toString() },
  process.env.SECRET_KEY,
  { expiresIn: "7d" },
);

const userSignUp = async (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const { password } = req.body;
  if (!email || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists", error: "An account with this email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });
  return res.status(201).json({ token: createToken(user), user: publicUser(user) });
};

const userLogin = async (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const { password } = req.body;
  if (!email || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password", error: "Invalid email or password" });
  }

  return res.json({ token: createToken(user), user: publicUser(user) });
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("email");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json({ email: user.email });
};

module.exports = { userLogin, userSignUp, getUser };
