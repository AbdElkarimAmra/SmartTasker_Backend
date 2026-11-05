const dotenv = require("dotenv")

//if process.env.NODE_ENV is not set, it will be set to development
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config();
dotenv.config({path: envFile});

const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");


const router = require("./tasks/tasksrouter");
const authRouter = require("./authuntication/auth.router");
const usersRouter = require("./Users/users.router");
const aiRouter = require("./AI/AI.router");
const responseFormatter = require("./middleware/responseFormatter");
const expressWinstonLogger = require("./middleware/expressWinston.middleware");

const mongoose = require("mongoose");

const cors = require("cors");

const configureApp = require("./settings/config");
const { table } = require("console");
const {DB_USER, DB_PASS, PORT} = process.env;
console.log("DB_USER:", JSON.stringify(DB_USER));           // shows hidden whitespace
console.log("DB_PASS length:", DB_PASS?.length);            // no password printed
console.log("Encoded user/pass lengths:", encodeURIComponent(DB_USER).length, encodeURIComponent(DB_PASS).length);

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("TEST_VARIABLE:", process.env.TEST_VARIABLE);

const app = express();  


app.use(express.json());

configureApp(app);

app.use(responseFormatter.requestFormatter);
app.use(expressWinstonLogger);


let accessLogStream = fs.createWriteStream(path.join(__dirname, "..","access.log"), {
    flags: "a", //appends to the existing files of logs. does not overwrite the file
});

app.use(morgan("combined", {stream: accessLogStream}));

const middleware = function (req, res, next) {
    req.info = {app: "my app", version: "1.0.0"}
    next();
}
app.use(middleware);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.codeName || err.message });
});

async function bootstrap(){
    try{
        await mongoose.connect("mongodb+srv://" + DB_USER + ":" + DB_PASS + "@nodejs.1vboval.mongodb.net/"  , 
            {dbName: "fullstackTasks"});
        console.log("connected to MongoDB");
        app.listen(PORT, () => {
        console.log("app is listening on port 3001"); 
        });
        console.log(process.env.NODE_ENV);
    }

    catch(error) {
        console.log(error);
        process.exit(1);
    }
}
bootstrap();



