import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes";
import userRoutes from "./routes/userRoutes";
import { connectDB } from "./config/db";
import {
  checkOllamaAvailability,
  checkRedisAvailability,
} from "./utils/startupChecks";

// Initialize configuration
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Length", "Authorization", "Content-Type"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
); // Allow CORS from all origins

// Routes
app.use("/api", chatRoutes);
app.use("/api", userRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  //connect to DB
  await connectDB();
  // Check if required services are running
  await checkRedisAvailability();
  await checkOllamaAvailability();
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});
