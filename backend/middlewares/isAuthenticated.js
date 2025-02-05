import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
    try {
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized. Token is missing.",
          success: false,
        });
      }
  
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
  
      req.id = decoded.userId;
      next();
    } catch (error) {
      console.error("Authentication Error:", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired. Please log in again.",
          success: false,
        });
      }
      return res.status(500).json({
        message: "Authentication failed.",
        error: error.message,
        success: false,
      });
    }
  };
  
  export default isAuthenticated;