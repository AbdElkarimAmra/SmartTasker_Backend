const {body} = require("express-validator");

const updateTaskValidator = [
    body("_id","valid id is required").isMongoId(),
    body("title", "The title cannot be empty").optional().isString().trim(),
    body("title", "the length of the title must not exceed 100 characters").optional().isLength({max:100}),
    body("dueDate", "dueDate has to be a valid ISO8601 string").optional().isISO8601(),
    body("description", "The description cannot be empty").optional().isString().trim().isLength({max:500}),
    body("description", "the length of the description must not exceed 500 characters").optional().isLength({max:500}),
    body("priority", "priority mut be low, normal or high").optional().isIn(["low", "normal", "high"]),
    body ("status", "status must be todo, inProgress or done").optional().isIn(["todo", "inProgress", "done"]),
]

module.exports = updateTaskValidator