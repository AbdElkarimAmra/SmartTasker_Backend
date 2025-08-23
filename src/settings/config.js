const dotenv = require("dotenv")

//if process.env.NODE_ENV is not set, it will be set to development
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config();
dotenv.config({path: envFile});

const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const router = require("../tasks/tasksrouter");
const authRouter = require("../authuntication/auth.router");
const usersRouter = require("../Users/users.router");
const responseFormatter = require("../middleware/responseFormatter");
const expressWinstonLogger = require("../middleware/expressWinston.middleware");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const  specs  = require("../settings/swagger.config");

function configureApp(app) {
    app.use(responseFormatter.requestFormatter);
    app.use(expressWinstonLogger);

    app.use(cors());

    let accessLogStream = fs.createWriteStream(path.join(__dirname, "..","access.log"), {
        flags: "a", //appends to the existing files of logs. does not overwrite the file
    });

    app.use(morgan("combined", {stream: accessLogStream}));

    app.use("/", router);
    app.use("/auth", authRouter);
    app.use("/Users", usersRouter);
    
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs)); // these are swaggerSpecs

    app.use((req, res) => {
    res.status(404).json(null)
})
}

module.exports = configureApp;