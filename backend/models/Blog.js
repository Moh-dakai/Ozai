import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,       // display name
  authorEmail: String,  // unique identifier
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);
