const{Schema, model} = require("mongoose");
const { validate } = require("../tasks/task.schema");


const userSchema = new Schema ({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, "First name can not be more than 100 characters"],
    } ,
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, "Last name can not be more than 100 characters"],
    } ,
    email: {
        type: String,
        required:true ,
        trim: true,
        unique: true ,
        lowercase: true,
        validate: {validator:function (email) {
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        },
        message: () => {"Email is not valid. please enter a valid email address"},
    

}
},

password: {
        type: String,
        required:true ,
},
});



const UserModel = model("User", userSchema);
module.exports = UserModel;
/**
 * @swagger
 *
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    required:
 *      - firstName
 *      - email
 *      - password
 *    properties:
 *      firstName:
 *        type: string
 *        description: The first name of the user
 *        maxLength: 100
 *      lastName:
 *        type: string
 *        description: The last name of the user
 *        maxLength: 100
 *      email:
 *        type: string
 *        description: A valid email address
 *      password:
 *        type: string
 *        description: Must contain 8 characters and also a number, a capital letter and a special character
 *    example:
 *      firstName: John
 *      lastName: Doe
 *      email: john@doe.com
 *      password: Password123#
 *  */