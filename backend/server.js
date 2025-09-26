
// Load Environment Variables
require("dotenv").config();

// Imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const jwt = require("jsonwebtoken");

// App Config
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK =
  process.env.GOOGLE_CALLBACK_URL ||
  `https://ozai-9gqx.onrender.com/auth/google/callback`;

// Middleware

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Database Connection

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Models

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    googleId: String,
    email: String,
    name: String,
    picture: String,
  })
);

const Blog = mongoose.model(
  "Blog",
  new mongoose.Schema({
    title: String,
    author: String,
    content: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  })
);


// Passport Google OAuth

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: googleId, displayName, emails, photos } = profile;
        const email = emails?.[0]?.value;
        const name = displayName || email;
        const picture = photos?.[0]?.value;

        let user = await User.findOne({ googleId });
        if (!user) {
          user = await User.create({ googleId, email, name, picture });
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id).then((u) => done(null, u)).catch(done)
);

// Session Setup (required for OAuth handshake)

app.use(
  session({
    secret: process.env.SESSION_SECRET || "devsession",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set true in production
  })
);
app.use(passport.initialize());
app.use(passport.session());


// Auth Routes

// Start Google OAuth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback -> issue JWT -> redirect frontend
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/?auth=failed`,
  }),
  (req, res) => {
    const payload = {
      id: req.user._id.toString(),
      email: req.user.email,
      name: req.user.name,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.redirect(`${FRONTEND_URL}/auth?token=${token}`);
  }
);

// JWT Auth Middleware

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    req.user = jwt.verify(token, JWT_SECRET); // { id, email, name }
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}


// Public Blog Routes

app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

app.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch {
    res.status(400).json({ error: "Invalid blog ID" });
  }
});

// Protected Blog Routes

app.post("/blogs", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "Invalid user" });

    const newBlog = await Blog.create({
      title,
      author: user.name,
      content,
      userId: user._id,
    });
    res.json(newBlog);
  } catch (err) {
    res.status(400).json({ error: "Failed to create blog", details: err.message });
  }
});

app.put("/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    blog.title = req.body.title ?? blog.title;
    blog.content = req.body.content ?? blog.content;
    res.json(await blog.save());
  } catch (err) {
    res.status(400).json({ error: "Failed to update blog", details: err.message });
  }
});

app.delete("/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await blog.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete blog", details: err.message });
  }
});

// Fetch all blogs for logged-in user
app.get("/myblogs", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch {
    res.status(500).json({ error: "Failed to fetch user blogs" });
  }
});

// -----------------------------
// Start Server
// -----------------------------
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
