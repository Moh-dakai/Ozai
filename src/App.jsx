import React, { useState, useEffect } from 'react';
import Home from './Home';
import BlogList from './pages/BlogList';
import BlogForm from './components/BlogForm';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);

  // Fetch blogs from backend
  useEffect(() => {
    fetch('https://ozai-9gqx.onrender.com/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data));
  }, []);

  // Add blog via backend
  const addBlog = (blog) => {
    fetch('https://ozai-9gqx.onrender.com/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: blog.title,
        author: blog.author,
        content: blog.context
      })
    })
      .then(res => res.json())
      .then(newBlog => setBlogs([newBlog, ...blogs]));
  };

  // Delete blog via backend
  const deleteBlog = (id) => {
    fetch(`https://ozai-9gqx.onrender.com/blogs/${id}`, {
      method: 'DELETE'
    })
      .then(() => setBlogs(blogs.filter(blog => blog._id !== id)));
  };

  // Start editing a blog
  const startEditBlog = (blog) => {
    setEditingBlog(blog);
  };

  // Update blog via backend
  const updateBlog = (updatedBlog) => {
    fetch(`https://ozai-9gqx.onrender.com/blogs/${updatedBlog._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updatedBlog.title,
        author: updatedBlog.author,
        content: updatedBlog.context
      })
    })
      .then(res => res.json())
      .then(savedBlog => {
        setBlogs(blogs.map(blog => (blog._id === savedBlog._id ? savedBlog : blog)));
        setEditingBlog(null);
      });
  };

  return (
    <div className="App">
      <Home />
      <BlogForm 
        onAddBlog={addBlog} 
        onUpdateBlog={updateBlog} 
        editingBlog={editingBlog} 
      />
      <BlogList 
        blogs={blogs} 
        onDeleteBlog={deleteBlog} 
        onEditBlog={startEditBlog} 
      />
    </div>
  );
}

export default App;
