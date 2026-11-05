
const dotenv = require("dotenv");

process.env.NODE_ENV =
  process.env.NODE_ENV || "development";

dotenv.config();
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});

const express = require("express");
const mongoose = require("mongoose");
const configureApp = require("./settings/config");

const app = express();

// Register middleware and routes only once
configureApp(app);

// Handle Express errors
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({
    error: "Internal server error"
  });
});

// Vercel imports this Express application
module.exports = app;

// Local development only, for now.
// MongoDB on Vercel will be configured later.
if (!process.env.VERCEL) {
  const { DB_USER, DB_PASS, PORT } = process.env;

  if (!DB_USER || !DB_PASS) {
    console.error("Missing MongoDB credentials");
    process.exitCode = 1;
  } else {
    const username = encodeURIComponent(DB_USER);
    const password = encodeURIComponent(DB_PASS);

    const uri =
      `mongodb+srv://${username}:${password}` +
      `@nodejs.1vboval.mongodb.net/`;

    mongoose
      .connect(uri, { dbName: "fullstackTasks" })
      .then(() => {
        console.log("Connected to MongoDB");

        app.listen(PORT || 3001, () => {
          console.log(
            `Backend listening on port ${PORT || 3001}`
          );
        });
      })
      .catch((error) => {
        console.error(
          "MongoDB connection failed:",
          error.message
        );
        process.exitCode = 1;
      });
  }
}
