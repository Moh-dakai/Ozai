import React, { useState, useEffect } from "react";

const BlogForm = ({ onAddBlog, onUpdateBlog, editingBlog, onCancelEdit }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [context, setContext] = useState("");

  // Load blog data into form when editing
  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title);
      setAuthor(editingBlog.author);
      setContext(editingBlog.content);
    } else {
      resetForm();
    }
  }, [editingBlog]);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setContext("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !context) return;

    if (editingBlog) {
      onUpdateBlog({ ...editingBlog, title, author, context });
    } else {
      onAddBlog({ title, author, context });
    }

    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit?.(); // only call if passed from App.jsx
  };

  return (
    <form className="blog-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <textarea
        placeholder="Context"
        value={context}
        onChange={(e) => setContext(e.target.value)}
        rows={4}
      />
      <div className="form-actions">
        <button type="submit">
          {editingBlog ? "Update Blog" : "Add Blog"}
        </button>
        {editingBlog && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BlogForm;
