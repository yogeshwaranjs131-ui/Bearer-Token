const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token
 * Expects token in Authorization header as "Bearer <token>"
 * Attaches user information to req.user
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route. Please provide a valid token.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user ID to request object
      req.user = { id: decoded.id };

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired",
        });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during token verification",
    });
  }
};
