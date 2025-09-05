import React, { useState, useEffect } from "react";

const BlogForm = ({ onAddBlog, onUpdateBlog, editingBlog, onCancelEdit }) => {
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");

  // Load blog data into form when editing
  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title);
      setContext(editingBlog.content);
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
    if (!title || !context) return;

    const token = localStorage.getItem("token");

    if (editingBlog) {
      await onUpdateBlog({ ...editingBlog, title, context, token });
    } else {
      await onAddBlog({ title, context, token });
    }

    resetForm();
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
