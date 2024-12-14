import jwt from "./jsonwebtoken";
const isAuthenticated = (req, res, next)=>{
    try {
        const token = req.cookie.token;

        if(!token){
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message: "invalid token",
                success: false
            })
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error)
    }
}

export default isAuthenticated;