import React, { useState } from "react";
import { Link } from "react-router-dom";

const BlogList = ({ blogs = [], onDeleteBlog, onEditBlog }) => {
  const [search, setSearch] = useState("");
  const userId = localStorage.getItem("userId"); // stored in AuthHandler.jsx

  if (!blogs || blogs.length === 0) {
    return <p className="no-blogs">No blogs available.</p>;
  }

  // Filter blogs based on search
  const filteredBlogs = blogs.filter((blog) =>
    (blog.title || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (blog.author || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!onDeleteBlog) return;
    if (!confirm("Are you sure you want to delete this blog?")) return;
    onDeleteBlog(id);
  };

  return (
    <div className="blog-list-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="blog-list">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div className="blog-preview" key={blog._id || blog.id}>
              <h2>
                <Link to={`/blogs/${blog._id || blog.id}`}>{blog.title}</Link>
              </h2>
              <p><strong>Author:</strong> {blog.author}</p>
              <p>{(blog.content || "").substring(0, 120)}{(blog.content || "").length > 120 ? "..." : ""}</p>
              <p><small>{blog.createdAt ? new Date(blog.createdAt).toLocaleString() : ""}</small></p>

              {String(blog.userId) === String(userId) && (
                <div className="blog-actions">
                  {onEditBlog && (
                    <button onClick={() => onEditBlog(blog)} className="edit-btn">
                      Edit
                    </button>
                  )}
                  {onDeleteBlog && (
                    <button onClick={() => handleDelete(blog._id || blog.id)} className="delete-btn">
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No matching blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default BlogList;