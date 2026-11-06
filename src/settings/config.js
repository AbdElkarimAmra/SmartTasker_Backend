// src/settings/config.js (CJS)
const dotenv = require("dotenv");
process.env.NODE_ENV = process.env.NODE_ENV || "development";
dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const express = require("express");
const morgan = require("morgan");


const router = require("../tasks/tasksrouter");
const authRouter = require("../authuntication/auth.router");
const usersRouter = require("../Users/users.router");
const aiRouter = require("../AI/AI.router");

const responseFormatter = require("../middleware/responseFormatter");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const specs = require("../settings/swagger.config");

// ✅ use your existing middleware file (no ".middleware" suffix)
const authenticateToken = require("../middleware/authenticateToken.middleware");

function configureApp(app) {
  app.use(express.json());

  // common middleware
  app.use(responseFormatter.requestFormatter);

  // CORS (adjust origin as needed)
  app.use(
    cors({
      origin: "smart-tasker-react-g0jcr7b81-kemo24.vercel.app" || true,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  );

  app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  
  // Handle the preflight OPTIONS request for private networks specifically
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
  
  app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "SmartTasker Backend"
  });
});

  // access logs

  app.use(morgan("combined"))

  // -------- Routes --------
  // Public (no JWT)
  app.use("/auth", authRouter); // login/register/refresh

  // Protected (require JWT)
  app.use("/AI", authenticateToken, aiRouter);
  app.use("/Users", usersRouter);

  // If tasks should require login, keep this:
  app.use("/", authenticateToken, router);

  // If tasks should be public instead, use this line and remove the line above:
  // app.use("/", router);

  // Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  // 404
  app.use((req, res) => res.status(404).json(null));
}

module.exports = configureApp;
