const {body} = require("express-validator");

const deleteTaskValidator = [
    body("_id","valid id is required").notEmpty().isMongoId(),
]

module.exports = deleteTaskValidator