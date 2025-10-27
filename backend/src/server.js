const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { connectDB } = require("./lib/db"); // ✅ relative to backend/src
const authRoutes = require("./routes/auth.route");
const messageRoutes = require("./routes/message.route");

const app = express();

const ENV = process.env;
const PORT = ENV.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Serve frontend (for production)
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
  });
}

// ✅ Connect DB (for both)
connectDB();

// ✅ Export app for Vercel
module.exports = app;

// ✅ Only run locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}
