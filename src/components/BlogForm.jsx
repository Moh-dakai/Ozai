import React, { useState, useEffect } from "react";

const BlogForm = ({ editingBlog, onCancelEdit, onAddBlog, onUpdateBlog }) => {
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");

  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title || "");
      setContext(editingBlog.content || "");
    } else {
      resetForm();
    }
  }, [editingBlog]);

  const resetForm = () => {
    setTitle("");
    setContext("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !context.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add a blog!");
      return;
    }

    try {
      // Prefer parent handlers so pages can update local state
      if (editingBlog && typeof onUpdateBlog === "function") {
        await onUpdateBlog({ ...editingBlog, title, context });
        resetForm();
        return;
      }

      if (!editingBlog && typeof onAddBlog === "function") {
        await onAddBlog({ title, context });
        resetForm();
        return;
      }

      // Fallback: call API directly if parent didn't provide handlers
      let url = "https://ozai-9gqx.onrender.com/blogs";
      let method = "POST";
      if (editingBlog) {
        url = `https://ozai-9gqx.onrender.com/blogs/${editingBlog._id || editingBlog.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content: context }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save blog");

      resetForm();
      // fallback navigation
      window.location.href = "/myblogs";
    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "Something went wrong.");
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit?.();
  };

  return (
    <form className="blog-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={context}
        onChange={(e) => setContext(e.target.value)}
        rows={6}
      />
      <div className="form-actions" style={{ display: "flex", gap: 8 }}>
        <button type="submit" className="btn read-more">
          {editingBlog ? "Update Blog" : "Add Blog"}
        </button>
        {editingBlog && (
          <button type="button" onClick={handleCancel} className="btn btn-outline">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BlogForm;