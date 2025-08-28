import React, { useState, useEffect } from "react";
import Home from "./Home";
import BlogList from "./pages/BlogList";
import BlogForm from "./components/BlogForm";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const API_URL = "https://ozai-9gqx.onrender.com/blogs";

  // Fetch blogs
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setBlogs)
      .catch(err => console.error("Error fetching blogs:", err));
  }, []);

  // Add blog
  const addBlog = (blog) => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: blog.title,
        author: blog.author,
        content: blog.context,
      }),
    })
      .then(res => res.json())
      .then(newBlog => setBlogs([newBlog, ...blogs]))
      .catch(err => console.error("Error adding blog:", err));
  };

  // Delete blog
  const deleteBlog = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => setBlogs(blogs.filter(blog => blog._id !== id)))
      .catch(err => console.error("Error deleting blog:", err));
  };

  // Update blog
  const updateBlog = (updatedBlog) => {
    fetch(`${API_URL}/${updatedBlog._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: updatedBlog.title,
        author: updatedBlog.author,
        content: updatedBlog.context,
      }),
    })
      .then(res => res.json())
      .then(savedBlog => {
        setBlogs(blogs.map(blog => (blog._id === savedBlog._id ? savedBlog : blog)));
        setEditingBlog(null); // reset after update
      })
      .catch(err => console.error("Error updating blog:", err));
  };

  return (
    <div className="App">
      <Home />
      <BlogForm
        onAddBlog={addBlog}
        onUpdateBlog={updateBlog}
        editingBlog={editingBlog}
        onCancelEdit={() => setEditingBlog(null)}   /* <-- Cancel support */
      />
      <BlogList
        blogs={blogs}
        onDeleteBlog={deleteBlog}
        onEditBlog={setEditingBlog}
      />
    </div>
  );
}

export default App;
