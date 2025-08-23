
const winston = require("winston");
const path = require("path");

/**error levels for winston
 * error: 0,   
 * warn: 1,
 * info: 2,
 * verbose: 3,
 * debug: 4, 
 * silly: 5
 */

const transports = [
    new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
            winston.format.colorize(),
        )
    }),

    new winston.transports.File({
        level: "info",
        filename: path.join(__dirname, "../..", "info.log"),
        format: winston.format.json()
        
    }),


     new winston.transports.File({
        level: "error",
        filename: path.join(__dirname, "../..", "error.log"),
        format: winston.format.json()
    })
];
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: "DD-MM-YYYY HH:mm:ss"
        }),
        winston.format.printf((info) => {
               return `${info.timestamp} [${info.level}]: ${info.message}`
        })
    ),
    transports: transports
})


module.exports = logger;