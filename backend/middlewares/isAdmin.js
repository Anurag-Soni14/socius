import {User} from "../models/user.model.js"; // Import the User model

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.id); // Fetch user from DB
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.user = user; // Attach user object to request
        next();
    } catch (error) {
        console.error("Admin Check Error:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export default isAdmin;
