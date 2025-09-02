import React, { useState } from "react";
import { Link } from "react-router-dom";

const BlogList = ({ blogs, onDeleteBlog, onEditBlog }) => {
  const [search, setSearch] = useState("");

  if (!blogs.length) {
    return <p className="no-blogs">No blogs available.</p>;
  }

  // Filter blogs based on search term (title or author)
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase()) ||
    blog.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="blog-list-container">
      {/* Search Input */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Blog List */}
      <div className="blog-list">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div className="blog-preview" key={blog._id}>
              <h2>
                <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
              </h2>
              <p><strong>Author:</strong> {blog.author}</p>
              <p>{blog.content.substring(0, 100)}...</p>
              <p><small>{new Date(blog.createdAt).toLocaleString()}</small></p>

              <div className="blog-actions">
                <button onClick={() => onEditBlog(blog)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => onDeleteBlog(blog._id)} className="delete-btn">
                  Delete
                </button>
              </div>
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
