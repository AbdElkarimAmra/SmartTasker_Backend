const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");// needed to specify the path of the file(api files in this case)


const options ={
    definition: {
        openapi: "3.0.0",
        info:{
            title: "Task Manager API",
            version: "0.1.0",
            description: "API documentation for Task Manager, made with express and documented with swagger",
            license: {
                name: "MIT",
                url: "https://choosealicense.com/licenses/mit/"
            },
            contact: {
                name: "AbdElkarim Amra",
                url: "https://github.com/AbdElkarimAmra",
                email: "karimamra2004@gmail.com"
            },
        },

        servers:  [
            
            {
                url: "http://localhost:3001",
                description: "testing server"
            },

        ]

        
   
        },
        apis:[path.join(__dirname, "..", "**/*.js" )],// path.join(__dirname, "./Users/users.router.js") is the path of the file(api files in this case
    }

const specs = swaggerJsdoc(options);

module.exports = specs;

