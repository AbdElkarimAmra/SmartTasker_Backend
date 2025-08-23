
const expressWinston = require("express-winston");
const logger = require("../helpers/winston.helper");


const expressWinstonLogger = expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} respnded with {{res.statusCode}} in {{responseTime}}ms",
    expressFormat: true,
    colorize: true,
});

module.exports = expressWinstonLogger;