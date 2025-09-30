
const errorLogger = require("../../helpers/errorLogger");
const Task = require("../../tasks/task.schema")
const {StatusCodes} = require("http-status-codes");
const {matchedData} = require("express-validator");
const UserModel = require("../../Users/user.schema");
const getUserByEmail = require("../../Users/providers/getUserByEmail");
const bcrypt = require("bcrypt");

const generateTokenProvider = require("./generateTokenProvider");
async function  loginProvider(req, res) {

    try {
        const validatedData = matchedData(req);
        const { email, password } = matchedData(req);
        console.log('[login] validatedData:', { email: !!email, password: !!password });

        //get the specific use loggin in
        
const user = await getUserByEmail(email?.toLowerCase());
console.log('[login] user exists:', !!user, 'hasPassword:', !!user?.password);        
        //check if the hashed password is correct by comparing the password in the incoming request validated.data.password with the password in the database for user available thorugh user.password
        const result = await bcrypt.compare(validatedData.password, user.password);
        
        if (!result){
            return res.status(StatusCodes.UNAUTHORIZED).json({reason: "Invalid credentials. Please try again."});
        }
        const token = await generateTokenProvider(user);
        return res.status(StatusCodes.OK).json({
            accessToken: token,
            firstName: user.firstName,
            lastName: user.lastName,
            email:user.email,  
        }
        );
    } catch (error) {
        errorLogger("Error while trying to login", req, error);
        return res.status(StatusCodes.GATEWAY_TIMEOUT).json(
            {reason: "unable to process ur request at the moment"}
        )
    }
}  

module.exports = loginProvider