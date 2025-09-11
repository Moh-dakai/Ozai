import { useEffect, useState } from "react";
import BlogForm from "../components/BlogForm";
import BlogList from "./BlogList";

const API_URL = "https://ozai-9gqx.onrender.com/blogs";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // fetch all blogs (public)
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setBlogs)
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  // add new blog
  const addBlog = async (blog) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ title: blog.title, content: blog.context }),
    });
    const newBlog = await res.json();
    setBlogs([newBlog, ...blogs]);
  };

  // update blog
  const updateBlog = async (updatedBlog) => {
    const res = await fetch(`${API_URL}/${updatedBlog._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ title: updatedBlog.title, content: updatedBlog.context }),
    });
    const savedBlog = await res.json();
    setBlogs(blogs.map((b) => (b._id === savedBlog._id ? savedBlog : b)));
    setEditingBlog(null);
  };

  // delete blog
  const deleteBlog = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders },
    });
    setBlogs(blogs.filter((b) => b._id !== id));
  };

  return (
    <div>
      {token ? (
        <BlogForm
          onAddBlog={addBlog}
          onUpdateBlog={updateBlog}
          editingBlog={editingBlog}
          onCancelEdit={() => setEditingBlog(null)}
        />
      ) : (
        <p className="mb-4">Login with Google to create or edit blogs.</p>
      )}

      <BlogList
        blogs={blogs}
        onDeleteBlog={deleteBlog}
        onEditBlog={setEditingBlog}
      />
    </div>
  );
}
