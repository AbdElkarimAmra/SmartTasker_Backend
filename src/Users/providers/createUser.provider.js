

const { matchedData } = require("express-validator");
const UserModel = require("../user.schema");
const errorLogger = require("../../helpers/errorLogger");
const {StatusCodes} = require("http-status-codes");
const bcrypt = require("bcrypt");
const getUserByEmail = require("./getUserByEmail");
const { get } = require("mongoose");
async function createUserProvider(req, res) {

    const validatedData = matchedData(req);
    try {
        const existingUser = await getUserByEmail(validatedData.email);
        if(existingUser){
            return res.status(StatusCodes.CONFLICT).json({reason: "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        validatedData.password = await bcrypt.hash(validatedData.password, salt);
        const user = new UserModel({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email:  validatedData.email,
        password: validatedData.password
    })
        const savedUser =  await user.save();
        delete savedUser.password
        return res.status(StatusCodes.CREATED).json({
            _id: savedUser._id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email
        });

    } catch (error) {
        errorLogger(`Error creating a new user: ${error.message}`, req, error);
        return res.status(StatusCodes.GATEWAY_TIMEOUT).json({reason: "Unable to process the request at the moment. Please try again later."});
    }
}

module.exports = createUserProvider;