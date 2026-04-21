const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const alertRoutes = require("./routes/alertRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
  }),
);
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/alerts", alertRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
