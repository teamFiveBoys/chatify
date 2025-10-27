import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./lib/db.js"; // adjust if your db file is elsewhere
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g. your frontend link
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Root route (for Vercel to not show 404)
app.get("/", (req, res) => {
  res.send("🚀 Backend API is running successfully!");
});

// ✅ Serve frontend (only when in production)
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Connect DB and start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port: ${PORT}`);
});

export default app;