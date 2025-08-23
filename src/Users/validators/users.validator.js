const {body} = require("express-validator");

const createUserValidator= [
    body("firstName", "firstName cannot be empty").notEmpty(),
    body("firstName", "firstName must be a string").isString(),
    body("firstName", "the length of firstName must not exceed 100 characters").isLength({max:100}),
    body("lastName", "lastName cannot be empty").notEmpty().optional(),
    body("lastName", "lastName must be a string").isString(),
    body("lastName", "the length of lastName must not exceed 100 characters").isLength({max:100}),
    body("email", "email cannot be empty").notEmpty(),
    body("email", "email must be a string").isString(),
    body("email", "email must be a valid email").isEmail(),
    body("email", "email must be at most 200 characters").isLength({max:200}),
    body("password", "password cannot be empty").notEmpty(),
    body("password", "password must be a string").isString(),  
    body("password", "password must be at least 8 characters").isLength({min:8}), 
    body("password", "password must include at least one uppercase letter, one lowercase letter, one number and one special character").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
];

module.exports = createUserValidator