const {query} = require("express-validator");
const { is } = require("express/lib/request");

const getTaskValidator = [
    query("limit", "limit must be an integer").optional().isInt().toInt({min:1}),
    query("limit").customSanitizer((value, {req}) => {
        return value || 5 //or //return value ? value : 5
    }),
    query("page", "page must be an integer").optional().isInt().toInt(),
    query("page").customSanitizer((value, {req}) => {
        return value || 1 //or //return value ? value : 1
    }),
    query("order", "order must be asc or desc").optional().isIn(["asc", "desc"]),  
     query("order").customSanitizer((value, {req}) => {
        return value || "asc" //or //return value ? value : "asc"
    })
]   

module.exports = getTaskValidator