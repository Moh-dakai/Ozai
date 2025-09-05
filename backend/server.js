// server.js (CommonJS)
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const jwt = require("jsonwebtoken");

const app = express();

// Config
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK = process.env.GOOGLE_CALLBACK_URL || `https://ozai-9gqx.onrender.com/auth/google/callback`;

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// --- Mongoose (connect) ---
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// --- Models ---
const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  picture: String,
});
const User = mongoose.model("User", userSchema);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // owner
  createdAt: { type: Date, default: Date.now },
});
const Blog = mongoose.model("Blog", blogSchema);

// --- Passport Google strategy ---
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || email;
        const picture = profile.photos?.[0]?.value;

        let user = await User.findOne({ googleId });
        if (!user) {
          user = await User.create({ googleId, email, name, picture });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const u = await User.findById(id);
    done(null, u);
  } catch (err) {
    done(err);
  }
});

// Session (passport uses it during OAuth handshake)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "devsession",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // on production behind https, set secure: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ---------- AUTH ROUTES ----------
// start Google OAuth
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback -> create JWT -> redirect to frontend with token
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/?auth=failed` }),
  (req, res) => {
    // req.user is DB user
    const payload = { id: req.user._id.toString(), email: req.user.email, name: req.user.name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "4h" });

    // Redirect back to frontend with token (quick-start approach)
    const redirectUrl = `${FRONTEND_URL}/auth?token=${token}`;
    res.redirect(redirectUrl);
  }
);

// ---------- JWT auth middleware ----------
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email, name }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ---------- Existing public blog routes (kept, minimal changes) ----------
// Get all blogs (public)
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Get single blog by ID (public)
app.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: "Invalid blog ID" });
  }
});

// ---------- Protected routes (require auth) ----------

// Create blog (authenticated)
app.post("/blogs", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "Invalid user" });

    const newBlog = new Blog({
      title,
      author: user.name,
      content,
      userId: user._id,
    });
    const saved = await newBlog.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create blog", details: err.message });
  }
});

// Update blog (only owner can update)
app.put("/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (!blog.userId || blog.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this blog" });
    }

    blog.title = req.body.title ?? blog.title;
    blog.content = req.body.content ?? blog.content;
    // (author and userId should not be overwritten by client)
    const saved = await blog.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to update blog", details: err.message });
  }
});

// Delete blog (only owner can delete)
app.delete("/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (!blog.userId || blog.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete blog", details: err.message });
  }
});

// My blogs (user-specific)
app.get("/myblogs", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user blogs" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
