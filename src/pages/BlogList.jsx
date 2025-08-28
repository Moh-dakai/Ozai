import React from "react";

const BlogList = ({ blogs, onDeleteBlog, onEditBlog }) => {
  if (!blogs.length) {
    return <p className="no-blogs">No blogs available.</p>;
  }

  return (
    <div className="blog-list">
      {blogs.map((blog) => (
        <div className="blog-preview" key={blog._id}>
          <h2>{blog.title}</h2>
          <p><strong>Author:</strong> {blog.author}</p>
          <p>{blog.content}</p>
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
      ))}
    </div>
  );
};

export default BlogList;
