const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const authSignup = require("./routes/authSignup");
const authLogin = require("./routes/authLogin");
const reportIssuesRouter = require("./routes/reportIssues");
const trackIssues = require("./routes/trackIssue.js");
const adminRoutes = require("./routes/admin");
require("dotenv").config();

const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://client-frontend-rosy.vercel.app",
].map((origin) => (origin.endsWith("/") ? origin.slice(0, -1) : origin));

// Consolidated CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`🚫 Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Set-Cookie"],
  maxAge: 86400,
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Other middleware
app.use(cookieParser());
app.use(express.json());

const dbUrl = process.env.ATLASDB;
console.log(`MongoDB URL: ${dbUrl ? "Connected" : "Not found"}`);

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "somesecret",
  },
  touchAfter: 600,
  autoRemove: "interval",
  autoRemoveInterval: 10, // Clean up expired sessions every 10 minutes
});

store.on("error", (err) => {
  console.log("❌ MongoStore error:", err);
});

// --- COOKIE DOMAIN FIX STARTS HERE ---
const isProduction = process.env.NODE_ENV === "production";
const isRender = isProduction && dbUrl.includes("render.com");

const sessionOptions = {
  store,
  secret: process.env.SECRET || "somesecret",
  resave: false,
  saveUninitialized: false,
  proxy: isProduction, // Trust reverse proxy in production
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProduction, // Always true in production
    sameSite: isProduction ? "none" : "lax",
    // Domain fix: Only set domain for Render deployments
    domain: isRender ? ".onrender.com" : undefined,
  },
};
// --- COOKIE DOMAIN FIX ENDS HERE ---

// Skip session for OPTIONS requests
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return next();
  session(sessionOptions)(req, res, next);
});

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use("/api", authSignup);
app.use("/api", authLogin);
app.use("/api/issues", reportIssuesRouter);
app.use("/api/tracking", trackIssues);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/admin", adminRoutes);

// Test endpoint with CORS verification
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working",
    origin: req.headers.origin,
    cors: allowedOrigins.includes(req.headers.origin) ? "allowed" : "blocked",
    sessionId: req.sessionID,
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(", ")}`);
      console.log(
        `🔒 Session cookie domain: ${sessionOptions.cookie.domain || "not set"}`
      );
      console.log(`🔐 Secure cookies: ${sessionOptions.cookie.secure}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
