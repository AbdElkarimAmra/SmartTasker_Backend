
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

// Reuse a database connection across requests
let connectionPromise = null;

async function connectMongoDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    const { DB_USER, DB_PASS } = process.env;

    if (!DB_USER || !DB_PASS) {
      throw new Error("DB_USER or DB_PASS is missing");
    }

    const username = encodeURIComponent(DB_USER);
    const password = encodeURIComponent(DB_PASS);

    const uri =
      `mongodb+srv://${username}:${password}` +
      `@nodejs.1vboval.mongodb.net/`;

    connectionPromise = mongoose
      .connect(uri, {
        dbName: "fullstackTasks",
        serverSelectionTimeoutMS: 10000
      })
      .then(() => {
        console.log("MongoDB connected");
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
}

// Ensure database is available before DB-dependent routes
async function databaseMiddleware(req, res, next) {
  try {
    await connectMongoDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    res.status(503).json({
      status: "error",
      message: "Database temporarily unavailable"
    });
  }
}

// Register middleware and routes
configureApp(app, databaseMiddleware);

// Express error handler
app.use((err, req, res, next) => {
  console.error("Express error:", err);

  res.status(500).json({
    error: "Internal server error"
  });
});

// Export for Vercel
module.exports = app;

// Local development server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;

  connectMongoDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Startup failed:", error.message);
      process.exitCode = 1;
    });
}
