const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authorization = req.get("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!process.env.SECRET_KEY) {
    return res.status(500).json({ message: "Server misconfiguration: SECRET_KEY is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (typeof decoded === "string" || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
