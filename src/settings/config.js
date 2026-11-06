
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

// Routes
const router = require("../tasks/tasksrouter");
const authRouter = require("../authuntication/auth.router");
const usersRouter = require("../Users/users.router");
const aiRouter = require("../AI/AI.router");

// Middleware
const responseFormatter = require("../middleware/responseFormatter");
const authenticateToken = require("../middleware/authenticateToken.middleware");

// Swagger
const specs = require("./swagger.config");

function configureApp(app, databaseMiddleware) {

  // 1. Parse incoming JSON requests
  app.use(express.json());

  // 2. Format requests
  app.use(responseFormatter.requestFormatter);

  // 3. CORS configuration
  const allowedOrigins = [
    "http://localhost:5174",
    "https://smart-tasker-react.vercel.app",
    "https://smart-tasker-react-g0jcr7b81-kemo24.vercel.app",
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  );

  // 4. HTTP request logging
  // Console output works on Vercel
  app.use(morgan("combined"));

  // 5. Public health check
  // Does not require authentication or MongoDB
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      service: "SmartTasker Backend",
    });
  });

  // 6. Database connection middleware
  // Connect to MongoDB before handling API requests
  if (typeof databaseMiddleware !== "function") {
    throw new Error("databaseMiddleware must be provided");
  }

  app.use(databaseMiddleware);

  // 7. Public authentication routes
  app.use("/auth", authRouter);

  // 8. AI routes - protected by JWT
  app.use("/AI", authenticateToken, aiRouter);

  // 9. User routes
  // Preserve existing route-level authentication behavior
  app.use("/Users", usersRouter);

  // 10. Swagger documentation
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );

  // 11. Protected task routes
  app.use("/", authenticateToken, router);

  // 12. Handle unknown routes
  app.use((req, res) => {
    res.status(404).json({
      status: "error",
      message: "Route not found",
    });
  });
}

module.exports = configureApp;
