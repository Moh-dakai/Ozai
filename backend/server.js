// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); //  Load environment variables

const app = express();
app.use(cors());
app.use(bodyParser.json());

//  1. Connect to MongoDB Atlas (using .env)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

//  2. Define Blog Schema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);

//  3. Routes
// Get all blogs
app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

// Create blog
app.post("/blogs", async (req, res) => {
  const { title, author, content } = req.body;
  const newBlog = new Blog({ title, author, content });
  await newBlog.save();
  res.json(newBlog);
});

// Update blog (edit feature)
app.put("/blogs/:id", async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, author, content },
      { new: true } // return the updated blog
    );
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: "Error updating blog" });
  }
});

// Delete blog
app.delete("/blogs/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

//  4. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
