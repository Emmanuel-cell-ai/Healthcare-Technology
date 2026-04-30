const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const alertRoutes = require("./routes/alertRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const chatRoutes = require("./routes/chatRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();
const configuredOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow common development origins by default or if they are in configuredOrigins
      const developmentOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
      ];

      if (
        !origin ||
        configuredOrigins.length === 0 ||
        configuredOrigins.includes("*") ||
        configuredOrigins.includes(origin) ||
        developmentOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      console.error(`CORS Error: Origin ${origin} not allowed. Allowed origins: ${configuredOrigins.join(", ") || "Defaults"}`);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
