import React from 'react';

const BlogList = ({ blogs, onDeleteBlog }) => {
  return (
    <div className="blog-list">
      {blogs.map(blog => (
        <div className="blog-preview" key={blog.id}>
          <h2>{blog.title}</h2>
          <p><strong>Author:</strong> {blog.author}</p>
          <p>{blog.context}</p>
          <button className="delete-btn" onClick={() => onDeleteBlog(blog.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default BlogList;