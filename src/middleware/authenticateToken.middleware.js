
const{StatusCodes} = require("http-status-codes");
const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];//// Use short-circuit (&&) to return the token part of "Bearer <token>" only if authHeader exists

    if(!token){
        return res.status(StatusCodes.UNAUTHORIZED).json({message: "You are not authorized to access this resource. Please log in"});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err){
            return res.status(StatusCodes.FORBIDDEN).json({message: "Please log in again. Invalid token"});
        
        }

        req.user = user;
        next();
    })

    
}

module.exports = authenticateToken;