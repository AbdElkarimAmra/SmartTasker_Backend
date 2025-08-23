const {body} = require("express-validator");

const loginValidator = [
    body("email", "email is required").notEmpty().isEmail().trim(),
    body("password", "password is required").isLength({min:8}).isString(),
]
module.exports = loginValidator;