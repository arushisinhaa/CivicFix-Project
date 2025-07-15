const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const authSignup = require("./routes/authSignup");
const authLogin = require("./routes/authLogin");
const reportIssuesRouter = require("./routes/reportIssues");
const trackIssues = require("./routes/trackIssue.js");
const adminRoutes = require("./routes/admin");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://client-frontend-rosy.vercel.app",
].map((origin) => (origin.endsWith("/") ? origin.slice(0, -1) : origin));

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
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
app.options("*", cors(corsOptions));

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
  autoRemoveInterval: 10,
});

store.on("error", (err) => {
  console.log("MongoStore error:", err);
});

const isProduction = process.env.NODE_ENV === "production";
const isRender = isProduction && dbUrl.includes("render.com");

const sessionOptions = {
  store,
  secret: process.env.SECRET || "somesecret",
  resave: false,
  saveUninitialized: false,
  proxy: isProduction,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: isRender ? ".onrender.com" : undefined,
  },
};

app.use((req, res, next) => {
  if (req.method === "OPTIONS") return next();
  session(sessionOptions)(req, res, next);
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use("/api", authSignup);
app.use("/api", authLogin);
app.use("/api/issues", reportIssuesRouter);
app.use("/api/tracking", trackIssues);
app.use("/api/admin", adminRoutes);

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working",
    origin: req.headers.origin,
    cors: allowedOrigins.includes(req.headers.origin) ? "allowed" : "blocked",
    sessionId: req.sessionID,
    timestamp: new Date().toISOString(),
  });
});

// Error & 404
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
      console.log(
        `Session cookie domain: ${sessionOptions.cookie.domain || "not set"}`
      );
      console.log(`Secure cookies: ${sessionOptions.cookie.secure}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
